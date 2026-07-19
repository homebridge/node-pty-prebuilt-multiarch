'use strict'

const os = require('os');
const path = require('path');
const spawn = require('child_process').spawn;

const gypArgs = ['rebuild'];
if (process.env.NODE_PTY_DEBUG) {
  gypArgs.push('--debug');
}
// shell: true is required on Windows: spawning .cmd files directly throws
// EINVAL since the Node.js fix for CVE-2024-27980
const gypProcess = spawn(os.platform() === 'win32' ? 'node-gyp.cmd' : 'node-gyp', gypArgs, {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: os.platform() === 'win32'
});

gypProcess.on('exit', function (code) {
  process.exit(code);
});
