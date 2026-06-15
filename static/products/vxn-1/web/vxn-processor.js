// AudioWorkletProcessor for the production audio-host (tickets 0038 + 0040).
//
// 0038 built the render loop (one vxn_host_render per quantum); 0040 wraps it in
// the lifecycle runner (host-runner.mjs): instantiate-from-bytes, silence-until-
// ready, sample-rate, suspend/resume reset, teardown, and render-thread trap
// safety. This file is just the worklet shell around that shared runner.
//
// AudioWorklet module scope supports static ESM imports (resolved by
// audioWorklet.addModule) but has no fetch: the main thread hands us the wasm
// bytes plus the ring/store SABs through processorOptions. Instantiation is the
// raw WebAssembly.instantiate from 0034 — no wasm-bindgen.

import { WorkletHostRunner } from "./host-runner.mjs";

// ---- render-load meter clock ----------------------------------------------
// Best available wall clock in AudioWorkletGlobalScope. `performance.now()` is
// high-resolution but historically absent from the worklet scope
// (WebAudio/web-audio-api#2413); `Date.now()` (~1ms) is always present. We do NOT
// fall back to a constant 0 (the original meter's bug — it read 0 everywhere).
// With Date.now()'s coarse resolution a single sub-ms quantum reads 0/1ms, but
// accumulated per-quantum over a window it converges to the true mean: a render
// crosses a millisecond boundary with probability proportional to its duration.
const CPU_CLOCK =
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? { now: () => performance.now(), kind: "performance" }
    : { now: () => Date.now(), kind: "date" };

class VxnHostProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.alive = true;

    // ---- render-load meter (CPU %) ----------------------------------------
    // Sum render time over a window of quanta and divide by the window's
    // wall-clock budget; report the mean load + the window's per-quantum peak.
    // Windowed (not per-quantum) so the coarse Date.now() path averages out.
    this._cpuAccum = 0; // summed render ms this window
    this._cpuPeak = 0; // worst single-quantum load this window
    this._cpuQuanta = 0;
    this._cpuWindow = 48; // ~128ms @ 48k/128 — ~8 Hz, enough samples to smooth
    this._cpuClockLogged = false;

    const opts = options.processorOptions;
    this.runner = new WorkletHostRunner({
      wasmBytes: opts.wasmBytes,
      ringSab: opts.ringSab,
      storeSab: opts.storeSab, // optional
      sampleRate, // worklet global
      capacity: opts.capacity,
      // Surface lifecycle to the main thread (E016/E018 react to these).
      onReady: () => this.port.postMessage({ type: "ready" }),
      onTrap: (e, count) =>
        this.port.postMessage({ type: "trap", message: String(e && e.message || e), count }),
    });

    // Controller -> worklet lifecycle + shared-state messages. Params/notes flow
    // over the ring, not the port. Messages sent before ready are still honoured:
    // the runner buffers key-mode/split and applies them on instantiate.
    this.port.onmessage = (e) => {
      const m = e.data;
      switch (m.type) {
        case "keyMode": this.runner.setKeyMode(m.value); break;
        case "splitPoint": this.runner.setSplitPoint(m.value); break;
        case "sampleRate": this.runner.setSampleRate(m.value); break;
        case "reset": this.runner.reset(); break; // resume-after-suspend
        case "destroy": this.runner.destroy(); this.alive = false; break;
        default: break;
      }
    };

    this.runner.init(); // async; process() renders silence until it resolves
  }

  process(_inputs, outputs) {
    if (!this.alive) return false; // teardown: let the node be collected
    const out = outputs[0];
    const t0 = CPU_CLOCK.now();
    this.runner.process(out[0], out[1]); // silence-until-ready + trap-safe
    this._accumCpu(CPU_CLOCK.now() - t0, out[0] ? out[0].length : 128);
    return true;
  }

  // Fold one quantum's render time into the window accumulator; post a `cpu`
  // message (mean load + peak, both fractions of the quantum budget) once per
  // window. The first post tags which clock won, so a dead meter is debuggable.
  _accumCpu(dtMs, frames) {
    const budgetMs = (frames / sampleRate) * 1000; // per-quantum wall budget
    if (budgetMs > 0) {
      const load = dtMs / budgetMs;
      if (load > this._cpuPeak) this._cpuPeak = load;
    }
    this._cpuAccum += dtMs;
    if (++this._cpuQuanta >= this._cpuWindow) {
      const load = this._cpuAccum / (this._cpuQuanta * budgetMs);
      const msg = { type: "cpu", load, peak: this._cpuPeak };
      if (!this._cpuClockLogged) { msg.clock = CPU_CLOCK.kind; this._cpuClockLogged = true; }
      this.port.postMessage(msg);
      this._cpuAccum = 0;
      this._cpuPeak = 0;
      this._cpuQuanta = 0;
    }
  }
}

registerProcessor("vxn-host-processor", VxnHostProcessor);
