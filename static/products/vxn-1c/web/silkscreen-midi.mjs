// Web MIDI input for web instruments (ADR 0010 §6, ticket 0125).
//
// The page stands in for a host, and a host passes a MIDI controller's
// messages to the plugin. The engine's ring already carries MIDI 1.0
// (NoteEvent::from_midi decodes it), so this module decodes nothing: it
// forwards every channel message (0x80..0xEF) as [status, data1, data2],
// two-byte messages padded with a zero, and drops system messages (SysEx,
// clock, active sensing), which the ring doesn't carry.
//
// After vxn-1b's midi-input.mjs: every input port is subscribed, hotplug
// adds and drops ports, and a browser without Web MIDI (Safari) or a
// refused permission resolves rather than throws, so the page plays on from
// its own keyboards. Unlike vxn's, it doesn't place messages within the
// quantum: the engine applies MIDI at block start (ADR 0010 §6).

/// The ring's word for a Web MIDI message, or null if it carries none:
/// a channel message as [status, data1, data2].
export function channelMessage(data) {
  if (!data || data.length < 1) return null;
  const status = data[0];
  if (status < 0x80 || status >= 0xf0) return null;
  return [status, (data[1] ?? 0) & 0x7f, (data[2] ?? 0) & 0x7f];
}

/**
 * Subscribe every MIDI input, now and as devices come and go.
 *
 * @param {object} o
 * @param {(message: number[]) => void} o.onMidi  each channel message
 * @param {(inputs: string[]) => void} [o.onInputs]  the connected inputs' names,
 *        on attach and on every change
 * @param {() => Promise<MIDIAccess>} [o.requestMIDIAccess]  a seam for tests
 * @returns {Promise<{ granted: boolean, error: Error|null, detach(): void }>}
 */
export async function attachMidi({ onMidi, onInputs = () => {}, requestMIDIAccess } = {}) {
  const request =
    requestMIDIAccess ??
    (globalThis.navigator?.requestMIDIAccess
      ? () => globalThis.navigator.requestMIDIAccess({ sysex: false })
      : null);
  const none = (error) => ({ granted: false, error, detach() {} });
  if (!request) return none(new Error("Web MIDI isn't available in this browser"));
  let access;
  try {
    access = await request();
  } catch (e) {
    return none(e instanceof Error ? e : new Error(String(e)));
  }

  const ports = new Map(); // id -> port
  const handler = (e) => {
    const message = channelMessage(e.data);
    if (message) onMidi(message);
  };
  const report = () => onInputs([...ports.values()].map((p) => p.name || p.id));
  const subscribe = (port) => {
    if (port.type !== "input" || port.state === "disconnected" || ports.has(port.id)) return;
    port.onmidimessage = handler;
    ports.set(port.id, port);
  };
  const drop = (id) => {
    const port = ports.get(id);
    if (!port) return;
    port.onmidimessage = null;
    ports.delete(id);
  };

  for (const port of access.inputs.values()) subscribe(port);
  access.onstatechange = (e) => {
    const port = e.port;
    if (!port || port.type !== "input") return;
    if (port.state === "connected") subscribe(port);
    else drop(port.id);
    report();
  };
  report();

  return {
    granted: true,
    error: null,
    detach() {
      access.onstatechange = null;
      for (const id of [...ports.keys()]) drop(id);
    },
  };
}
