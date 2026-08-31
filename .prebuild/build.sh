#!/bin/sh

set -e

. /etc/os-release

cd /node-pty
# rm -rf node_modules
echo
echo "Building for $(uname -m)... ->" $*

echo
#npm cache clean
#npm ci --ignore-scripts --no-bin-links
npm ci --ignore-scripts
# https://github.com/microsoft/vscode/blob/c23f0305dbf82b2319b198f4dbf3c5d5bc522f15/build/azure-pipelines/linux/product-build-linux-client.yml#L113-L125

echo

#node .prebuild/build.js
env JOBS=max node $*
echo