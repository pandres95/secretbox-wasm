import module from "module";

const require = module.createRequire(import.meta.url);
require("./wasm_exec.cjs");

/** @type {import('fs')} */
let fs;
/** @type {import('util')} */
let util;
/** @type {import('crypto')} */
let crypto;

if (globalThis.Deno) {
  // Deno
  fs = await import("https://deno.land/std@0.152.0/node/fs.ts");
  util = await import("https://deno.land/std@0.152.0/node/util.ts");
  crypto = await import("https://deno.land/std@0.152.0/node/crypto.ts");
} else {
  // Node
  fs = await import("fs");
  util = await import("util");
  crypto = await import("crypto");
  process = globalThis.process;
}

globalThis.require = require;
globalThis.fs = fs;
globalThis.TextEncoder = util.TextEncoder;

globalThis.performance = {
  now() {
    if (globalThis.Deno) {
      return -1;
    }

    const [sec, nsec] = process.hrtime();
    return sec * 1000 + nsec / 1000000;
  },
};

globalThis.crypto = {
  getRandomValues(b) {
    crypto.randomFillSync(b);
  },
};
