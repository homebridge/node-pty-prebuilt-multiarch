import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

function prebuildName(): string {
  const tags = [];

  tags.push(process.versions.hasOwnProperty('electron') ? 'electron' : 'node');

  tags.push('abi' + process.versions.modules);

  if (os.platform() === 'linux' && fs.existsSync('/etc/alpine-release')) {
    tags.push('musl');
  }

  return tags.join('.') + '.node';
}

const pathToBuild = path.resolve(__dirname, `../prebuilds/${os.platform()}-${os.arch()}/${prebuildName()}`);

const winParentDir = path.resolve(__dirname, `../prebuilds/${os.platform()}-${os.arch()}/abi${process.versions.modules}/build/Release`);

export const ptyPath: string | null = fs.existsSync(pathToBuild) ? pathToBuild : null;
export const winPtyPath: string | null = fs.existsSync(winParentDir) ? `${winParentDir}/pty.node` : null;
export const winConPtyPath: string | null = fs.existsSync(winParentDir) ? `${winParentDir}/conpty.node` : null;
export const winConPtyConsoleListPath: string | null = fs.existsSync(winParentDir) ? `${winParentDir}/conpty_console_list.node` : null;

