const { spawnSync } = require('node:child_process');
const path = require('node:path');

const result = spawnSync(process.execPath, ['--test', path.join(__dirname, 'release-security.cjs')], {
  env: { ...process.env, RELEASE_TEST_POSTGRES: '1' },
  stdio: 'inherit',
  windowsHide: true
});
if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;
