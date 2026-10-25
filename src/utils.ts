/**
 * Copyright (c) 2017, Daniel Imms (MIT License).
 * Copyright (c) 2018, Microsoft Corporation (MIT License).
 */

export function assign(target: any, ...sources: any[]): any {
  sources.forEach(source => Object.keys(source).forEach(key => target[key] = source[key]));
  return target;
}


export function loadNativeModule(name: string): {dir: string, module: any} {
  // Check build, debug, and then prebuilds.
  const dirs = ['build/Release', 'build/Debug', `prebuilds/${process.platform}-${process.arch}`];
  // Check relative to the parent dir for unbundled and then the current dir for bundled
  const relative = ['..', '.'];
  const checked: string[] = [];
  const loadErrors: Error[] = [];
  for (const d of dirs) {
    for (const r of relative) {
      const dir = `${r}/${d}`;
      const modulePath = `${dir}/${name}.node`;
      checked.push(modulePath);
      try {
        return { dir, module: require(modulePath) };
      } catch (e) {
        // A missing candidate is expected while searching the fallback paths.
        // Preserve actual loader failures so they are not hidden by a later
        // MODULE_NOT_FOUND from another candidate.
        if (e instanceof Error && (e as NodeJS.ErrnoException).code !== 'MODULE_NOT_FOUND') {
          loadErrors.push(e);
        }
      }
    }
  }

  if (loadErrors.length > 0) {
    const cause = loadErrors[0];
    console.error(cause);
    throw new Error(`Failed to load native module ${name}.node. Checked: ${checked.join(', ')}`);
  }

  throw new Error(`Failed to load native module ${name}.node because no candidate file was found. Checked: ${checked.join(', ')}`);
}
