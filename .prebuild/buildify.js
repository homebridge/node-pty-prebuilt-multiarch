const fs = require('fs');
const os = require('os');
const path = require('path');
const child_process = require('child_process');

const prebuildPkgPath = path.dirname(require.resolve('prebuildify'));
const prebuildPath = path.resolve(prebuildPkgPath, 'bin.js');

const cwd = path.resolve(__dirname, '../');

/**
 * --------------- Node.js Build ---------------
 */

// define build targets
const nodeBuildTargets = [
  '-t',
  '17.0.1',
  '-t',
  '18.0.0',
  '-t',
  '19.0.0',
  '-t',
  '20.0.0',
]

const nodeBuildCmd = [
  prebuildPath,
  ...nodeBuildTargets,
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