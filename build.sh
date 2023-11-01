#!/bin/bash

set -e

export oldNodeBuildTargets='-t 10.0.0 -t 11.0.0 -t 12.0.0 -t 13.0.0 -t 14.0.0 -t 15.0.0 -t 16.0.0 -t 17.0.1 -t 18.0.0'
export nodeBuildTargets='-t 19.0.0 -t 20.0.0 -t 21.0.0'

export electronBuildTargets='-t 5.0.0 -t 6.0.0 -t 7.0.0 -t 8.0.0 -t 9.0.0 -t 10.0.0 -t 11.0.0 -t 12.0.0 -t 13.0.0 -t 14.0.0 -t 15.0.0 -t 16.0.0 -t 17.0.0 -t 18.0.0'

export oldRunCMD="./.prebuild/build.sh .prebuild/prebuild.js ${oldNodeBuildTargets} && \
./.prebuild/build.sh .prebuild/prebuildify.js ${oldNodeBuildTargets} && \
./.prebuild/build.sh .prebuild/electron.js ${electronBuildTargets}"

export RunCMD="./.prebuild/build.sh .prebuild/prebuild.js ${nodeBuildTargets} && \
./.prebuild/build.sh .prebuild/prebuildify.js ${nodeBuildTargets}"

export BuildAllCMD="./.prebuild/build.sh .prebuild/prebuild.js ${oldNodeBuildTargets} ${nodeBuildTargets} && \
./.prebuild/build.sh .prebuild/prebuildify.js ${oldNodeBuildTargets} ${nodeBuildTargets} && \
./.prebuild/build.sh .prebuild/electron.js ${electronBuildTargets}"

# Older

export QEMU_ARCH=x86_64
export DOCKERFILE="Dockerfile.oldDebian"
export CMD=$oldRunCMD
docker build -f .prebuild/$DOCKERFILE --build-arg QEMU_ARCH=${QEMU_ARCH} -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build bash -c "$CMD"

#docker run -v $(pwd):/node-pty multiarch-build ./.prebuild/build.sh .prebuild/prebuild.js ${oldNodeBuildTargets}
#docker run -v $(pwd):/node-pty multiarch-build ./.prebuild/build.sh .prebuild/prebuildify.js ${oldNodeBuildTargets}
#docker run --rm -v $(pwd):/node-pty multiarch-build ./.prebuild/build.sh .prebuild/electron.js ${electronBuildTargets}

# Newer

export QEMU_ARCH=x86_64
export DOCKERFILE="Dockerfile.debian"
export CMD=$RunCMD
docker build -f .prebuild/$DOCKERFILE --build-arg QEMU_ARCH=${QEMU_ARCH} -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build bash -c "$CMD"

#docker run -v $(pwd):/node-pty multiarch-build ./.prebuild/build.sh .prebuild/prebuild.js ${nodeBuildTargets}
#docker run --rm -v $(pwd):/node-pty multiarch-build ./.prebuild/build.sh .prebuild/prebuildify.js ${nodeBuildTargets}

# Older

export BASE_IMAGE=balenalib/raspberry-pi-debian:bullseye
export QEMU_ARCH=arm
export DOCKERFILE="Dockerfile.debian"
export CMD=$BuildAllCMD
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build bash -c "$CMD"

exit 0

# Newer

# export BASE_IMAGE=balenalib/raspberry-pi-debian:bullseye
# export QEMU_ARCH=arm
# export DOCKERFILE="Dockerfile.debian"
# export CMD=$RunCMD
# docker build -f .prebuild/$DOCKERFILE --build-arg QEMU_ARCH=${QEMU_ARCH} --build-arg CMD="${CMD}" -t multiarch-build .
# docker run --rm -v $(pwd):/node-pty multiarch-build


#Older

export BASE_IMAGE=i386/debian:9.6-slim
export QEMU_ARCH=i386
export DOCKERFILE="Dockerfile.oldDebian"
export CMD=$oldRunCMD
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} --build-arg CMD="${CMD}" -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

#Newer

export BASE_IMAGE=i386/debian:11.7-slim
export QEMU_ARCH=i386
export DOCKERFILE="Dockerfile.debian"
export CMD=$RunCMD
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} --build-arg CMD="${CMD}" -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

#Older

export BASE_IMAGE=arm64v8/debian:9.6-slim
export QEMU_ARCH=aarch64
export DOCKERFILE="Dockerfile.oldDebian"
export CMD=$oldRunCMD
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} --build-arg CMD="${CMD}" -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

#Newer

export BASE_IMAGE=arm64v8/debian:11.7-slim
export QEMU_ARCH=aarch64
export DOCKERFILE="Dockerfile.debian"
export CMD=$RunCMD
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} --build-arg CMD="${CMD}" -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

# Not Impacted

export CMD=$BuildAllCMD

export BASE_IMAGE=library/node:16-alpine
export QEMU_ARCH=x86_64
export DOCKERFILE="Dockerfile.alpine"
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} --build-arg CMD="${CMD}" -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

export BASE_IMAGE=arm32v6/node:16-alpine
export QEMU_ARCH=arm
export DOCKERFILE="Dockerfile.alpine"
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} --build-arg CMD="${CMD}" -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

export BASE_IMAGE=arm64v8/node:16-alpine
export QEMU_ARCH=aarch64
export DOCKERFILE="Dockerfile.alpine"
docker build -f .prebuild/$DOCKERFILE --build-arg BASE_IMAGE=${BASE_IMAGE} --build-arg QEMU_ARCH=${QEMU_ARCH} --build-arg CMD="${CMD}" -t multiarch-build .
docker run --rm -v $(pwd):/node-pty multiarch-build

if [ "`uname -m`" = "arm64"  ] && [ "`uname`" = "Darwin" ]; then
  npm install --ignore-scripts
  node .prebuild/build.js
  echo "Manually copy the MacOS/ARM binaries to the release"
else
  echo "MacOS/ARM binaries need to be built on a ARM based Mac"
fi
