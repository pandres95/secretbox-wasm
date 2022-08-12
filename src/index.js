import "./polyfills.js";

let wasm;

try {
  const go = new globalThis.Go();

  go.argv = process.argv.slice(2);
  go.env = Object.assign({ TMPDIR: require("os").tmpdir() }, process.env);
  go.exit = process.exit;

  const WASM_URL = await import.meta.resolve("../dist/secretbox.wasm");

  if ("instantiateStreaming" in WebAssembly) {
    const obj = await WebAssembly.instantiateStreaming(
      fetch(WASM_URL),
      go.importObject
    );

    wasm = obj.instance;
    go.run(wasm);
  } else {
    const bytes = await fetch(WASM_URL).then((resp) => resp.arrayBuffer());
    const obj = WebAssembly.instantiate(bytes, go.importObject);

    wasm = obj.instance;
    go.run(wasm);
  }
} catch (err) {
  throw new Error("Could not load secretbox.wasm", { cause: err });
}

export const open = instance.exports.open;
export const seal = instance.exports.seal;
