import { createPlugins } from "rollup-plugin-atomic";

const plugins = createPlugins(["ts", "js"])
const output =  [
  {
    dir: "lib",
    format: "cjs",
    sourcemap: true,
  },
]

export default [
  {
    input: "src/index.ts",
    output: output,
    external: [],
    plugins: plugins,
  },
  {
    input: "src/windowsTerminal.ts",
    output: output,
    external: [],
    plugins: plugins,
  },
  {
    input: "src/unixTerminal.ts",
    output: output,
    external: [],
    plugins: plugins,
  },
];
