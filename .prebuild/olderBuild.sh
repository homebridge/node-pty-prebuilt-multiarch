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
env JOBS=max node .prebuild/prebuild.js -t 10.0.0 -t 11.0.0 -t 12.0.0 -t 13.0.0 -t 14.0.0 -t 15.0.0 -t 16.0.0 -t 17.0.1 -t 18.0.0
env JOBS=max node .prebuild/prebuildify.js -t 10.0.0 -t 11.0.0 -t 12.0.0 -t 13.0.0 -t 14.0.0 -t 15.0.0 -t 16.0.0 -t 17.0.1 -t 18.0.0
env JOBS=max node .prebuild/electron.js -t 5.0.0 -t 6.0.0 -t 7.0.0 -t 8.0.0 -t 9.0.0 -t 10.0.0 -t 11.0.0 -t 12.0.0 -t 13.0.0 -t 14.0.0 -t 15.0.0 -t 16.0.0 -t 17.0.0 -t 18.0.0