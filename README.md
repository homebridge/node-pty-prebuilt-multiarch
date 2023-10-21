# @homebridge/node-pty-prebuilt-multiarch

![Prebuild Binaries](https://github.com/homebridge/node-pty-prebuilt-multiarch/workflows/Build%20and%20Test/badge.svg)

This project is a parallel fork of [`node-pty`](https://github.com/Microsoft/node-pty) providing prebuilt packages for certain Node.js and Electron versions.

Inspired by [daviwil/node-pty-prebuilt](https://github.com/daviwil/node-pty-prebuilt).

## Usage

Thanks to the excellent [`prebuild`](https://github.com/prebuild/prebuild), [`prebuild-install`](https://github.com/prebuild/prebuild) modules, and [`prebuildify`](https://github.com/prebuild/prebuildify) using this module is extremely easy.  You merely have to change your `node-pty` dependency to `@homebridge/node-pty-prebuilt-multiarch` and then change any `require` statements in your code from `require('node-pty')` to `require('@homebridge/node-pty-prebuilt-multiarch')`.

> **NOTE**: We started shipping prebuilds as of node-pty version 0.8.1, no prior versions are provided!  If you were using an earlier version of `node-pty` you will need to update your code to account for any API changes that may have occurred.

## How It Works

We maintain a parallel fork of the `node-pty` codebase that will be updated as new releases are shipped.  When we merge new updates to the code into the `prebuilt-multiarch` branch, new prebuilt packages for our supported Node.js and Electron versions are updated to the corresponding [GitHub release](https://github.com/homebridge/node-pty-prebuilt-multiarch/releases).

When `@homebridge/node-pty-prebuilt-multiarch` is installed as a package dependency, the install script checks to see if there's a prebuilt package on this repo for the OS, ABI version, and architecture of the current process and then downloads it, extracting it into the module path.  If a corresponding prebuilt package is not found, `node-gyp` is invoked to build the package for the current platform.

## Prebuilt Versions

| OS              | Architectures               |
| --------------- |-----------------------------|
| macOS           | x64, arm64                  |
| Linux (glibc)   | ia32, x64, armv6, aarch64   |
| Linux (musl)    | x64, armv6, aarch64         |
| Windows         | ia32, x64                   |

*We only provide prebuilt binaries for Node.js 10 and Electron 5.0.0 or higher.

## Build / Package

Please note releasing this package uses GitHub actions.

1. Make your updates, and update version within package.json (and regenerate the lock file with the new version)
2. Create a Pre Release on GitHub with the TAG matching the version from Step 1 (with a `v` in front of it)
3. Run the GitHub action `Prebuild node-gyp and package for a GitHub Release` and supply the version TAG
4. Start a macOS ARM64 Local runner in your environment (see [here](https://github.com/homebridge/node-pty-prebuilt-multiarch/settings/actions/runners))
5. Run the GitHub action `Prebuild node-gyp MacOS ARM64 Binaries and package for a GitHub Release` and supply the version TAG
6. Wait for steps 3 and 5 to complete (step 3 takes about 30 minutes). If you need to rerun a step, go into the GitHub Release, and remove the attached pre-builds.
7. Run the GitHub action `Package GitHub release for NPM` and supply the version TAG.

If you experience an error when running `Prebuild node-gyp and package for a GitHub Release` and need to rerun, you may need to remove any release attachments from the failed build step.  You can do this with the action `Remove Release Assets from a GitHub Release`, and chose the approriate prebuild bundle.

## License

* Copyright (c) 2012-2015, Christopher Jeffrey (MIT License).
* Copyright (c) 2016, Daniel Imms (MIT License).
* Copyright (c) 2018, Microsoft Corporation (MIT License).
* Copyright (c) 2018, David Wilson (MIT License).
* Copyright (c) 2018, oznu (MIT License).
* Copyright (c) 2023, Homebridge (MIT License).
