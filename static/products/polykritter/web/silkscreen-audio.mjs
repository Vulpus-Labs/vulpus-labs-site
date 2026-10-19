// Starts a silkscreen engine module in an AudioWorklet (ADR 0010 §1).
//
// Call startAudio from a user gesture (a click): browsers only let an
// AudioContext run when it's created or resumed inside one. Or call it
// with `suspended` on page load, to load everything up front, and call the
// result's `resume()` from the gesture.

/**
 * @param {object} o
 * @param {SharedArrayBuffer} o.sab        the UI's shared buffer (sab_link)
 * @param {string} o.engineUrl             the engine module's .wasm
 * @param {string} o.workletUrl            silkscreen-worklet.js
 * @param {"oscillator"|"microphone"|"none"} [o.source]  what feeds the
 *        engine: "none" for an instrument, which takes notes, not audio
 * @param {number} [o.channels]            1 or 2
 * @param {(load: number) => void} [o.onLoad]  twice a second, the engine's
 *        share of the audio thread (0..1, more when it overruns)
 * @param {boolean} [o.suspended]  don't resume: the caller resumes later,
 *        from a gesture
 */
export async function startAudio({
  sab, engineUrl, workletUrl, source = "oscillator", channels = 2, onLoad, suspended = false,
}) {
  if (!globalThis.crossOriginIsolated) {
    throw new Error(
      "silkscreen: the page isn't cross-origin isolated, so there's no SharedArrayBuffer; " +
        "serve it with COOP and COEP headers (cargo xtask web <example> --serve)",
    );
  }
  const ctx = new AudioContext();
  // Inside the gesture, before any await.
  const resumed = suspended ? Promise.resolve() : ctx.resume();
  const [, wasmBytes] = await Promise.all([
    ctx.audioWorklet.addModule(workletUrl),
    fetch(engineUrl).then((r) => {
      if (!r.ok) throw new Error(`silkscreen: fetching ${engineUrl}: ${r.status}`);
      return r.arrayBuffer();
    }),
  ]);
  const node = new AudioWorkletNode(ctx, "silkscreen-engine", {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [channels],
    processorOptions: { wasmBytes, sab, channels },
  });
  const ready = new Promise((resolve, reject) => {
    node.port.onmessage = (e) => {
      if (e.data.type === "load") onLoad?.(e.data.load);
      else if (e.data.type === "ready") resolve();
      else if (e.data.type === "error") reject(new Error(e.data.message));
    };
  });

  let input = null;
  if (source === "none") {
    // An instrument: the engine's input stays silent.
  } else if (source === "microphone") {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    input = ctx.createMediaStreamSource(stream);
  } else {
    const osc = new OscillatorNode(ctx, { type: "sawtooth", frequency: 220 });
    const level = new GainNode(ctx, { gain: 0.15 });
    osc.connect(level);
    osc.start();
    input = level;
  }
  if (input) input.connect(node);
  node.connect(ctx.destination);
  await Promise.all([resumed, ready]);

  return {
    ctx,
    node,
    /** A value from the page standing in for a host; the editor follows it. */
    /** Start the sound, from a user gesture. */
    resume: () => ctx.resume(),
    setHostParam: (index, value) => node.port.postMessage({ type: "host-param", index, value }),
    close: () => ctx.close(),
  };
}
