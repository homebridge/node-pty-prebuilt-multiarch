/**
 * Copyright (c) 2017, Daniel Imms (MIT License).
 * Copyright (c) 2018, Microsoft Corporation (MIT License).
 */

import { ptyPath } from './prebuild-file-path';

export function assign(target: any, ...sources: any[]): any {
  sources.forEach(source => Object.keys(source).forEach(key => target[key] = source[key]));
  return target;
}


export function loadNativeModule(name: string): {dir: string, module: any} {
  // Fork: prebuilds bundled in the npm package use prebuildify's abi-tagged
  // file names (e.g. node.abi127.node), which the plain-name checks below
  // cannot find. prebuild-file-path resolves the tagged name for `pty`.
  if (name === 'pty' && ptyPath) {
    try {
      return { dir: ptyPath.substring(0, ptyPath.lastIndexOf('/')), module: require(ptyPath) };
    } catch {
      // Fall through to the standard search paths below.
    }
  }
  // Check build, debug, and then prebuilds.
  const dirs = ['build/Release', 'build/Debug', `prebuilds/${process.platform}-${process.arch}`];
  // Check relative to the parent dir for unbundled and then the current dir for bundled
  const relative = ['..', '.'];
  let lastError: unknown;
  for (const d of dirs) {
    for (const r of relative) {
      const dir = `${r}/${d}`;
      try {
        return { dir, module: require(`${dir}/${name}.node`) };
      } catch (e) {
        lastError = e;
      }
    }
  }
  throw new Error(`Failed to load native module: ${name}.node, checked: ${dirs.join(', ')}: ${lastError}`);
}
