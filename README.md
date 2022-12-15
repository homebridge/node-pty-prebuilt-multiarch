# node-pty-prebuilt-multiarch

![Prebuild Binaries](https://github.com/oznu/node-pty-prebuilt-multiarch/workflows/Prebuild%20Binaries/badge.svg)

This project is a parallel fork of [`node-pty`](https://github.com/Microsoft/node-pty) providing prebuilt packages for certain Node.js and Electron versions.

Based on [oznu/node-pty-prebuilt-multiarch](https://github.com/oznu/node-pty-prebuilt-multiarch) which was inspired by [daviwil/node-pty-prebuilt](https://github.com/daviwil/node-pty-prebuilt).

## Usage

Thanks to the excellent [`prebuild`](https://github.com/prebuild/prebuild) and [`prebuild-install`](https://github.com/prebuild/prebuild) modules, using this module is extremely easy.  You merely have to change your `node-pty` dependency to `node-pty-prebuilt-multiarch` and then change any `require` statements in your code from `require('node-pty')` to `require('node-pty-prebuilt-multiarch')`.

> **NOTE**: We started shipping prebuilds as of node-pty version 0.8.1, no prior versions are provided!  If you were using an earlier version of `node-pty` you will need to update your code to account for any API changes that may have occurred.

## How It Works

We maintain a parallel fork of the `node-pty` codebase that will be updated as new releases are shipped.  When we merge new updates to the code into the `prebuilt-multiarch` branch, new prebuilt packages for our supported Node.js and Electron versions are updated to the corresponding [GitHub release](https://github.com/oznu/node-pty-prebuilt-multiarch/releases).

When `node-pty-prebuilt-multiarch` is installed as a package dependency, the install script checks to see if there's a prebuilt package on this repo for the OS, ABI version, and architecture of the current process and then downloads it, extracting it into the module path.  If a corresponding prebuilt package is not found, `node-gyp` is invoked to build the package for the current platform.

## Prebuilt Versions

| OS              | Architectures               |
| --------------- |-----------------------------|
| macOS           | x64, arm64                  |
| Linux (glibc)   | ia32, x64, armv6, aarch64   |
| Linux (musl)    | x64, armv6, aarch64         |
| Windows         | ia32, x64                   |


*We only provide prebuilt binaries for Node.js 10 and Electron 5.0.0 or higher.

## License

* Copyright (c) 2012-2015, Christopher Jeffrey (MIT License).
* Copyright (c) 2016, Daniel Imms (MIT License).
* Copyright (c) 2018, Microsoft Corporation (MIT License).
* Copyright (c) 2018, David Wilson (MIT License).
* Copyright (c) 2018, oznu (MIT License).