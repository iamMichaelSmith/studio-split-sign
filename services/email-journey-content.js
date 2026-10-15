const path = require('node:path');
const { PLAN_DEFINITIONS, planForUser } = require('./plan-service');

const escape = value => String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const HEROES = ['session', 'collaboration', 'vault', 'skins', 'profiles', 'next-session'];

function betaInvitation(journey, step, email) {
  // Sample copy scenarios only. Never manufacture a valid signing credential.
  return journey === 'invited' && step < 2
    ? { status: 'pending-signatures', payload: { contributors: [{ email }] } }
    : null;
}

function journeyEmail({ journey, step, user, contact, invitation, activity = {}, baseUrl, postalAddress = '', headerImagePath = null }) {
  if (!Number.isInteger(step) || step < 0 || step > 5) return null;
  const invited = journey === 'invited';
  const pending = invitation?.status === 'pending-signatures'
    ? invitation.payload?.contributors?.find(c => c.email?.toLowerCase() === user.email.toLowerCase() && !c.signedAt)
    : null;
  const canSign = pending?.signerToken && Date.parse(pending.signerTokenExpiresAt) > Date.now();
  const signingPath = canSign ? `/split-sheet/sign/${invitation.id}/${pending.signerToken}` : '/account?tab=vault';
  const paid = planForUser(user).key !== 'free';
  const installed = Boolean(activity.pluginDownloaded);
  const free = PLAN_DEFINITIONS.free;
  const creator = PLAN_DEFINITIONS.creator;
  const studio = PLAN_DEFINITIONS.studio_pro;
  const message = (subject, preheader, eyebrow, headline, paragraphs, bullets, target, label, note = '') =>
    ({ subject, preheader, eyebrow, headline, paragraphs, bullets, target, label, note });
  const welcome = invited
    ? message('Your next session starts here', 'Your invitation brought you here. Make your contribution part of the record.', 'WELCOME TO YOUR WORKSPACE', pending ? 'Your part belongs on the record.' : 'Your contribution has a home.',
      pending ? ['Someone invited you to a split sheet. Your free account gives you a place to review the details, add your information, and sign your part.', 'Take a moment to check the percentages while the session is still fresh.']
        : ['You joined through a collaboration. Your account keeps the sheets you sign within reach, and you can create sheets for your own sessions too.'],
      pending ? ['Add your contributor details.', 'Review the percentages before you agree.', 'Sign your part and find the sheet in your vault.'] : ['Find your signed sheets in your vault.', 'Download the final packet once everyone has signed.', 'Invite collaborators when you start your own sheet.'],
      signingPath, pending && canSign ? 'Complete your part' : 'Open your vault', pending && !canSign ? 'If you still need to sign, use the invitation from the creator. Ask for a fresh link if yours has expired. No paid plan is needed to complete your part.' : 'Joining and signing an invitation does not use your sheet creation allowance.')
    : message('Your next session starts here', 'Start a split sheet while the session is still fresh.', 'WELCOME TO YOUR WORKSPACE', 'Great session. Clear next steps.',
      ['The song is taking shape. Give everyone a clear record of their part while the details are still fresh.', 'Start with the song, add your contributors, and invite each person to fill in their details and sign.'],
      ['Set up the song and the proposed shares.', 'Invite contributors using their email addresses.', 'Keep the signed record in your account.'], '/split-sheet', 'Create your first split sheet', `Your Free plan includes ${free.monthlySheetLimit} new sheets each month. Invited contributors can join and sign with a free account.`);

  const firstAction = invited && pending
    ? message('Your part is the next step', 'A quick review now keeps the collaboration moving.', 'KEEP THE SESSION MOVING', 'Bring your part to the finish.',
      ['Your contributor signature is still pending. Open your invitation, complete your details, and check the proposed percentages before you sign.', 'The final packet becomes available after every contributor has finished.'],
      ['Review the proposed shares carefully.', 'Complete any missing contributor information.', 'Your signed sheet stays connected to your account.'], signingPath, canSign ? 'Complete your part' : 'Open your vault', canSign ? 'You can complete your part from your phone or computer.' : 'Use your original signing invitation, or ask the creator to resend an expired link.')
    : activity.createdCount > 0
      ? message('Your first split is in motion', 'Check the progress of the sheet you already started.', 'A GOOD SESSION HABIT', 'You have already taken the first step.',
        ['You have a split sheet on record. Open your vault to check its progress and find the final packet when everyone has signed.', 'For the next session, make capturing the shares part of the wrap up.'], [], '/account?tab=vault', 'Check your split sheet')
      : message('Keep the music moving', 'Let each collaborator complete their own details and sign.', 'LESS BACK AND FORTH', 'Give everyone a clear next step.',
        [invited ? 'You have seen the workflow as a contributor. Now you can use it to organize a session of your own.' : 'You do not need to collect every address, PRO number, and signature before you start.', 'Set up the song, check the proposed shares, and send invitations. Each contributor can add their own details and sign through their account.'],
        ['Start with contributor email addresses.', 'Let each person complete their information.', 'Track the sheet through to completion.'], '/split-sheet', 'Invite your collaborators');

  const vault = message('Your signed sheets have a home', 'Find the record when someone needs it again.', 'YOUR SPLIT SHEET VAULT', 'Good records stay within reach.',
    ['The session ends. Someone asks for the paperwork later. Your vault gives you a place to find the sheets you created or signed.', 'Open the record, check its status, and download the completed packet once everyone has finished.'],
    ['Created and signed sheets in one account.', 'A clear status while signatures are pending.', 'The completed packet when you need it.'], '/account?tab=vault', 'Open your vault', 'A pending sheet updates when the remaining contributors finish.');

  const plugin = message('Your studio has a new plugin', 'Meet the Windows VST3 with a look that fits your session.', 'ALSO A WINDOWS VST3', 'Your workflow. Your studio. Your look.',
    ['Split Sheet Studio is also a Windows VST3 plugin. Bring split sheet paperwork into your studio workflow, with the same account you use on the web.', 'Choose Midnight, Neon, Electric, Blueprint, Royal, or Walnut to set the mood. Change the skin while keeping the same familiar steps for the song, contributors, and review.'],
    ['Windows VST3 plugin and standalone app.', 'Six new skins alongside Bronze, Paper Thin, Denim, Soft, Speakeasy, and Plush.', 'Your skin choice is remembered the next time the plugin opens.'],
    paid ? (installed ? '/account?tab=vst#plugin-skins' : '/downloads/plugin/latest') : '/account?tab=plans&plan=creator',
    paid ? (installed ? 'Find your next skin' : 'Download for Windows') : 'Get the Windows VST',
    paid ? 'Windows plugin access is included in your paid plan. See the plugin page for setup and compatibility details.' : 'Plugin access is included with Creator and Studio. A paid plan is required to download; you can keep using the Free website plan without upgrading.');

  const profiles = message('Same collaborators. Less typing.', 'Make recurring sessions easier to set up.', 'BUILD YOUR SESSION ROUTINE', 'Keep the creative chemistry. Skip the repeat entry.',
    ['Working with familiar collaborators should feel familiar in the paperwork too.', 'After a collaborator approves and signs, Creator and Studio accounts can keep an approved profile for reuse. Use it to fill future sheets with their saved details, then review the information for the new session.'],
    ['Reuse approved collaborator information.', 'Spend less time entering the same details.', 'Keep the focus on the session in front of you.'],
    paid ? '/account?tab=collaborators' : '/account?tab=plans&plan=creator', paid ? 'Open your collaborators' : 'Explore Creator',
    paid ? 'Profiles appear after approval and signing.' : 'Approved collaborator profiles and Windows plugin access are included with Creator and Studio.');

  const nextSession = paid
    ? message('Make it part of your next session', 'Put your included studio tools to work.', 'READY WHEN THE SESSION IS', 'Make clear credit part of the routine.',
      ['You have the tools. Bring them into your next session: capture the song details, invite the contributors, and keep the signed record in your vault.', 'Your plan also includes approved collaborator profiles and the Windows plugin, so you can build a workflow that fits the way you work.'], [],
      '/split-sheet', 'Start your next split sheet')
    : message('Make it part of your next session', 'More sheets, the Windows VST3, and less repeat entry.', 'ROOM FOR YOUR NEXT COLLABORATION', 'Ready to make this a studio habit?',
      ['If Split Sheet Studio fits the way you work, Creator gives you more room for regular sessions, plus the Windows VST3 plugin and approved collaborator profiles.', 'Choose the plan that fits your workload. Your Free account remains available if you are still getting started.'],
      [`Free: ${free.monthlySheetLimit} new sheets per month on the website.`, `Creator: ${creator.monthlySheetLimit} sheets per month, plus the Windows plugin and approved profiles.`, `Studio: ${studio.monthlySheetLimit} sheets per month, with the same paid workflow tools for a busier schedule.`],
      '/account?tab=plans', 'Choose your plan', 'Find the right fit for your studio. Compare current monthly and annual options on the plan page.');

  // Finish the invited person's immediate task before starting the upgrade pitch.
  if (pending && step >= 3) return { defer: true };
  const content = [welcome, firstAction, vault, plugin, profiles, nextSession][step];
  const action = new URL(content.target, baseUrl);
  action.searchParams.set('utm_source', 'email');
  action.searchParams.set('utm_medium', 'onboarding');
  action.searchParams.set('utm_campaign', `studio_${journey}_v2`);
  action.searchParams.set('utm_content', `email_${step + 1}`);
  const unsubscribeUrl = `${baseUrl}/email-preferences/${contact.unsubscribeToken}`;
  const imageFile = step === 3 ? 'plugin-skins-collection.png' : `email-hero-${HEROES[step]}.png`;
  const hero = headerImagePath ? 'cid:splitsheet-studio-header' : `${baseUrl}/${imageFile}`;
  const logo = headerImagePath ? 'cid:splitsheet-studio-logo' : `${baseUrl}/split-sheet-studio-logo.png`;
  const alt = step === 3 ? 'Split Sheet Studio Windows VST3 in Midnight, Neon, Electric, Blueprint, Royal, and Walnut skins' : `Split Sheet Studio ${HEROES[step].replace('-', ' ')} workflow`;
  const paragraphs = content.paragraphs.map(p => `<p style="margin:0 0 18px">${escape(p)}</p>`).join('');
  const bullets = content.bullets.length ? `<ul style="padding-left:20px;margin:0 0 24px">${content.bullets.map(b => `<li style="padding:3px 0">${escape(b)}</li>`).join('')}</ul>` : '';
  return {
    subject: content.subject, preheader: content.preheader, headline: content.headline,
    html: `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:0;background:#f3eee6"><div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${escape(content.preheader)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#fffbf5;font-family:Arial,Helvetica,sans-serif;color:#302219;line-height:1.65"><tr><td style="background:#241b15;padding:22px 28px;border-top:4px solid #cda16f"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td width="82" style="vertical-align:middle;padding-right:14px"><a href="https://splitsheetstudio.com" style="display:block;text-decoration:none"><img src="${escape(logo)}" width="82" height="82" alt="Split Sheet Studio logo" style="display:block;width:82px;height:82px;border:0"></a></td><td style="vertical-align:middle"><p style="margin:0;color:#f9ead7;font-size:23px;font-weight:bold;letter-spacing:-.5px">Split Sheet Studio</p><p style="margin:3px 0 0;color:#ceaf8e;font-size:10px;letter-spacing:2.5px">YOUR SESSION. YOUR CREDIT.</p></td></tr></table></td></tr><tr><td><a href="https://splitsheetstudio.com" style="display:block;text-decoration:none"><img src="${escape(hero)}" width="600" alt="${escape(alt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0"></a></td></tr><tr><td style="padding:30px 28px 26px"><p style="margin:0 0 10px;font-size:10px;font-weight:bold;letter-spacing:2px;color:#90613c">${escape(content.eyebrow)}</p><h1 style="font-size:28px;line-height:1.18;letter-spacing:-.6px;margin:0 0 22px">${escape(content.headline)}</h1><p style="margin:0 0 18px">Hi ${escape(user.displayName || 'there')},</p>${paragraphs}${bullets}<table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#82502e" style="border-radius:5px"><a href="${escape(action.href)}" style="display:inline-block;padding:14px 24px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none">${escape(content.label)}</a></td></tr></table>${content.note ? `<p style="font-size:12px;line-height:1.6;color:#76624f;margin:18px 0 0">${escape(content.note)}</p>` : ''}<p style="margin:26px 0 0;font-size:13px;color:#76624f">See you in the next session,<br><strong style="color:#302219">The Split Sheet Studio team</strong></p></td></tr><tr><td style="padding:20px 28px;background:#ece3d7;color:#705f50;font-size:11px;line-height:1.7">You chose to receive Split Sheet Studio tips and product updates.<br><a href="${escape(unsubscribeUrl)}" style="color:#705f50">Unsubscribe or manage email preferences</a>${postalAddress ? `<br>${escape(postalAddress)}` : ''}</td></tr></table></td></tr></table></body></html>`,
    text: `${content.headline}\n\nHi ${user.displayName || 'there'},\n\n${content.paragraphs.join('\n\n')}\n\n${content.bullets.map(b => `• ${b}`).join('\n')}\n\n${content.label}: ${action.href}\n\n${content.note}\n\nThe Split Sheet Studio team\nUnsubscribe: ${unsubscribeUrl}`,
    to: [user.email],
    attachments: headerImagePath ? [{ filename: imageFile, path: path.join(path.dirname(headerImagePath), imageFile), cid: 'splitsheet-studio-header' }, { filename: 'split-sheet-studio-logo.png', path: path.join(path.dirname(headerImagePath), 'split-sheet-studio-logo.png'), cid: 'splitsheet-studio-logo' }] : [],
    headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` }
  };
}

module.exports = { journeyEmail, betaInvitation, HEROES };
