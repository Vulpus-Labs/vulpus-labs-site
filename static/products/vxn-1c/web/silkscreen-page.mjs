// The standard web presentation of a silkscreen synth (0326).
//
// One call builds the whole page: the faceplate's scroller over the pinned
// keyboard bar (0323), the splash with its browser note and the gesture
// that starts the sound, the CPU meter and MIDI readout, and the fit
// (0325). A synth's index.html is its meta tags and
//
//   import * as wasm from "./pkg/vxn2b_web.js";
//   import { mountSynthPage } from "./silkscreen-page.mjs";
//   mountSynthPage({ wasm, name: "vxn-2b", blurb: "the six-operator FM synth",
//                    engine: "./vxn2b_web_engine.wasm", example: "vxn2b" });
//
// The pure parts (the options' defaults, the browser note) are exported for
// the node tests; the rest needs a DOM.

import { startAudio } from "./silkscreen-audio.mjs";
import { mountKeyboard } from "./silkscreen-keyboard.mjs";
import { fitFaceplate } from "./silkscreen-fit.mjs";
import { attachMidi } from "./silkscreen-midi.mjs";

const VULPUS = "https://vulpuslabs.com";

/**
 * The page's options with their defaults filled in. Throws, naming the
 * option, if a required one is missing.
 *
 * @param {object} o
 * @param {{ default: Function, start: Function }} o.wasm  the synth's
 *        wasm-bindgen module (`import * as wasm from "./pkg/…_web.js"`)
 * @param {string} o.name     the synth's name, as the splash shows it
 * @param {string} o.blurb    what it is, after "the web demo of NAME, "
 * @param {string} o.engine   the engine module's URL
 * @param {string} [o.example]  its `cargo xtask web` name, for the
 *        not-isolated message (default: `name`)
 * @param {string} [o.homepage] where the splash links (default Vulpus Labs)
 * @param {string} [o.accent]   the splash link's colour
 * @param {{ src: string, alt: string, width?: number }} [o.logo]  shown
 *        on the splash in place of the name
 * @param {number} [o.low]      the keyboard's lowest key (default 36, C2)
 * @param {number} [o.octaves]  the keyboard's octaves (default 5)
 * @param {number} [o.keysHigh] the keyboard's height at zoom 1, CSS px
 *        (default 120)
 */
export function pageOptions(o) {
  for (const k of ["wasm", "name", "blurb", "engine"]) {
    if (o?.[k] == null) throw new Error(`mountSynthPage: the "${k}" option is required`);
  }
  return {
    example: o.name,
    homepage: VULPUS,
    accent: "#1f9cff",
    logo: null,
    low: 36,
    octaves: 5,
    keysHigh: 120,
    ...Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)),
  };
}

/**
 * The splash's note on browsers. Safari is warned off: on a Mac, Safari
 * itself (not the Chromium and Firefox builds that also say "Safari" in
 * their user agents); on an iPhone or iPad, every browser, as all of them
 * are WebKit there.
 *
 * @returns {{ text: string, warn: boolean }}
 */
export function browserNote({ userAgent = "", platform = "", maxTouchPoints = 0 } = {}) {
  const ios = /iPhone|iPad|iPod/.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1);
  const safari = /Safari\//.test(userAgent) && !/Chrome\/|Chromium\/|Edg\/|Firefox\//.test(userAgent);
  if (ios) {
    return {
      text: "On iPhone and iPad every browser runs on Safari's engine, which is not supported. If you try it, turn the volume up.",
      warn: true,
    };
  }
  if (safari) {
    return { text: "You appear to be using Safari, which is not supported. Use Chrome, Edge or Firefox.", warn: true };
  }
  return { text: "Best in Chrome, Edge or Firefox. Safari is not supported.", warn: false };
}

/** The CPU readout's text and colour for an engine load (0..1+). */
export function loadReadout(load) {
  const pct = load * 100;
  return {
    text: `CPU ${pct.toFixed(pct < 10 ? 1 : 0)}%`,
    width: `${Math.min(100, pct)}%`,
    colour: load > 0.8 ? "#e0533d" : load > 0.5 ? "#e0a23d" : "#5bbf6a",
  };
}

const STYLE = `
/* The faceplate scrolls; the keyboard doesn't. The body is the viewport
   (dvh: a phone's collapsing toolbars), a column of the faceplate's
   scroller over a bar pinned to the bottom, so the keys' front edges,
   where velocity is highest, are always on screen.
   The faceplate centres with auto margins, which never go negative: on a
   screen narrower or shorter than it, it starts at the top left and the
   scroller reaches the rest, where centring would cut it off. */
body { margin: 0; height: 100vh; height: 100dvh; display: flex; flex-direction: column; overflow: hidden;
       background: #202024; color: #c8c8cc; font: 14px system-ui, sans-serif; }
#stage { flex: 1 1 auto; min-height: 0; overflow: auto; display: flex; }
#face { margin: auto; padding: 16px 16px 0; }
#faceplate { display: block; margin: 0 auto; }
/* The keyboard takes the faceplate's width once it's fitted
   (silkscreen-fit.mjs); wider than the window, the bar scrolls sideways
   on its own. */
#keys { flex: none; display: flex; overflow-x: auto; padding: 16px; border-top: 1px solid #2e2e34; }
#keyboard { flex: none; margin: 0 auto; }
/* The page's own controls, out of the faceplate's way. */
#audio { position: fixed; top: 12px; left: 12px; width: 100px; display: grid; gap: 6px; }
#cpu { display: grid; grid-template-columns: auto 1fr; gap: 6px; align-items: center; font-size: 12px;
       font-variant-numeric: tabular-nums; }
#cpu-bar { height: 6px; background: #3a3a40; border-radius: 3px; overflow: hidden; }
#cpu-fill { height: 100%; width: 0; background: #5bbf6a; transition: width 0.2s; }
#status, #midi { font-size: 12px; color: #8c8c92; }
#midi { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* The splash: over everything while the page loads behind it. */
#splash { position: fixed; inset: 0; z-index: 10; display: grid; place-items: center;
          background: rgb(16 15 17 / 0.8); transition: opacity 0.25s; }
#splash.gone { opacity: 0; pointer-events: none; }
#splash .card { max-width: 520px; margin: 16px; padding: 32px 36px; text-align: center; display: grid; gap: 18px;
                background: #151417; border: 1px solid #3a3438; border-radius: 10px;
                box-shadow: 0 12px 48px rgb(0 0 0 / 0.6); }
#splash h1 { margin: 0; font-size: 28px; font-weight: 500; letter-spacing: 0.08em; color: #f0f0f2; }
#splash img { max-width: 100%; height: auto; margin: 0 auto; }
#splash p { margin: 0; line-height: 1.5; }
#splash a { color: var(--accent); }
#splash .browsers { font-size: 13px; color: #9a9aa0; }
#splash .browsers.safari { color: #ffb0b0; font-weight: 600; }
#splash .prompt { font-size: 16px; color: #f0f0f2; min-height: 1.5em; }
#splash .prompt.loading { color: #8c8c92; }
#splash .hint { font-size: 12px; color: #8c8c92; }
`;

/** An element with attributes and children (strings become text). */
function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else e.setAttribute(k, v);
  }
  e.append(...children);
  return e;
}

/** Build the page's DOM into `body`; returns its parts by role. */
function build(body, o) {
  const style = el("style", { id: "ss-page-style" });
  style.textContent = STYLE;
  document.head.append(style);
  document.documentElement.style.setProperty("--accent", o.accent);

  const link = el("a", { href: o.homepage, target: "_blank", rel: "noopener" });
  link.textContent = o.homepage === VULPUS ? "Vulpus Labs" : o.homepage.replace(/^https?:\/\//, "");
  const about =
    o.homepage === VULPUS
      ? el("p", {}, "This is the web demo of ", el("strong", {}, o.name), `, ${o.blurb} by `, link, ".")
      : el("p", {}, "This is the web demo of ", el("strong", {}, o.name), `, ${o.blurb} by Vulpus Labs. For more details, see `, link, ".");
  const title = o.logo
    ? el("img", { src: o.logo.src, alt: o.logo.alt, ...(o.logo.width ? { width: o.logo.width } : {}) })
    : el("h1", {}, o.name);
  const browsers = el("p", { class: "browsers" });
  const prompt = el("p", { class: "prompt loading" }, "Loading…");
  const splash = el(
    "div",
    { id: "splash", role: "dialog", "aria-label": `${o.name} web demo` },
    el(
      "div",
      { class: "card" },
      title,
      about,
      browsers,
      prompt,
      el("p", { class: "hint" }, "Play with the on-screen keyboard, the computer keys A to ' (Z and X change the octave), or a MIDI controller."),
    ),
  );

  const cpuText = el("span", { id: "cpu-text" }, "CPU –");
  const cpuFill = el("div", { id: "cpu-fill" });
  const midi = el("div", { id: "midi", title: "Web MIDI inputs" }, "MIDI –");
  const status = el("div", { id: "status" });
  const audio = el(
    "div",
    { id: "audio" },
    el("div", { id: "cpu", title: "The engine's share of the audio thread" }, cpuText, el("div", { id: "cpu-bar" }, cpuFill)),
    midi,
    status,
  );

  const canvas = el("canvas", { id: "faceplate" });
  const stage = el("div", { id: "stage" }, el("div", { id: "face" }, canvas));
  const keyboard = el("div", { id: "keyboard" });
  keyboard.style.height = `${o.keysHigh}px`;
  const keys = el("div", { id: "keys" }, keyboard);

  body.replaceChildren(splash, audio, stage, keys);
  return { splash, browsers, prompt, cpuText, cpuFill, midi, status, canvas, stage, keyboard };
}

/**
 * Build and start a synth's web page in `document.body`. Resolves once
 * everything has loaded behind the splash, with the parts the console
 * wants (also set as `window.page`, `window.audio`, `window.keyboard` and
 * `window.fit`).
 *
 * @param {object} options  see {@link pageOptions}
 * @returns {Promise<{ page: object, audio: object | null, keyboard: object, fit: object }>}
 */
export async function mountSynthPage(options) {
  const o = pageOptions(options);
  const ui = build(document.body, o);

  // Any key (or a click off the link) dismisses the splash once the page
  // has loaded, and starts the sound. The key is the splash's: it doesn't
  // also play a note, and while loading, keys do nothing. Shortcuts pass
  // (Cmd-R still reloads), and so does Escape, which browsers don't count
  // as the gesture audio needs.
  let loaded = false;
  let audio = null;
  let failed = null;
  let page = null;
  const resume = () => audio?.resume().catch((e) => (ui.status.textContent = String(e.message || e)));
  const dismiss = (e) => {
    if (e.type === "keydown" && (e.metaKey || e.ctrlKey || e.altKey || e.key === "Escape")) return;
    if (e.type === "pointerdown" && e.target.closest("a")) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (!loaded) return;
    window.removeEventListener("keydown", dismiss, { capture: true });
    ui.splash.removeEventListener("pointerdown", dismiss);
    ui.splash.classList.add("gone");
    resume();
    startMidi();
  };
  window.addEventListener("keydown", dismiss, { capture: true });
  ui.splash.addEventListener("pointerdown", dismiss);

  const note = browserNote(navigator);
  ui.browsers.textContent = note.text;
  ui.browsers.classList.toggle("safari", note.warn);

  await o.wasm.default();
  // Awaits the user's presets (IndexedDB) before mounting.
  page = await o.wasm.start(ui.canvas);
  window.page = page;
  // At zoom 1 the keyboard is the faceplate's width; the fit scales both.
  ui.keyboard.style.width = `${ui.canvas.offsetWidth}px`;
  const keyboard = mountKeyboard(ui.keyboard, {
    onMidi: ([status, d1, d2]) => page.midi(status, d1, d2),
    low: o.low,
    octaves: o.octaves,
    // While a menu or the matrix is open, keys are the editor's.
    keysTaken: () => page.editorWantsKeys(),
  });
  window.keyboard = keyboard;
  // The faceplate as large as fits above the keyboard, which matches its
  // width; on a phone, its own size (silkscreen-fit.mjs).
  const fit = fitFaceplate({ page, stage: ui.stage, canvas: ui.canvas, keyboard: ui.keyboard });
  window.fit = fit;

  const showLoad = (load) => {
    const r = loadReadout(load);
    ui.cpuText.textContent = r.text;
    ui.cpuFill.style.width = r.width;
    ui.cpuFill.style.background = r.colour;
  };

  // Everything loads behind the splash, the audio graph included, with
  // the AudioContext suspended. Browsers let it run only from a user
  // gesture, so the key press that dismisses the splash resumes it.
  if (page.sab) {
    try {
      audio = await startAudio({
        sab: page.sab,
        engineUrl: o.engine,
        workletUrl: "./silkscreen-worklet.js",
        source: "none",
        onLoad: showLoad,
        suspended: true,
      });
      window.audio = audio;
    } catch (e) {
      failed = String(e.message || e);
      console.error(e);
    }
  } else {
    failed = `Not cross-origin isolated, so no audio. Serve with cargo xtask web ${o.example} --serve.`;
  }
  ui.prompt.classList.remove("loading");
  ui.prompt.textContent = failed ? `${failed} Press any key to see the editor.` : "Press any key to start.";

  // Web MIDI, from the gesture that dismissed the splash, so the browser's
  // permission prompt has one to come from. Its notes light the on-screen
  // keys too.
  const startMidi = async () => {
    if (!audio) return;
    const midi = await attachMidi({
      onMidi: (m) => {
        page.midi(m[0], m[1], m[2]);
        keyboard.show(m);
      },
      onInputs: (names) => {
        ui.midi.textContent = names.length ? `MIDI: ${names.join(", ")}` : "MIDI: no inputs";
        ui.midi.title = names.join("\n") || "Plug in a MIDI controller";
      },
    });
    if (!midi.granted) {
      ui.midi.textContent = "MIDI: off";
      ui.midi.title = String(midi.error?.message ?? midi.error);
    }
  };
  if (failed) {
    ui.status.textContent = failed;
  } else {
    // Browsers can suspend the context again; any later press or key
    // restarts it.
    for (const type of ["pointerdown", "keydown"]) {
      window.addEventListener(type, () => audio.ctx.state !== "running" && resume(), { capture: true });
    }
  }
  loaded = true;
  return { page, audio, keyboard, fit };
}
