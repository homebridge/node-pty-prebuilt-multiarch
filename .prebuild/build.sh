#!/bin/sh

. /etc/os-release

cd /node-pty
# rm -rf node_modules

echo "Building for $(uname -m)..."

npm install --ignore-scripts

node .prebuild/buildify.js
