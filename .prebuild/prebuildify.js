const fs = require('fs');
const os = require('os');
const path = require('path');
const child_process = require('child_process');
const updateAbiRegistry = require('./updateABIRegistry');

const prebuildPkgPath = path.dirname(require.resolve('prebuildify'));
const prebuildPath = path.resolve(prebuildPkgPath, 'bin.js');

console.log('Prebuild Path:', prebuildPath);

// Update ABI registry before building
updateAbiRegistry();

if (os.platform() === 'win32') {
  process.exit(0);
}

const cwd = path.resolve(__dirname, '../');

/**
 * --------------- Node.js Build ---------------
 */

const nodeBuildTargets = [...process.argv];

nodeBuildTargets.shift();
nodeBuildTargets.shift();

const nodeBuildCmd = [
  prebuildPath,
  ...nodeBuildTargets,
];

if (os.platform() === 'linux' && fs.existsSync('/etc/alpine-release')) {
  nodeBuildCmd.push('--tag-libc');
}

console.log('Prebuildify for Node.js:');
console.log(nodeBuildCmd.join(' '));

try {
  const result = child_process.spawnSync(process.execPath, nodeBuildCmd, {
    cwd: cwd,
    stdio: ['inherit', 'inherit', 'inherit']
  });
  console.log('Prebuildify Result ', result.status, result.signal, result.error);
  if (result.status !== 0) {
    process.exit(1);
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}