const os = require('os');
const path = require('path');
const child_process = require('child_process');
const updateAbiRegistry = require('./updateABIRegistry');

const prebuildPkgPath = path.dirname(require.resolve('prebuild'));
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

console.log('Prebuild for Node.js:');
console.log(nodeBuildCmd.join(' '));

try {
  const result = child_process.spawnSync(process.execPath, nodeBuildCmd, {
    cwd: cwd,
    stdio: ['inherit', 'inherit', 'inherit']
  });
  console.log('Prebuild Result ', result.status, result.signal, result.error);
  if (result.status !== 0) {
    process.exit(1);
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}