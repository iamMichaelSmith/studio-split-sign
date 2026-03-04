const { spawn } = require('node:child_process');

async function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  const port = 5155;
  const child = spawn(process.execPath, ['server.js'], {
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', PUBLIC_BASE_URL: `http://127.0.0.1:${port}` },
    stdio: 'ignore'
  });

  try {
    await wait(1200);

    const health = await fetch(`http://127.0.0.1:${port}/health`);
    if (!health.ok) throw new Error('health failed');

    const ready = await fetch(`http://127.0.0.1:${port}/ready`);
    if (!ready.ok) throw new Error('ready failed');

    const home = await fetch(`http://127.0.0.1:${port}/`);
    if (!home.ok) throw new Error('home failed');

    const split = await fetch(`http://127.0.0.1:${port}/split-sheet`);
    if (!split.ok) throw new Error('split form failed');

    console.log('smoke test passed');
  } finally {
    child.kill('SIGTERM');
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
