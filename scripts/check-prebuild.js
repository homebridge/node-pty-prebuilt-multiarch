const os = require('os');
const { ptyPath, winPtyPath } = require('../lib/prebuild-file-path');

const binToCheck = os.platform() === "win32" ? winPtyPath : ptyPath;

if (binToCheck) {
  console.log('Prebuild binary exists:', binToCheck);
  try {
    require(binToCheck);
  } catch (e) {
    console.error('Prebuild binary failed test.');
    process.exit(1);
  }
  process.exit(0);
} else {
  console.error('Prebuild binary missing for platform '+os.platform());
  process.exit(1);
}