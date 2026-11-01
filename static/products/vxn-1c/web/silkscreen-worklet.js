// AudioWorkletProcessor for a silkscreen engine module (ADR 0010 §1).
//
// The engine module is raw C-ABI wasm built with
// `silkscreen_bridge::export_web_engine!`. Its transport logic is Rust; this
// file only supplies the `silkscreen_sab` imports (Atomics over the shared
// buffer) and copies audio between Web Audio and the engine's buffers.
//
// Following vxn-1b's worklet:
//   - the wasm bytes arrive in processorOptions (a worklet has no fetch) and
//     are instantiated asynchronously; process() renders silence until then;
//   - views of linear memory are cached and rebuilt only when
//     memory.buffer changes (growth), so a steady quantum allocates nothing:
//     Safari's GC crackles otherwise;
//   - a trap is reported once and stops the engine for good.
// No TextDecoder: AudioWorkletGlobalScope doesn't always have one.
//
// Twice a second it posts the engine's load (silkscreen-load.mjs).

import { LoadMeter, clock } from "./silkscreen-load.mjs";

function sharedWords(sab) {
  const w = new Int32Array(sab);
  return {
    len: () => w.length,
    load: (i) => Atomics.load(w, i),
    store: (i, v) => {
      Atomics.store(w, i, v);
    },
    swap: (i, v) => Atomics.exchange(w, i, v),
    fetch_or: (i, v) => Atomics.or(w, i, v),
    fetch_add: (i, v) => Atomics.add(w, i, v),
    compare_exchange: (i, c, v) => Atomics.compareExchange(w, i, c, v),
  };
}

function ascii(memory, ptr, len) {
  const bytes = new Uint8Array(memory.buffer, ptr, len);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return s;
}

class SilkscreenEngine extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const { wasmBytes, sab, channels } = options.processorOptions;
    this.channels = channels;
    this.x = null;
    this.dead = false;
    this.memoryBuffer = null;
    this.views = [];
    this.meter = null;

    this.port.onmessage = (e) => {
      const m = e.data;
      if (!this.x) return;
      if (m.type === "host-param") this.x.silkscreen_engine_host_set_param(m.index, m.value);
      else if (m.type === "reset") this.x.silkscreen_engine_reset();
    };

    WebAssembly.instantiate(wasmBytes, { silkscreen_sab: sharedWords(sab) }).then(
      ({ instance }) => {
        const x = instance.exports;
        const err = x.silkscreen_engine_init(sampleRate, channels);
        if (err) {
          this.fail(ascii(x.memory, x.silkscreen_engine_error(), err));
          return;
        }
        this.x = x;
        const q = x.silkscreen_engine_quantum();
        this.meter = new LoadMeter((q / sampleRate) * 1000, Math.round(sampleRate / 2 / q), clock());
        this.port.postMessage({ type: "ready" });
      },
      (e) => this.fail(String((e && e.message) || e)),
    );
  }

  fail(message) {
    this.dead = true;
    this.port.postMessage({ type: "error", message });
  }

  refreshViews() {
    const x = this.x;
    this.memoryBuffer = x.memory.buffer;
    const q = x.silkscreen_engine_quantum();
    this.views = [];
    for (let ch = 0; ch < this.channels; ch++) {
      this.views.push(new Float32Array(this.memoryBuffer, x.silkscreen_engine_buffer(ch), q));
    }
  }

  process(inputs, outputs) {
    if (this.dead) return false;
    const x = this.x;
    if (!x) return true; // silence until the engine is ready
    const input = inputs[0];
    const output = outputs[0];
    if (this.memoryBuffer !== x.memory.buffer) this.refreshViews();
    for (let ch = 0; ch < this.channels; ch++) {
      const src = input[ch] || input[0];
      if (src) this.views[ch].set(src);
      else this.views[ch].fill(0);
    }
    const start = this.meter.begin();
    try {
      x.silkscreen_engine_render(output[0].length);
    } catch (e) {
      this.fail(String((e && e.message) || e));
      return false;
    }
    const load = this.meter.end(start);
    if (load >= 0) this.port.postMessage({ type: "load", load });
    if (this.memoryBuffer !== x.memory.buffer) this.refreshViews();
    for (let ch = 0; ch < output.length; ch++) {
      output[ch].set(this.views[Math.min(ch, this.channels - 1)]);
    }
    return true;
  }
}

registerProcessor("silkscreen-engine", SilkscreenEngine);
