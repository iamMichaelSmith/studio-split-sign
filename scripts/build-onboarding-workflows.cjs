const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const directory = path.resolve(__dirname, '../integrations/n8n');
const beta = process.argv.includes('--beta');
fs.mkdirSync(directory, { recursive: true });
for (const journey of ['direct', 'invited']) {
  const workflow = {
    name: `Split Sheet Studio${beta ? ' BETA' : ''} — ${journey === 'direct' ? 'Direct signup' : 'Invited contributor'} onboarding`,
    active: false,
    nodes: [
      { id: randomUUID(), name: 'Journey schedule', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2,
        position: [0, 0], parameters: { rule: { interval: [{ field: 'minutes', minutesInterval: beta ? 1 : 15 }] } } },
      { id: randomUUID(), name: 'Run due journey emails', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
        position: [260, 0], parameters: {
          method: 'POST', url: `${beta ? 'http://192.168.1.70:5051' : 'https://app.splitsheetstudio.com'}/api/automations/onboarding/${journey}/run`,
          authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
          sendBody: true, specifyBody: 'json', jsonBody: '{"dryRun":true,"limit":25}',
          options: { timeout: 120000 }
        }, ...(beta ? { credentials: { httpHeaderAuth: { name: 'Split Sheet Studio onboarding' } } } : {}) },
      { id: randomUUID(), name: 'Check delivery results', type: 'n8n-nodes-base.code', typeVersion: 2,
        position: [520, 0], parameters: {
          jsCode: "const result = $input.first().json;\nif (result.needsReview > 0) throw new Error('Onboarding delivery needs review in the app database; do not automatically resend uncertain deliveries.');\nif (!result.dryRun && result.enabled === false) throw new Error('Email journeys are disabled in the app.');\nreturn $input.all();"
        } },
      { id: randomUUID(), name: 'Setup and journey', type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
        position: [-50, -360], parameters: { width: 760, height: 300,
          content: beta ? `## BETA: ${journey === 'direct' ? 'Direct signup' : 'Invited contributor'}\n\nOnly blakmarigold@gmail.com receives beta mail. Separate local database; production remains unchanged.\n\nWelcome → first action → vault → plugin skins → approved collaborators → next session.\nTiming: days 0, 2, 4, 7, 10, and 14. Check every minute; the app controls due dates.\n\nStart/restart or send the next email manually at:\nhttp://192.168.1.70:5051/admin/email-journeys\n\nUses the existing AWS SES sender and an embedded screenshot header. dryRun=true previews counts; set false to run beta delivery. Keep the beta app running on this computer. Production requires its own deployment and published workflows after owner approval.` : `## ${journey === 'direct' ? 'Direct signup' : 'Invited contributor'} journey\n\nWelcome → first action → vault → plugin skins → approved collaborators → next session.\nPlanned days: 0, 2, 4, 7, 10, 14. The app checks current account activity, plan and consent before delivery.\n\n1. Deploy the app changes. Set ONBOARDING_AUTOMATION_TOKEN and EMAIL_JOURNEYS_ENABLED.\n2. In the HTTP node, select Header Auth: Authorization = Bearer <the same token>.\n3. Execute with dryRun=true; this never sends email.\n4. Change dryRun to false, test with your own opted-in account, and publish.\n\nThe app sends through its existing SES/SMTP service. This workflow receives counts only. See docs/email-automation.md for recovery and suppression behavior.`
        } }
    ],
    connections: {
      'Journey schedule': { main: [[{ node: 'Run due journey emails', type: 'main', index: 0 }]] },
      'Run due journey emails': { main: [[{ node: 'Check delivery results', type: 'main', index: 0 }]] }
    },
    settings: { executionOrder: 'v1', timezone: 'America/Chicago', saveDataSuccessExecution: 'none', saveDataErrorExecution: 'all' }
  };
  fs.writeFileSync(path.join(directory, `onboarding-${beta ? 'beta-' : ''}${journey}.json`), JSON.stringify(workflow, null, 2) + '\n');
}
console.log('Created both n8n onboarding workflows (inactive, dry run).');
