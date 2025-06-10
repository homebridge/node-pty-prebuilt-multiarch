const fs = require('fs');
const path = require('path');

/**
 * Updates the node-abi abi_registry.json with a corrected version if it exists.
 * @param {string} [sourcePath] - Optional path to source abi_registry.json. Defaults to '../abi_registry.json' relative to this file.
 * @returns {boolean} - True if the registry was updated, false otherwise.
 */
function updateAbiRegistry(sourcePath = path.resolve(__dirname, '../abi_registry.json')) {
  const nodeAbiPkgPath = path.dirname(require.resolve('node-abi'));
  const abiRegistryJsonPath = path.resolve(nodeAbiPkgPath, 'abi_registry.json');

  console.log('Target ABI Registry Path:', abiRegistryJsonPath);
  console.log('Source ABI Registry Path:', sourcePath);

  if (fs.existsSync(sourcePath)) {
    console.log('Overwriting abi_registry.json with the corrected version. v3.75.0 has an incorrect version for Node.js 24.x 134 rather than 137.');
    fs.copyFileSync(sourcePath, abiRegistryJsonPath);
    return true;
  } else {
    console.log('Source abi_registry.json not found, skipping update.');
    return false;
  }
}

// Execute the function if run directly
if (require.main === module) {
  updateAbiRegistry();
}

module.exports = updateAbiRegistry;