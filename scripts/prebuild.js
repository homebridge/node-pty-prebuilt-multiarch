//@ts-check

const fs = require('fs');
const path = require('path');

/**
 * This script checks for the prebuilt binaries for the current platform and
 * architecture. It exits with 0 if prebuilds are found and 1 if not.
 *
 * If npm_config_build_from_source is set then it removes the prebuilds for the
 * current platform so they are not loaded at runtime.
 *
 * Usage:
 *     node scripts/prebuild.js
 */

const PREBUILDS_ROOT = path.join(__dirname, '..', 'prebuilds');
const PREBUILD_DIR = path.join(__dirname, '..', 'prebuilds', `${process.platform}-${process.arch}`);
const PREBUILD_FILES = (process.platform === 'win32'
  ? ['conpty.node', 'conpty_console_list.node']
  : ['pty.node']
).map(file => path.join(PREBUILD_DIR, file));

// Do not use prebuilds when npm_config_build_from_source is set
if (process.env.npm_config_build_from_source === 'true') {
  console.log(`\x1b[33m> Removing prebuilds from ${PREBUILDS_ROOT} and rebuilding because npm_config_build_from_source is set\x1b[0m`);
  fs.rmSync(PREBUILDS_ROOT, { recursive: true, force: true });
  process.exit(1);
}

// Check whether the correct prebuilt files exist
console.error(`\x1b[32m> Checking for prebuilds in directory ${PREBUILD_DIR}\x1b[0m`);
for (const prebuildFile of PREBUILD_FILES) {
  if (!fs.existsSync(prebuildFile)) {
    console.error(`\x1b[33m> Rebuilding because prebuild ${prebuildFile} does not exist\x1b[0m`);
    process.exit(1);
  }

  // Loading the addon catches ABI and shared-library incompatibilities that a
  // file existence check cannot, such as a GLIBC version newer than the host
  // provides. Exiting non-zero triggers the node-gyp rebuild fallback from the
  // package install script. Runtime module loading prefers build/Release over
  // prebuilds, so the locally rebuilt addon will be selected afterwards.
  try {
    require(prebuildFile);
    console.error(`\x1b[32m> Successfully loaded prebuild ${prebuildFile}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[33m> Rebuilding because prebuild ${prebuildFile} could not be loaded\x1b[0m`);
    console.error(error);
    process.exit(1);
  }
}

process.exit(0);
