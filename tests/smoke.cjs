const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { validateProductionRuntime } = require('../services/runtime-config');
const { availablePort, testEnvironment } = require('./helpers/isolated-app.cjs');

async function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitForHttp(url, attempts = 30, delayMs = 500) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await wait(delayMs);
  }
  throw new Error(`http not ready: ${url}`);
}

function validInvitePayload(songTitle) {
  return {
    songTitle,
    date: '2026-07-01',
    allPartiesAgree: true,
    collectSignaturesByInvite: true,
    contributors: [
      { legalName: `${songTitle} Writer One`, role: 'Writer', email: 'writer1@example.com', writerShare: 50, publisherShare: 50 },
      { legalName: `${songTitle} Writer Two`, role: 'Producer', email: 'writer2@example.com', writerShare: 50, publisherShare: 50 }
    ]
  };
}

async function main() {
  let rejectedUnsafeProduction = false;
  try {
    validateProductionRuntime({
      environment: { NODE_ENV: 'production' },
      baseUrl: 'http://localhost:5050',
      dbProvider: 'sqlite',
      sessionStoreMode: 'memory',
      cookieSecure: false,
      pdfStorageMode: 'local'
    });
  } catch {
    rejectedUnsafeProduction = true;
  }
  if (!rejectedUnsafeProduction) throw new Error('unsafe production configuration should fail closed');

  const port = await availablePort();
  const tempDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'split-sheet-studio-'));
  const accountEmail = 'smoke@example.com';
  const accountPass = 'smoke-pass-123';
  const child = spawn(process.execPath, [path.resolve(__dirname, '../server.js')], {
    cwd: tempDataDir,
    windowsHide: true,
    env: testEnvironment({
      CSRF_PROTECTION_ENABLED: 'false',
      PORT: String(port),
      HOST: '127.0.0.1',
      PUBLIC_BASE_URL: `http://127.0.0.1:${port}`,
      ROOT_DOMAIN: 'splitsheetstudio.test',
      DATA_DIR: tempDataDir,
      DB_PROVIDER: 'sqlite',
      DB_PATH: path.join(tempDataDir, 'app.db'),
      ADMIN_USER: 'admin-user',
      ADMIN_PASS: 'admin-pass-123',
      SESSION_SECRET: 'smoke-session-secret',
      API_TOKEN_SECRET: 'smoke-api-token-secret',
      ALLOW_PUBLIC_REGISTRATION: 'true',
      AUTH_DEBUG_TOKENS: 'true',
      GOOGLE_CLIENT_ID: 'google-client-id.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'google-client-secret',
      APPLE_CLIENT_ID: 'com.splitsheetstudio.web',
      APPLE_CLIENT_SECRET: 'apple-client-secret-jwt',
      STRIPE_SECRET_KEY: 'sk_test_smoke_fake_key',
      STRIPE_WEBHOOK_SECRET: '',
      PLUGIN_LATEST_VERSION_LABEL: '0.1.2',
      PLUGIN_MINIMUM_SUPPORTED_VERSION: '0.1.0'
    }),
    stdio: 'ignore'
  });

  try {
    await waitForHttp(`http://127.0.0.1:${port}/health`);

    const health = await fetch(`http://127.0.0.1:${port}/health`);
    if (!health.ok) throw new Error('health failed');

    const ready = await fetch(`http://127.0.0.1:${port}/ready`);
    if (!ready.ok) throw new Error('ready failed');

    const apiHealth = await fetch(`http://127.0.0.1:${port}/api/health`);
    if (!apiHealth.ok) throw new Error('api health failed');

    const home = await fetch(`http://127.0.0.1:${port}/`);
    if (!home.ok) throw new Error('home failed');
    if (!home.headers.get('content-security-policy')) throw new Error('content security policy missing');
    if (!home.headers.get('x-request-id')) throw new Error('request id header missing');

    const pricing = await fetch(`http://127.0.0.1:${port}/pricing`);
    if (!pricing.ok) throw new Error('pricing page failed');
    const pricingHtml = await pricing.text();
    for (const expectedPrice of ['$0', '$7/mo', '$70/yr', '$19/mo', '$190/yr']) {
      if (!pricingHtml.includes(expectedPrice)) throw new Error(`pricing page missing ${expectedPrice}`);
    }
    for (const expectedDealCopy of ['Creator is discounted from $10 to $7/month', 'Studio is discounted from $30 to $19/month', '$100/yr', '$300/yr']) {
      if (!pricingHtml.includes(expectedDealCopy)) throw new Error(`pricing page missing discount copy: ${expectedDealCopy}`);
    }
    if (!pricingHtml.includes('Website workflow only')) throw new Error('pricing page should describe Free as website-only');
    if (!pricingHtml.includes('No VST3 plugin download')) throw new Error('pricing page should exclude plugin downloads from Free');
    if (!pricingHtml.includes('No paid checkout required')) throw new Error('pricing page should not require paid checkout for Free');
    if (!pricingHtml.includes('Pending signers get reminder emails')) throw new Error('pricing page should mention signer reminders');
    if (pricingHtml.includes('$29')) throw new Error('pricing page should not advertise a separate plugin license');

    const separatePluginCheckout = await fetch(`http://127.0.0.1:${port}/buy/plugin`, {
      method: 'POST',
      redirect: 'manual'
    });
    if (separatePluginCheckout.status !== 404) throw new Error('separate plugin checkout should be disabled during launch');

    const unsignedStripeWebhook = await fetch(`http://127.0.0.1:${port}/api/stripe/webhook`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'checkout.session.completed', data: { object: { id: 'cs_smoke' } } })
    });
    if (unsignedStripeWebhook.status !== 400) throw new Error('unsigned Stripe webhook should be rejected');
    const unsignedStripeWebhookJson = await unsignedStripeWebhook.json();
    if (unsignedStripeWebhookJson.error !== 'stripe_webhook_signature_required') {
      throw new Error('unsigned Stripe webhook rejection reason mismatch');
    }

    const pluginDownload = await fetch(`http://127.0.0.1:${port}/beta`);
    if (!pluginDownload.ok) throw new Error('plugin download page failed');
    const pluginDownloadHtml = await pluginDownload.text();
    if (!pluginDownloadHtml.includes('Windows VST3')) throw new Error('windows plugin label missing');
    for (const staleCopy of ['Public beta', 'Known beta limits', 'Stripe can stay disabled', 'Mac AU beta']) {
      if (pluginDownloadHtml.includes(staleCopy)) throw new Error(`plugin download page has stale copy: ${staleCopy}`);
    }

    const support = await fetch(`http://127.0.0.1:${port}/support`);
    if (!support.ok || !(await support.text()).includes('Keep the session moving')) throw new Error('support page failed');

    const appRobots = await fetch(`http://127.0.0.1:${port}/robots.txt`);
    if (!appRobots.ok || !(await appRobots.text()).includes('Disallow: /')) throw new Error('app robots policy failed');

    const marketingRobots = await fetch(`http://127.0.0.1:${port}/robots.txt`, {
      headers: { 'x-forwarded-host': 'splitsheetstudio.test' }
    });
    if (!marketingRobots.ok || !(await marketingRobots.text()).includes('Sitemap:')) throw new Error('marketing robots policy failed');

    const sitemap = await fetch(`http://127.0.0.1:${port}/sitemap.xml`, {
      headers: { 'x-forwarded-host': 'splitsheetstudio.test' }
    });
    if (!sitemap.ok || !(await sitemap.text()).includes('/blog/what-is-a-split-sheet-in-music')) throw new Error('sitemap failed');

    const securityTxt = await fetch(`http://127.0.0.1:${port}/.well-known/security.txt`);
    if (!securityTxt.ok || !(await securityTxt.text()).includes('Contact: mailto:Contact@blakmarigold.com')) throw new Error('security.txt failed');

    const macDownload = await fetch(`http://127.0.0.1:${port}/downloads/plugin/mac/latest`);
    if (macDownload.status !== 503) throw new Error('unreleased mac download should stay disabled');

    const blog = await fetch(`http://127.0.0.1:${port}/blog`);
    if (!blog.ok) throw new Error('blog index failed');

    const blogPost = await fetch(`http://127.0.0.1:${port}/blog/what-is-a-split-sheet-in-music`);
    if (!blogPost.ok) throw new Error('blog post failed');

    const newsletter = await fetch(`http://127.0.0.1:${port}/newsletter/subscribe`, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        displayName: 'Newsletter Smoke',
        email: 'newsletter@example.com',
        marketingOptIn: 'yes'
      })
    });
    if (newsletter.status !== 302 || !newsletter.headers.get('location')?.includes('newsletter=subscribed')) {
      throw new Error('newsletter opt-in failed');
    }

    const contactExportNoToken = await fetch(`http://127.0.0.1:${port}/api/admin/marketing-contacts`);
    if (contactExportNoToken.status !== 401) throw new Error('contact export should require a bearer token');

    const contactExportBadToken = await fetch(`http://127.0.0.1:${port}/api/admin/marketing-contacts`, {
      headers: { authorization: 'Bearer wrong-token' }
    });
    if (contactExportBadToken.status !== 403) throw new Error('contact export should reject bad tokens');

    const contactExport = await fetch(`http://127.0.0.1:${port}/api/admin/marketing-contacts`, {
      headers: { authorization: 'Bearer release-test-contact-export-token-never-production' }
    });
    if (!contactExport.ok) throw new Error('contact export endpoint failed');
    const contactExportJson = await contactExport.json();
    if (contactExportJson.count !== 1 || contactExportJson.contacts[0].email !== 'newsletter@example.com') {
      throw new Error('contact export should include opted-in subscribers');
    }
    if (!contactExportJson.contacts[0].unsubscribeUrl?.includes('/email-preferences/')) {
      throw new Error('contact export should include unsubscribe URL');
    }

    for (const slug of ['terms', 'privacy', 'refund-policy', 'electronic-signature-consent', 'disclaimer']) {
      const legal = await fetch(`http://127.0.0.1:${port}/legal/${slug}`);
      if (!legal.ok) throw new Error(`legal page failed: ${slug}`);
    }

    const pluginUpdate = await fetch(`http://127.0.0.1:${port}/api/plugin/update?currentVersion=0.0.1`);
    if (!pluginUpdate.ok) throw new Error('plugin update endpoint failed');
    const pluginUpdateJson = await pluginUpdate.json();
    if (!pluginUpdateJson.latestVersion) throw new Error('plugin update latest version missing');
    if (!pluginUpdateJson.updateAvailable || !pluginUpdateJson.updateRequired) {
      throw new Error('plugin update flags should report available + required for unsupported builds');
    }

    const pluginUpToDate = await fetch(`http://127.0.0.1:${port}/api/plugin/update?currentVersion=0.1.2`);
    if (!pluginUpToDate.ok) throw new Error('plugin update current-version check failed');
    const pluginUpToDateJson = await pluginUpToDate.json();
    if (pluginUpToDateJson.updateAvailable || pluginUpToDateJson.updateRequired) {
      throw new Error('plugin update should report current release as up to date');
    }

    const split = await fetch(`http://127.0.0.1:${port}/split-sheet`);
    if (!split.ok) throw new Error('split form failed');
    if (!((await split.text()).includes('Sign in'))) throw new Error('split form should require sign in');

    const signupPage = await fetch(`http://127.0.0.1:${port}/signup`);
    if (!signupPage.ok) throw new Error('signup page failed');
    const signupHtml = await signupPage.text();
    if (!signupHtml.includes('Continue with Google')) throw new Error('signup page missing active Google sign-in');
    if (!signupHtml.includes('Continue with Apple')) throw new Error('signup page missing active Apple sign-in');

    const forgotPasswordPage = await fetch(`http://127.0.0.1:${port}/forgot-password`);
    if (!forgotPasswordPage.ok) throw new Error('forgot password page failed');

    const unauthorizedValidate = await fetch(`http://127.0.0.1:${port}/api/split-sheets/validate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({})
    });
    if (unauthorizedValidate.status !== 401) throw new Error('unauthorized validate check failed');

    const register = await fetch(`http://127.0.0.1:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: accountEmail,
        password: accountPass,
        displayName: 'Smoke User',
        marketingOptIn: true
      })
    });
    if (!register.ok) throw new Error('api register failed');
    const registered = await register.json();
    if (!registered.user?.id) throw new Error('registered user missing');
    if (!registered.verificationToken) throw new Error('verification token missing');

    const verify = await fetch(`http://127.0.0.1:${port}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token: registered.verificationToken })
    });
    if (!verify.ok) throw new Error('api verify email failed');

    const login = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: accountEmail,
        password: accountPass
      })
    });
    if (!login.ok) throw new Error('api login failed');
    const auth = await login.json();
    if (!auth.accessToken || !auth.refreshToken) throw new Error('auth tokens missing');

    const me = await fetch(`http://127.0.0.1:${port}/api/me`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!me.ok) throw new Error('api me failed');
    const meJson = await me.json();
    if (meJson.user.planKey !== 'free') throw new Error('new users should start on free plan');
    if (meJson.usage.limit !== 3 || meJson.usage.used !== 0) throw new Error('free usage summary mismatch');

    const validate = await fetch(`http://127.0.0.1:${port}/api/split-sheets/validate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        songTitle: 'Smoke Test Song',
        date: '2026-07-01',
        allPartiesAgree: true,
        collectSignaturesByInvite: true,
        contributors: [
          { legalName: 'Writer One', role: 'Writer', email: 'writer1@example.com', writerShare: 50, publisherShare: 50 },
          { legalName: 'Writer Two', role: 'Producer', email: 'writer2@example.com', writerShare: 50, publisherShare: 50 }
        ]
      })
    });
    if (!validate.ok) throw new Error('split validation failed');

    const validateMaster = await fetch(`http://127.0.0.1:${port}/api/split-sheets/validate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        songTitle: 'Master Rights Smoke Song',
        rightsScope: 'master',
        allPartiesAgree: true,
        collectSignaturesByInvite: true,
        contributors: [
          { legalName: 'Master Owner One', role: 'Producer', email: 'master1@example.com', masterShare: 50 },
          { legalName: 'Master Owner Two', role: 'Artist', email: 'master2@example.com', masterShare: 50 }
        ]
      })
    });
    if (!validateMaster.ok) throw new Error('master ownership validation failed');

    const validateEmailOnlyInvite = await fetch(`http://127.0.0.1:${port}/api/split-sheets/validate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        songTitle: 'Email Only Invite Smoke Song',
        allPartiesAgree: true,
        collectSignaturesByInvite: true,
        contributors: [
          { email: 'emailonly1@example.com', writerShare: 50, publisherShare: 50 },
          { email: 'emailonly2@example.com', writerShare: 50, publisherShare: 50 }
        ]
      })
    });
    if (!validateEmailOnlyInvite.ok) throw new Error('email-only invite validation failed');

    const draftCreate = await fetch(`http://127.0.0.1:${port}/api/split-sheets/drafts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        songTitle: 'Draft Smoke Song',
        date: '2026-07-01',
        contributors: [
          { legalName: 'Draft Writer One', role: 'Writer', email: 'draft1@example.com', writerShare: 70, publisherShare: 70 }
        ]
      })
    });
    if (!draftCreate.ok) throw new Error('draft create failed');
    const createdDraft = await draftCreate.json();
    if (createdDraft.splitSheet?.status !== 'draft') throw new Error('draft status mismatch');

    const draftList = await fetch(`http://127.0.0.1:${port}/api/split-sheets`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!draftList.ok) throw new Error('split list failed');
    const listed = await draftList.json();
    if (!Array.isArray(listed.splitSheets) || listed.splitSheets.length < 1) throw new Error('split list empty');

    const draftDetail = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${createdDraft.splitSheet.id}`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!draftDetail.ok) throw new Error('draft detail failed');

    const draftUpdate = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${createdDraft.splitSheet.id}/draft`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        songTitle: 'Smoke Test Song',
        date: '2026-07-01',
        contributors: [
          { legalName: 'Writer One', role: 'Writer', email: 'writer1@example.com', writerShare: 50, publisherShare: 50 },
          { legalName: 'Writer Two', role: 'Producer', email: 'writer2@example.com', writerShare: 50, publisherShare: 50 }
        ]
      })
    });
    if (!draftUpdate.ok) throw new Error('draft update failed');

    const create = await fetch(`http://127.0.0.1:${port}/api/split-sheets`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        draftId: createdDraft.splitSheet.id,
        songTitle: 'Smoke Test Song',
        date: '2026-07-01',
        allPartiesAgree: true,
        collectSignaturesByInvite: true,
        contributors: [
          { email: 'writer1@example.com', writerShare: 50, publisherShare: 50 },
          { email: 'writer2@example.com', writerShare: 50, publisherShare: 50 }
        ]
      })
    });
    if (!create.ok) throw new Error('split create failed');
    const created = await create.json();
    if (!created.splitSheet?.id) throw new Error('created split id missing');
    if (created.splitSheet.id !== createdDraft.splitSheet.id) throw new Error('draft submit should reuse id');
    if (created.splitSheet.status !== 'pending-signatures') throw new Error('submitted split status mismatch');

    const status = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${created.splitSheet.id}/status`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!status.ok) throw new Error('split status failed');
    const pendingStatus = await status.json();
    if (pendingStatus.splitSheet.allPartiesAgree !== false) throw new Error('remote split finalized before every signer agreed');
    if (pendingStatus.splitSheet.signers?.length !== 2) throw new Error('signer delivery status missing');

    const signingDetailResponse = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${created.splitSheet.id}`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!signingDetailResponse.ok) throw new Error('signing detail failed');
    const signingDetail = await signingDetailResponse.json();
    const signers = signingDetail.splitSheet.payload.contributors;
    if (!signers.every((signer) => signer.signerToken && signer.signerTokenExpiresAt)) throw new Error('secure signer links missing');

    const signatureData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    const signerProfileBody = (signer, index, extra = {}) => new URLSearchParams({
      legalName: index === 0 ? 'Writer One' : 'Writer Two',
      role: index === 0 ? 'Writer' : 'Producer',
      address: `${index + 1} Music Row`,
      phone: `555-010${index}`,
      pro: index === 0 ? 'ASCAP' : 'BMI',
      ipi: `00000000${index + 1}`,
      publisherName: index === 0 ? 'Writer One Publishing' : 'Writer Two Publishing',
      publisherIpi: `10000000${index + 1}`,
      typedSignatureName: index === 0 ? 'Writer One' : 'Writer Two',
      signatureData,
      ...extra
    });
    const rejectedSignature = await fetch(`http://127.0.0.1:${port}/split-sheet/sign/${created.splitSheet.id}/${signers[0].signerToken}`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: signerProfileBody(signers[0], 0)
    });
    if (rejectedSignature.status !== 400) throw new Error('signature without explicit agreement should be rejected');

    for (const [index, signer] of signers.entries()) {
      const signed = await fetch(`http://127.0.0.1:${port}/split-sheet/sign/${created.splitSheet.id}/${signer.signerToken}`, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: signerProfileBody(signer, index, { agreeToSplits: 'yes' })
      });
      if (!signed.ok) throw new Error(`signer completion failed for ${signer.email}`);
    }

    const completedStatusResponse = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${created.splitSheet.id}/status`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    const completedStatus = await completedStatusResponse.json();
    if (completedStatus.splitSheet.status !== 'completed') throw new Error('split did not finalize after every signer agreed');
    if (completedStatus.splitSheet.signerStats.signed !== 2) throw new Error('completed signer count mismatch');
    if (!completedStatus.splitSheet.allPartiesAgree || !completedStatus.splitSheet.completedAt) throw new Error('final agreement metadata missing');

    const finalPdf = await fetch(completedStatus.splitSheet.pdfUrl);
    if (!finalPdf.ok || !(await finalPdf.arrayBuffer()).byteLength) throw new Error('final split PDF missing');
    if (!/attachment/i.test(finalPdf.headers.get('content-disposition') || '')) throw new Error('default final PDF should download as attachment');

    const inlinePdf = await fetch(`${completedStatus.splitSheet.pdfUrl}&view=1`);
    if (!inlinePdf.ok || !(await inlinePdf.arrayBuffer()).byteLength) throw new Error('inline final PDF preview missing');
    if (!/inline/i.test(inlinePdf.headers.get('content-disposition') || '')) throw new Error('view final PDF should render inline');

    const completedDetailResponse = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${created.splitSheet.id}`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!completedDetailResponse.ok) throw new Error('completed split detail failed');
    const completedDetail = await completedDetailResponse.json();
    if (completedDetail.splitSheet.payload.contributors[0].legalName !== 'Writer One') throw new Error('remote signer profile details were not saved');
    const revisionToken = completedDetail.splitSheet?.payload?.revisionToken;
    if (!revisionToken) throw new Error('completed split missing revision token');

    const webLogin = await fetch(`http://127.0.0.1:${port}/login`, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        email: accountEmail,
        password: accountPass
      })
    });
    if (webLogin.status !== 302) throw new Error('web login failed');
    if (webLogin.headers.get('location') !== '/account') throw new Error('web login should land on account');

    const setCookieHeader = webLogin.headers.get('set-cookie') || '';
    const cookie = setCookieHeader
      .split(/,(?=[^;]+?=)/g)
      .map((value) => value.split(';')[0])
      .filter(Boolean)
      .join('; ');
    if (!cookie) throw new Error('web login cookie missing');

    const accountPage = await fetch(`http://127.0.0.1:${port}/account`, { headers: { cookie } });
    if (!accountPage.ok) throw new Error('account page failed after login');
    const accountHtml = await accountPage.text();
    for (const tab of ['Overview', 'Vault', 'Resources', 'VST', 'Plans']) {
      if (!accountHtml.includes(`>${tab}</a>`)) throw new Error(`account page missing ${tab} tab`);
    }
    if (!accountHtml.includes('aria-current="page">Overview</a>')) throw new Error('account should open on Overview');

    const authenticatedSplitPage = await fetch(`http://127.0.0.1:${port}/split-sheet`, { headers: { cookie } });
    if (!authenticatedSplitPage.ok) throw new Error('authenticated split form failed');
    const authenticatedSplitHtml = await authenticatedSplitPage.text();
    for (const expectedSplitFormCopy of ['Saved collaborator', 'splitSheetCollaborators.v1', 'Select saved collaborator']) {
      if (!authenticatedSplitHtml.includes(expectedSplitFormCopy)) throw new Error(`split form missing saved collaborator UX: ${expectedSplitFormCopy}`);
    }

    const vaultPage = await fetch(`http://127.0.0.1:${port}/account?tab=vault`, { headers: { cookie } });
    if (!vaultPage.ok) throw new Error('account vault failed');
    const vaultHtml = await vaultPage.text();
    if (!vaultHtml.includes('Split Sheet Vault')) throw new Error('account vault title missing');
    if (!vaultHtml.includes('>View</a>') || !vaultHtml.includes('>Download</a>')) throw new Error('account vault should include view and download actions');

    const resourcesPage = await fetch(`http://127.0.0.1:${port}/account?tab=resources`, { headers: { cookie } });
    if (!resourcesPage.ok || !(await resourcesPage.text()).includes('Guides for your next session')) {
      throw new Error('account Resources tab failed');
    }

    const vstPage = await fetch(`http://127.0.0.1:${port}/account?tab=vst`, { headers: { cookie } });
    if (!vstPage.ok) throw new Error('account VST tab failed');
    const vstHtml = await vstPage.text();
    if (!vstHtml.includes('Split Sheet Studio VST3') || !vstHtml.includes('plugin is included with Creator and Studio')) {
      throw new Error('account VST tab should show Free-plan upgrade path');
    }
    for (const expectedVstCopy of ['Upgrade to get the plugin', 'splitsheets', 'recording studio', 'sync licensing', '/vst-contributors.png']) {
      if (!vstHtml.includes(expectedVstCopy)) throw new Error(`account VST tab missing marketing copy: ${expectedVstCopy}`);
    }
    if (vstHtml.includes('Download Windows installer')) throw new Error('Free account should not see plugin installer action');

    const plansPage = await fetch(`http://127.0.0.1:${port}/account?tab=plans`, { headers: { cookie } });
    if (!plansPage.ok || !(await plansPage.text()).includes('Upgrade to Creator monthly')) {
      throw new Error('account Plans tab failed');
    }

    const revisionPage = await fetch(`http://127.0.0.1:${port}/split-sheet/revise/${created.splitSheet.id}/${revisionToken}`, {
      headers: { cookie }
    });
    if (!revisionPage.ok) throw new Error('revision page failed');
    const revisionPageHtml = await revisionPage.text();
    if (!revisionPageHtml.includes('Revised split-sheet request')) throw new Error('revision page banner missing');
    if (!revisionPageHtml.includes(`value="${created.splitSheet.id}"`)) throw new Error('revision source id missing from revision form');

    const revisionSubmit = new URLSearchParams();
    revisionSubmit.set('revisionOfId', created.splitSheet.id);
    revisionSubmit.set('revisionOfVersion', '1');
    revisionSubmit.set('songTitle', 'Smoke Test Song');
    revisionSubmit.set('alternateTitle', 'Smoke Test Song Revision');
    revisionSubmit.set('date', '2026-07-02');
    revisionSubmit.set('sessionLocation', 'Remote Follow-Up');
    revisionSubmit.set('notes', 'Revision smoke flow');
    revisionSubmit.set('rightsScope', 'composition');
    revisionSubmit.set('allPartiesAgree', 'yes');
    revisionSubmit.set('collectSignaturesByInvite', 'yes');
    revisionSubmit.set('supersedesPrevious', 'yes');
    revisionSubmit.append('recipientEmails', 'writer1@example.com');
    revisionSubmit.append('recipientEmails', 'writer2@example.com');
    for (const contributor of [
      { legalName: 'Writer One', role: 'Writer', email: 'writer1@example.com', writerShare: '50', publisherShare: '50' },
      { legalName: 'Writer Two', role: 'Producer', email: 'writer2@example.com', writerShare: '50', publisherShare: '50' }
    ]) {
      revisionSubmit.append('legalName', contributor.legalName);
      revisionSubmit.append('role', contributor.role);
      revisionSubmit.append('address', '');
      revisionSubmit.append('phone', '');
      revisionSubmit.append('email', contributor.email);
      revisionSubmit.append('pro', '');
      revisionSubmit.append('ipi', '');
      revisionSubmit.append('publisherName', '');
      revisionSubmit.append('publisherIpi', '');
      revisionSubmit.append('writerShare', contributor.writerShare);
      revisionSubmit.append('publisherShare', contributor.publisherShare);
      revisionSubmit.append('masterShare', '');
      revisionSubmit.append('typedSignatureName', '');
      revisionSubmit.append('signatureData', '');
    }

    const revisionCreate = await fetch(`http://127.0.0.1:${port}/split-sheet`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        cookie
      },
      body: revisionSubmit
    });
    if (!revisionCreate.ok) throw new Error('revision create failed');
    await revisionCreate.text();

    const listAfterRevision = await fetch(`http://127.0.0.1:${port}/api/split-sheets`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!listAfterRevision.ok) throw new Error('split list after revision failed');
    const listedAfterRevision = await listAfterRevision.json();
    const revisionSummary = listedAfterRevision.splitSheets.find((doc) =>
      doc.id !== created.splitSheet.id &&
      doc.songTitle === 'Smoke Test Song' &&
      Number(doc.version || 0) === 2
    );
    if (!revisionSummary) throw new Error('revision split sheet summary missing');

    const revisionDetailResponse = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${revisionSummary.id}`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!revisionDetailResponse.ok) throw new Error('revision split sheet detail missing');
    const revisionDetail = await revisionDetailResponse.json();
    if (revisionDetail.splitSheet?.payload?.revisionOfId !== created.splitSheet.id) {
      throw new Error('revision split sheet lineage missing source id');
    }
    if (Number(revisionDetail.splitSheet?.payload?.revisionOfVersion || 0) !== 1) {
      throw new Error('revision split sheet lineage missing source version');
    }

    for (const title of ['Free Limit Song 3']) {
      const extraCreate = await fetch(`http://127.0.0.1:${port}/api/split-sheets`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${auth.accessToken}`
        },
        body: JSON.stringify(validInvitePayload(title))
      });
      if (!extraCreate.ok) throw new Error(`free limit setup failed for ${title}`);
    }

    const usageAfterThree = await fetch(`http://127.0.0.1:${port}/api/account/usage`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!usageAfterThree.ok) throw new Error('usage endpoint failed');
    const usageAfterThreeJson = await usageAfterThree.json();
    if (usageAfterThreeJson.usage.used !== 3 || usageAfterThreeJson.usage.remaining !== 0) throw new Error('usage count after three splits mismatch');

    const blockedCreate = await fetch(`http://127.0.0.1:${port}/api/split-sheets`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify(validInvitePayload('Free Limit Song 4'))
    });
    if (blockedCreate.status !== 402) throw new Error('free plan should block fourth split sheet request');

    const refresh = await fetch(`http://127.0.0.1:${port}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken: auth.refreshToken })
    });
    if (!refresh.ok) throw new Error('api refresh failed');
    const refreshed = await refresh.json();
    if (!refreshed.accessToken || !refreshed.refreshToken) throw new Error('refreshed tokens missing');

    const passwordResetRequest = await fetch(`http://127.0.0.1:${port}/api/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: accountEmail })
    });
    if (!passwordResetRequest.ok) throw new Error('password reset request failed');
    const resetRequest = await passwordResetRequest.json();
    if (!resetRequest.resetToken) throw new Error('password reset token missing');

    const nextPassword = 'smoke-pass-456';
    const passwordReset = await fetch(`http://127.0.0.1:${port}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token: resetRequest.resetToken, password: nextPassword })
    });
    if (!passwordReset.ok) throw new Error('password reset failed');

    const relogin = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: accountEmail,
        password: nextPassword
      })
    });
    if (!relogin.ok) throw new Error('relogin after password reset failed');
    const reloginJson = await relogin.json();
    if (!reloginJson.accessToken || !reloginJson.refreshToken) throw new Error('relogin tokens missing');

    const logout = await fetch(`http://127.0.0.1:${port}/api/auth/logout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken: reloginJson.refreshToken })
    });
    if (!logout.ok) throw new Error('api logout failed');

    console.log('smoke test passed');
  } finally {
    child.kill('SIGTERM');
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
