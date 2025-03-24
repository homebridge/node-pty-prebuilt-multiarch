const fs = require("fs");
const os = require("os");
const path = require("path");
const child_process = require("child_process");

const prebuildPkgPath = path.dirname(require.resolve("prebuildify"));
const prebuildPath = path.resolve(prebuildPkgPath, "bin.js");

const cwd = path.resolve(__dirname, "../");

/**
 * --------------- Node.js Build ---------------
 */

// define build targets
const nodeBuildTargets = [
  "17.0.1",
  "18.0.0",
  "19.0.0",
  "20.0.0",
  "21.0.0",
  "22.0.0",
].reduce((acc, ver) => {
  acc.push("-t");
  acc.push(ver);
  return acc;
}, []);

const nodeBuildCmd = [prebuildPath, ...nodeBuildTargets];

if (os.platform() === "linux" && fs.existsSync("/etc/alpine-release")) {
  nodeBuildCmd.push("--tag-libc");
}

console.log("Building for Node.js:");
console.log(nodeBuildCmd.join(" "));

try {
  child_process.spawnSync(process.execPath, nodeBuildCmd, {
    cwd: cwd,
    stdio: ["inherit", "inherit", "inherit"],
  });
} catch (e) {
  console.error(e);
  process.exit(0);
}
