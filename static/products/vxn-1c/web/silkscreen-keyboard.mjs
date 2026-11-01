// An on-screen piano keyboard for web instruments (ADR 0010 §6).
//
// It belongs to the page, which stands in for a host, not to the plugin's
// editor, so it's HTML under the faceplate rather than part of it. It emits
// MIDI 1.0 channel messages ([status, data1, data2]) through `onMidi`; the
// page writes them to the engine's MIDI ring.
//
// It also plays from the computer keyboard: the home row from A is the
// white keys from C, the row above the black keys, and Z and X shift the
// octave. The mapped keys show their letters on the strip.
//
// The logic (layout, hit testing, velocity, glide, the computer keys) is
// pure and exported for tests; mountKeyboard is the DOM around it. The pointer is captured on the
// strip and keys are found from coordinates, not DOM hit tests, so a drag
// glides from key to key, and off the strip it releases.

const BLACK_IN_OCTAVE = [false, true, false, true, false, false, true, false, true, false, true, false];
/// Black keys' share of a white key's width, and of the strip's height.
const BLACK_WIDTH = 0.6;
const BLACK_HEIGHT = 0.62;

export const isBlack = (key) => BLACK_IN_OCTAVE[key % 12];

/// Keys `low .. low + 12 * octaves` (plus the closing C), each with its x
/// and width in white-key units. `low` should be a C.
export function keyLayout(low, octaves) {
  const keys = [];
  let white = 0;
  for (let key = low; key <= low + 12 * octaves; key++) {
    if (isBlack(key)) {
      keys.push({ key, black: true, x: white - BLACK_WIDTH / 2, w: BLACK_WIDTH });
    } else {
      keys.push({ key, black: false, x: white, w: 1 });
      white += 1;
    }
  }
  return { keys, whites: white };
}

/// The key under (x, y), with x in white-key units and y in 0..1 down the
/// strip, or null off the strip. Black keys sit on top.
export function keyAt(layout, x, y) {
  if (y < 0 || y > 1 || x < 0 || x >= layout.whites) return null;
  if (y < BLACK_HEIGHT) {
    const black = layout.keys.find((k) => k.black && x >= k.x && x < k.x + k.w);
    if (black) return black.key;
  }
  const white = layout.keys.find((k) => !k.black && x >= k.x && x < k.x + k.w);
  return white ? white.key : null;
}

/// MIDI velocity for a press `y` (0..1) down the strip: deeper is louder,
/// as on a key pressed nearer its front edge.
export function velocityAt(y) {
  const v = 0.3 + 0.7 * Math.min(Math.max(y, 0), 1);
  return Math.max(1, Math.min(127, Math.round(v * 127)));
}

/// Computer keys as piano keys, by physical key (`KeyboardEvent.code`, so
/// it holds on any layout): [code, semitones above the base, label].
export const COMPUTER_KEYS = [
  ["KeyA", 0, "A"], ["KeyW", 1, "W"], ["KeyS", 2, "S"], ["KeyE", 3, "E"],
  ["KeyD", 4, "D"], ["KeyF", 5, "F"], ["KeyT", 6, "T"], ["KeyG", 7, "G"],
  ["KeyY", 8, "Y"], ["KeyH", 9, "H"], ["KeyU", 10, "U"], ["KeyJ", 11, "J"],
  ["KeyK", 12, "K"], ["KeyO", 13, "O"], ["KeyL", 14, "L"], ["KeyP", 15, "P"],
  ["Semicolon", 16, ";"], ["Quote", 17, "'"],
];
export const OCTAVE_DOWN = "KeyZ";
export const OCTAVE_UP = "KeyX";
const SPAN = COMPUTER_KEYS.at(-1)[1];

/// The MIDI key `code` plays from `base`, or null if it plays none.
export function computerNote(code, base) {
  const k = COMPUTER_KEYS.find(([c]) => c === code);
  return k ? base + k[1] : null;
}

/// `base` kept on a C from `low` and, where the strip is wide enough, with
/// every computer key on it.
export function clampBase(low, octaves, base) {
  const top = low + 12 * Math.max(0, Math.floor((12 * octaves - SPAN) / 12));
  return Math.min(top, Math.max(low, low + 12 * Math.round((base - low) / 12)));
}

/// Each MIDI key's computer-key label from `base`.
export function computerLabels(base) {
  return new Map(COMPUTER_KEYS.map(([, semis, label]) => [base + semis, label]));
}

/// Which key each pointer holds, as MIDI. Each method returns the messages
/// to send, in order.
export class Voices {
  constructor(channel = 0) {
    this.channel = channel & 0x0f;
    this.held = new Map(); // pointerId -> key
  }

  on(key, velocity) {
    return [[0x90 | this.channel, key, velocity]];
  }

  off(key) {
    return [[0x80 | this.channel, key, 0]];
  }

  /// A pointer went down on `key` (or off the strip, if null).
  down(pointer, key, velocity) {
    return this.move(pointer, key, velocity);
  }

  /// A pointer moved to `key` (null: off the strip): glide off the old key
  /// and onto the new one.
  move(pointer, key, velocity) {
    const was = this.held.has(pointer) ? this.held.get(pointer) : null;
    if (was === key) return [];
    const out = [];
    if (was !== null) out.push(...this.release(pointer));
    if (key !== null) {
      // Two pointers on one key: the newer owns it, so the key goes off
      // when that one leaves, not when the older one does.
      for (const [p, k] of this.held) if (k === key) this.held.delete(p);
      this.held.set(pointer, key);
      out.push(...this.on(key, velocity));
    }
    return out;
  }

  /// A pointer lifted, was cancelled, or left.
  up(pointer) {
    return this.release(pointer);
  }

  release(pointer) {
    if (!this.held.has(pointer)) return [];
    const key = this.held.get(pointer);
    this.held.delete(pointer);
    return this.off(key);
  }

  /// Every held key off.
  releaseAll() {
    const out = [];
    for (const pointer of [...this.held.keys()]) out.push(...this.release(pointer));
    return out;
  }

  keys() {
    return new Set(this.held.values());
  }
}

const STYLE = `
/* Fills its container, which sets the size; the keys are absolutely placed,
   so the strip has no height of its own. */
.ss-keyboard { display: flex; gap: 6px; align-items: stretch; height: 100%; min-height: 60px;
               user-select: none; -webkit-user-select: none; }
.ss-keyboard button { font: inherit; min-width: 32px; }
.ss-keys { position: relative; flex: 1; touch-action: none; cursor: pointer; }
.ss-key { position: absolute; top: 0; box-sizing: border-box; border: 1px solid #222; border-radius: 0 0 4px 4px; }
.ss-key.white { height: 100%; background: #eee; z-index: 0; }
.ss-key.black { height: ${BLACK_HEIGHT * 100}%; background: #222; z-index: 1; }
.ss-key.white.down { background: #f5a623; }
.ss-key .ss-label { position: absolute; left: 0; right: 0; bottom: 6px; text-align: center;
                    font: 11px system-ui, sans-serif; pointer-events: none; }
.ss-key.white .ss-label { color: #777; }
.ss-key.black .ss-label { color: #aaa; }
.ss-key.black.down { background: #c47d0e; }
`;

/**
 * Mount a keyboard in `container`.
 *
 * @param {HTMLElement} container
 * @param {object} o
 * @param {(message: number[]) => void} o.onMidi  each [status, data1, data2]
 * @param {number} [o.low]      the lowest key, a C (MIDI number; 48 = C3)
 * @param {number} [o.octaves]  octaves shown
 * @param {number} [o.channel]  MIDI channel, 0..15
 * @param {boolean} [o.computerKeys]  play from the computer keyboard too
 * @param {() => boolean} [o.keysTaken]  true while something else (the
 *        editor's menus) wants the keys; computer keys stand aside
 * @returns {{ releaseAll(): void, setLow(low: number): void, show(message: number[]): void,
 *             destroy(): void }}
 */
export function mountKeyboard(
  container,
  { onMidi, low = 48, octaves = 2, channel = 0, computerKeys = true, keysTaken = () => false },
) {
  if (!document.getElementById("ss-keyboard-style")) {
    const style = document.createElement("style");
    style.id = "ss-keyboard-style";
    style.textContent = STYLE;
    document.head.append(style);
  }
  const root = document.createElement("div");
  root.className = "ss-keyboard";
  const down = Object.assign(document.createElement("button"), { textContent: "−", title: "Octave down" });
  const up = Object.assign(document.createElement("button"), { textContent: "+", title: "Octave up" });
  const strip = document.createElement("div");
  strip.className = "ss-keys";
  root.append(down, strip, up);
  container.append(root);

  const voices = new Voices(channel);
  // Keys held from outside the strip (a MIDI controller), lit but not sent.
  const outside = new Set();
  // Computer keys start an octave above the strip's lowest C.
  let base = clampBase(low, octaves, low + 12);
  let layout;
  let elements = new Map();
  const send = (messages) => {
    for (const m of messages) onMidi(m);
    const held = new Set([...voices.keys(), ...outside]);
    for (const [key, el] of elements) el.classList.toggle("down", held.has(key));
  };

  const draw = () => {
    layout = keyLayout(low, octaves);
    strip.replaceChildren();
    elements = new Map();
    const labels = computerKeys ? computerLabels(base) : new Map();
    for (const k of layout.keys) {
      const el = document.createElement("div");
      el.className = `ss-key ${k.black ? "black" : "white"}`;
      el.style.left = `${(k.x / layout.whites) * 100}%`;
      el.style.width = `${(k.w / layout.whites) * 100}%`;
      if (labels.has(k.key)) {
        const label = Object.assign(document.createElement("span"), { className: "ss-label", textContent: labels.get(k.key) });
        el.append(label);
      }
      strip.append(el);
      elements.set(k.key, el);
    }
    send([]); // relight what's held
  };

  const at = (e) => {
    const r = strip.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * layout.whites;
    const y = (e.clientY - r.top) / r.height;
    return { key: keyAt(layout, x, y), velocity: velocityAt(y) };
  };

  const listeners = [];
  const listen = (target, type, f) => {
    target.addEventListener(type, f);
    listeners.push(() => target.removeEventListener(type, f));
  };
  listen(strip, "pointerdown", (e) => {
    e.preventDefault();
    strip.setPointerCapture(e.pointerId);
    const { key, velocity } = at(e);
    send(voices.down(e.pointerId, key, velocity));
  });
  listen(strip, "pointermove", (e) => {
    if (!voices.held.has(e.pointerId) && !strip.hasPointerCapture(e.pointerId)) return;
    const { key, velocity } = at(e);
    send(voices.move(e.pointerId, key, velocity));
  });
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
    listen(strip, type, (e) => send(voices.up(e.pointerId)));
  }
  const releaseAll = () => send(voices.releaseAll());
  listen(window, "blur", releaseAll);
  listen(window, "pagehide", releaseAll);
  listen(document, "visibilitychange", () => {
    if (document.hidden) releaseAll();
  });
  listen(strip, "contextmenu", (e) => e.preventDefault());

  const setLow = (next) => {
    releaseAll();
    const offset = base - low;
    low = Math.max(0, Math.min(127 - 12 * octaves, next));
    base = clampBase(low, octaves, low + offset);
    draw();
  };

  if (computerKeys) {
    // Keys held are released by their own keyup, whatever the octave is
    // by then; `kb:` ids keep them apart from pointers in `voices`.
    const typing = (t) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    listen(window, "keydown", (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || typing(e.target) || keysTaken()) return;
      if (e.code === OCTAVE_DOWN || e.code === OCTAVE_UP) {
        const next = clampBase(low, octaves, base + (e.code === OCTAVE_UP ? 12 : -12));
        if (next !== base) {
          base = next;
          draw();
        }
        return;
      }
      const key = computerNote(e.code, base);
      if (key === null || key > 127) return;
      e.preventDefault();
      send(voices.down(`kb:${e.code}`, key, 100));
    });
    listen(window, "keyup", (e) => send(voices.up(`kb:${e.code}`)));
  }
  listen(down, "click", () => setLow(low - 12));
  listen(up, "click", () => setLow(low + 12));

  draw();
  return {
    releaseAll,
    /// Light keys for a message that reached the engine another way (Web
    /// MIDI): note on and off, and all notes off (CC 123).
    show([status, d1, d2]) {
      const type = status & 0xf0;
      if (type === 0x90 && d2 > 0) outside.add(d1);
      else if (type === 0x80 || type === 0x90) outside.delete(d1);
      else if (type === 0xb0 && d1 === 123) outside.clear();
      else return;
      send([]);
    },
    setLow,
    destroy() {
      releaseAll();
      for (const remove of listeners) remove();
      root.remove();
    },
  };
}
