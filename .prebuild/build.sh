#!/bin/sh

. /etc/os-release

cd /node-pty
# rm -rf node_modules

echo "Building for $(uname -m)..."

npm ci --ignore-scripts
# https://github.com/microsoft/vscode/blob/c23f0305dbf82b2319b198f4dbf3c5d5bc522f15/build/azure-pipelines/linux/product-build-linux-client.yml#L113-L125

 if [ "$QEMU_ARCH" = "arm"  ] || [ "$QEMU_ARCH" = "i386" ]; then
   export npm_config_force_process_config="true"
 fi

#node .prebuild/build.js
env JOBS=max node .prebuild/buildify.js
env JOBS=max node .prebuild/build.js