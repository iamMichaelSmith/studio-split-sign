const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

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
  const port = 5155;
  const tempDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'split-sheet-studio-'));
  const accountEmail = 'smoke@example.com';
  const accountPass = 'smoke-pass-123';
  const child = spawn(process.execPath, ['server.js'], {
    env: {
      ...process.env,
      PORT: String(port),
      HOST: '127.0.0.1',
      PUBLIC_BASE_URL: `http://127.0.0.1:${port}`,
      DATA_DIR: tempDataDir,
      DB_PROVIDER: 'sqlite',
      DB_PATH: path.join(tempDataDir, 'app.db'),
      ADMIN_USER: 'admin-user',
      ADMIN_PASS: 'admin-pass-123',
      SESSION_SECRET: 'smoke-session-secret',
      API_TOKEN_SECRET: 'smoke-api-token-secret',
      ALLOW_PUBLIC_REGISTRATION: 'true',
      AUTH_DEBUG_TOKENS: 'true'
    },
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

    const pricing = await fetch(`http://127.0.0.1:${port}/pricing`);
    if (!pricing.ok) throw new Error('pricing page failed');

    const blog = await fetch(`http://127.0.0.1:${port}/blog`);
    if (!blog.ok) throw new Error('blog index failed');

    const blogPost = await fetch(`http://127.0.0.1:${port}/blog/what-is-a-split-sheet-in-music`);
    if (!blogPost.ok) throw new Error('blog post failed');

    for (const slug of ['terms', 'privacy', 'refund-policy', 'electronic-signature-consent', 'disclaimer']) {
      const legal = await fetch(`http://127.0.0.1:${port}/legal/${slug}`);
      if (!legal.ok) throw new Error(`legal page failed: ${slug}`);
    }

    const pluginUpdate = await fetch(`http://127.0.0.1:${port}/api/plugin/update?currentVersion=0.0.1`);
    if (!pluginUpdate.ok) throw new Error('plugin update endpoint failed');
    const pluginUpdateJson = await pluginUpdate.json();
    if (!pluginUpdateJson.latestVersion) throw new Error('plugin update latest version missing');

    const split = await fetch(`http://127.0.0.1:${port}/split-sheet`);
    if (!split.ok) throw new Error('split form failed');
    if (!((await split.text()).includes('Sign in'))) throw new Error('split form should require sign in');

    const signupPage = await fetch(`http://127.0.0.1:${port}/signup`);
    if (!signupPage.ok) throw new Error('signup page failed');

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
        displayName: 'Smoke User'
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
          { legalName: 'Writer One', role: 'Writer', email: 'writer1@example.com', writerShare: 50, publisherShare: 50 },
          { legalName: 'Writer Two', role: 'Producer', email: 'writer2@example.com', writerShare: 50, publisherShare: 50 }
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
    const rejectedSignature = await fetch(`http://127.0.0.1:${port}/split-sheet/sign/${created.splitSheet.id}/${signers[0].signerToken}`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ typedSignatureName: signers[0].legalName, signatureData })
    });
    if (rejectedSignature.status !== 400) throw new Error('signature without explicit agreement should be rejected');

    for (const signer of signers) {
      const signed = await fetch(`http://127.0.0.1:${port}/split-sheet/sign/${created.splitSheet.id}/${signer.signerToken}`, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ typedSignatureName: signer.legalName, signatureData, agreeToSplits: 'yes' })
      });
      if (!signed.ok) throw new Error(`signer completion failed for ${signer.legalName}`);
    }

    const completedStatusResponse = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${created.splitSheet.id}/status`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    const completedStatus = await completedStatusResponse.json();
    if (completedStatus.splitSheet.status !== 'completed') throw new Error('split did not finalize after every signer agreed');
    if (completedStatus.splitSheet.signerStats.signed !== 2) throw new Error('completed signer count mismatch');
    if (!completedStatus.splitSheet.allPartiesAgree || !completedStatus.splitSheet.completedAt) throw new Error('final agreement metadata missing');

    const finalPdf = await fetch(`http://127.0.0.1:${port}/split-sheet/pdf/${created.splitSheet.id}`);
    if (!finalPdf.ok || !(await finalPdf.arrayBuffer()).byteLength) throw new Error('final split PDF missing');

    for (const title of ['Free Limit Song 2', 'Free Limit Song 3']) {
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
    if (blockedCreate.status !== 402) throw new Error('free plan should block fourth split sheet');

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
