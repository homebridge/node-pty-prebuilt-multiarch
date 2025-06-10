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
 * --------------- Electron Build ---------------
 */

const electronBuildTargets = [...process.argv];

electronBuildTargets.shift();
electronBuildTargets.shift();

const electronBuildCmd = [
  prebuildPath,
  '-r',
  'electron',
  ...electronBuildTargets,
];

console.log('Building for Electron:');
console.log(electronBuildCmd.join(' '));

try {
  const result = child_process.spawnSync(process.execPath, electronBuildCmd, {
    cwd: cwd,
    stdio: ['inherit', 'inherit', 'inherit']
  });
  console.log('electronBuild Result ', result.status, result.signal, result.error);
  if (result.status !== 0) {
    process.exit(1);
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}