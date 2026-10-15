const crypto = require('node:crypto');
const { ApiAuthError } = require('./auth-service');

function createBillingService({ stripe, auth, store, plans, priceId, baseUrl }) {
  function planForSubscription(subscription) {
    if (!['active','trialing'].includes(subscription.status)) return null;
    const items=subscription.items?.data || [];
    if(items.length !== 1 || items[0].quantity !== 1) return null;
    const price=items[0].price;
    for(const plan of Object.values(plans).filter(p=>p.key !== 'free')) {
      for(const interval of ['month','year']) {
        if(price?.id === priceId(plan,interval)) return plan;
        // Preserve pre-upgrade subscriptions created using inline prices.
        const expected=interval === 'year' ? plan.annualPriceUsdCents : plan.monthlyPriceUsdCents;
        if(subscription.metadata?.planKey === plan.key && price?.currency === 'usd' && price.unit_amount === expected &&
          price.recurring?.interval === interval && price.recurring?.interval_count === 1) return plan;
      }
    }
    return null;
  }
  async function customerFor(user) {
    if(user.stripeCustomerId) return user.stripeCustomerId;
    const customer=await stripe.customers.create({email:user.email,metadata:{userId:user.id}}, {idempotencyKey:`sss-customer-${user.id}`});
    await auth.updateUserBilling({userId:user.id,planKey:user.planKey,stripeCustomerId:customer.id,stripeSubscriptionId:user.stripeSubscriptionId});
    return customer.id;
  }
  async function subscriptions(customer) {
    const all=[];
    for await (const sub of stripe.subscriptions.list({customer,status:'all',limit:100})) all.push(sub);
    return all;
  }
  async function reconcile(user, customer) {
    if(user.stripeCustomerId && user.stripeCustomerId !== customer) throw new Error('Billing customer mismatch');
    const subs=await subscriptions(customer);
    const entitled=subs.map(sub=>({sub,plan:planForSubscription(sub)})).filter(row=>row.plan)
      .sort((a,b)=>b.plan.monthlySheetLimit-a.plan.monthlySheetLimit || b.sub.created-a.sub.created);
    const current=entitled[0];
    return auth.updateUserBilling({userId:user.id,planKey:current?.plan.key || 'free',stripeCustomerId:customer,stripeSubscriptionId:current?.sub.id || null});
  }
  return {
    planForSubscription,
    async checkout(user,plan,interval) {
      return store.withLock(`billing:${user.id}`,async()=>{
        user=await auth.getUserById(user.id);
        const customer=await customerFor(user);
        const subs=await subscriptions(customer);
        if(subs.some(sub=>!['canceled','incomplete_expired'].includes(sub.status))) {
          return (await stripe.billingPortal.sessions.create({customer,return_url:`${baseUrl}/account?tab=plans`})).url;
        }
        const id=priceId(plan,interval);
        if(!id) throw new ApiAuthError('This plan is temporarily unavailable. Please contact support.',503);
        const price=await stripe.prices.retrieve(id);
        const amount=interval==='year' ? plan.annualPriceUsdCents : plan.monthlyPriceUsdCents;
        if(!price.active || price.currency!=='usd' || price.unit_amount!==amount || price.recurring?.interval!==interval || price.recurring.interval_count!==1)
          throw new Error('Configured Stripe price does not match the selected plan');
        const operationKey=`checkout:${user.id}`;
        const previous=await store.get(operationKey);
        if(previous?.sessionId) {
          const session=await stripe.checkout.sessions.retrieve(previous.sessionId);
          if(session.status==='open' && previous.plan===plan.key && previous.interval===interval) return session.url;
          if(session.status==='open') await stripe.checkout.sessions.expire(session.id);
          // A completed checkout may belong to a subscription cancelled long ago.
          // Current subscriptions above determine whether a new purchase is allowed.
        }
        const attempt=previous && !previous.sessionId && previous.plan===plan.key && previous.interval===interval ? previous.attempt : crypto.randomUUID();
        await store.set(operationKey,{attempt,plan:plan.key,interval});
        const session=await stripe.checkout.sessions.create({mode:'subscription',customer,client_reference_id:user.id,
          billing_address_collection:'auto',line_items:[{price:id,quantity:1}],
          success_url:`${baseUrl}/account?tab=plans&billing=success`,cancel_url:`${baseUrl}/account?tab=plans&billing=cancelled`,
          metadata:{checkoutType:'subscription_plan',userId:user.id,planKey:plan.key,billingInterval:interval},
          subscription_data:{metadata:{userId:user.id,planKey:plan.key,billingInterval:interval}}
        },{idempotencyKey:`sss-checkout-${attempt}`});
        await store.set(operationKey,{attempt,sessionId:session.id,plan:plan.key,interval});
        return session.url;
      });
    },
    async event(event) {
      const object=event.data.object;
      const subscriptionId=object.object==='subscription' ? object.id : (object.subscription || object.parent?.subscription_details?.subscription);
      if(!subscriptionId) return;
      const subscription=await stripe.subscriptions.retrieve(typeof subscriptionId==='string'?subscriptionId:subscriptionId.id);
      const userId=subscription.metadata?.userId;
      if(!userId) return;
      await store.withLock(`billing:${userId}`,async()=>{
        if(await store.get(`stripe-event:${event.id}`)) return;
        const user=await auth.getUserById(userId);
        if(!user) throw new Error('Billing user unavailable');
        // Read Stripe's current state, not the state in a possibly stale event.
        await reconcile(user,typeof subscription.customer==='string'?subscription.customer:subscription.customer.id);
        await store.set(`stripe-event:${event.id}`,{processedAt:new Date().toISOString()});
      });
    }
  };
}
module.exports={createBillingService};
