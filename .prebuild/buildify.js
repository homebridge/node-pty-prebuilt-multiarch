const fs = require('fs');
const os = require('os');
const path = require('path');
const child_process = require('child_process');

// node-abi is still shipping the wrong data
// correct this issue manually for now
const prebuildPkgPath = path.dirname(require.resolve('prebuildify'));
const nodeAbiPkgPath = path.dirname(require.resolve('node-abi'));
const prebuildPath = path.resolve(prebuildPkgPath, 'bin.js');
const abiRegistryJsonPath = path.resolve(nodeAbiPkgPath, 'abi_registry.json');
fs.copyFileSync(path.resolve(__dirname, 'abi_registry.json'), abiRegistryJsonPath);

const nodeGypPkgPath = path.dirname(require.resolve('prebuild'));
const nodeGyp = path.resolve(nodeGypPkgPath, 'node_modules/node-gyp/bin/node-gyp.js');

const altAbiRegistryJsonPath = path.resolve(prebuildPkgPath, 'node_modules/node-abi/abi_registry.json');
if (fs.existsSync(altAbiRegistryJsonPath)) {
  fs.copyFileSync(path.resolve(__dirname, 'abi_registry.json'), altAbiRegistryJsonPath);
}

if (os.platform() === 'win32') {
  process.exit(0);
}

const cwd = path.resolve(__dirname, '../');

/**
 * --------------- Node.js Build ---------------
 */

// define build targets
const nodeBuildTargets = [
  '-t',
  '10.0.0',
  '-t',
  '11.0.0',
  '-t',
  ' 12.0.0',
  '-t',
  '13.0.0',
  '-t',
  '14.0.0',
  '-t',
  '15.0.0',
  '-t',
  '16.0.0',
  '-t',
  '17.0.1',
  '-t',
  '18.0.0'
]

const nodeBuildCmd = [
  prebuildPath,
  ...nodeBuildTargets,
  '--node-gyp',
  nodeGyp
]

if (os.platform() === 'linux' && fs.existsSync('/etc/alpine-release')) {
  nodeBuildCmd.push('--tag-libc')
}

console.log('Building for Node.js:');
console.log(nodeBuildCmd.join(' '));

try {
  child_process.spawnSync(process.execPath, nodeBuildCmd, {
    cwd: cwd,
    stdio: ['inherit', 'inherit', 'inherit']
  });
} catch (e) {
  console.error(e);
  process.exit(0);
}