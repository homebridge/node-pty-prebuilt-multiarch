const fs = require('fs');
const os = require('os');
const path = require('path');
const child_process = require('child_process');

// node-abi is still shipping the wrong data
// correct this issue manually for now
const prebuildPkgPath = path.dirname(require.resolve('prebuild'));
const nodeAbiPkgPath = path.dirname(require.resolve('node-abi'));
const prebuildPath = path.resolve(prebuildPkgPath, 'bin.js');
const abiRegistryJsonPath = path.resolve(nodeAbiPkgPath, 'abi_registry.json');
const sourceAbiRegistryPath = path.resolve(__dirname, 'abi_registry.json');

if (fs.existsSync(sourceAbiRegistryPath)) {
  console.log('Overwriting abi_registry.json with the corrected version. v3.75.0 has an incorrect version for Node.js 24.x 134 rather than 137.')
  fs.copyFileSync(sourceAbiRegistryPath, abiRegistryJsonPath);
}

if (os.platform() === 'win32') {
  process.exit(0);
}

const cwd = path.resolve(__dirname, '../');

/**
 * --------------- Node.js Build ---------------
 */

var nodeBuildTargets = [...process.argv];

nodeBuildTargets.shift();
nodeBuildTargets.shift();

const nodeBuildCmd = [
  prebuildPath,
  ...nodeBuildTargets,
]

console.log('Prebuild for Node.js:');
console.log(nodeBuildCmd.join(' '));

try {
  var result = child_process.spawnSync(process.execPath, nodeBuildCmd, {
    cwd: cwd,
    stdio: ['inherit', 'inherit', 'inherit']
  });
  console.log('Prebuild Result ', result.status, result.signal, result.error);
  if (result.status != 0) {
    process.exit(1);
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}