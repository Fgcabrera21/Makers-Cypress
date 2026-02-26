/**
 * Ejecuta tests API iniciando el mock local.
 * Evita start-server-and-test que falla en Windows 11 (wmic.exe deprecado).
 */
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const MOCK_PORT = 4545;
const READY_URL = `http://localhost:${MOCK_PORT}/api/users`;
const MAX_WAIT_MS = 10000;
const POLL_MS = 200;

function waitForServer() {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function tryConnect() {
      if (Date.now() - start > MAX_WAIT_MS) {
        reject(new Error('Timeout esperando mock en ' + READY_URL));
        return;
      }
      const req = http.get(READY_URL, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => setTimeout(tryConnect, POLL_MS));
    }
    tryConnect();
  });
}

async function main() {
  const root = path.join(__dirname, '..');
  const mockPath = path.join(root, 'server', 'mock-reqres.js');
  const mock = spawn('node', [mockPath], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false
  });

  let exitCode = 1;
  const cleanup = () => {
    try {
      mock.kill();
    } catch (_) {}
  };

  process.on('SIGINT', () => { cleanup(); process.exit(130); });
  process.on('SIGTERM', () => { cleanup(); process.exit(143); });

  mock.stderr?.on('data', (d) => process.stderr.write(d));
  mock.stdout?.on('data', (d) => process.stdout.write(d));

  mock.on('error', (err) => {
    console.error('Error iniciando mock:', err);
    process.exit(1);
  });

  mock.on('exit', (code) => {
    if (code !== 0 && code !== null && exitCode === 1) {
      console.error('Mock terminó inesperadamente:', code);
    }
  });

  try {
    await waitForServer();
  } catch (err) {
    console.error(err.message);
    cleanup();
    process.exit(1);
  }

  const cypress = spawn('npx', ['cypress', 'run', '--spec', 'cypress/e2e/api/reqres-users.cy.js', '--browser', 'edge'], {
    cwd: root,
    stdio: 'inherit',
    shell: true
  });

  cypress.on('close', (code) => {
    exitCode = code ?? 1;
    cleanup();
    process.exit(exitCode);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
