#!/bin/bash

set -e

export BASE_IMAGE=balenalib/raspberry-pi-debian:bullseye
export QEMU_ARCH=arm
export DOCKERFILE="Dockerfile.debian"
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

export BASE_IMAGE=library/debian:11.7-slim
export QEMU_ARCH=x86_64
export DOCKERFILE="Dockerfile.debian"
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

export BASE_IMAGE=i386/debian:11.7-slim
export QEMU_ARCH=i386
export DOCKERFILE="Dockerfile.debian"
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

export BASE_IMAGE=arm64v8/debian:11.7-slim
export QEMU_ARCH=aarch64
export DOCKERFILE="Dockerfile.debian"
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

export BASE_IMAGE=library/node:16-alpine
export QEMU_ARCH=x86_64
export DOCKERFILE="Dockerfile.alpine"
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

export BASE_IMAGE=arm32v6/node:16-alpine
export QEMU_ARCH=arm
export DOCKERFILE="Dockerfile.alpine"
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

export BASE_IMAGE=arm64v8/node:16-alpine
export QEMU_ARCH=aarch64
export DOCKERFILE="Dockerfile.alpine"
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

if [ "`uname -m`" = "arm64"  ] && [ "`uname`" = "Darwin" ]; then
  npm install --ignore-scripts
  node .prebuild/build.js
  echo "Manually copy the MacOS/ARM binaries to the release"
else
  echo "MacOS/ARM binaries need to be built on a ARM based Mac"
fi
