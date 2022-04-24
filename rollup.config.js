import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import hashbang from "rollup-plugin-hashbang";
import { uglify } from "rollup-plugin-uglify";
import commonjs from 'rollup-plugin-commonjs';

const commonPlugins = [
  typescript({
    exclude: "node_modules/**",
    typescript: require("typescript"),
  }),
  sourceMaps(),
  uglify(),
  hashbang(),
  commonjs({
    include: 'node_modules/**',  // Default: undefined
  })
]

export default [
  {
    input: "./src/command.ts",
    output: [
      {
        format: "cjs",
        file: "lib/command.js",
        sourcemap: true,
      },
    ],
    plugins: commonPlugins,
  },
  {
    input: "./src/open.ts",
    output: [
      {
        format: "cjs",
        file: "lib/index.js",
        sourcemap: true,
      },
    ],
    plugins: commonPlugins
  },
];
