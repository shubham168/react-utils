const esbuild = require("esbuild");

const shared = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  minify: true,
  external: ["react"],
};

Promise.all([
  esbuild.build({
    ...shared,
    format: "esm",
    outfile: "dist/index.mjs",
  }),
  esbuild.build({
    ...shared,
    format: "cjs",
    outfile: "dist/index.cjs",
  }),
]).catch(() => process.exit(1));
