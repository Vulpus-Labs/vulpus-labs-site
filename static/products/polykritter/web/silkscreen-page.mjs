// The standard web presentation of a silkscreen synth.
//
// One call builds the whole page: the faceplate's scroller over the pinned
// keyboard bar, the splash with its browser note and the gesture
// that starts the sound, the CPU meter and MIDI readout, and the fit
//. A synth's index.html is its meta tags and
//
//   import * as wasm from "./pkg/tone_web.js";
//   import { mountSynthPage } from "./silkscreen-page.mjs";
//   mountSynthPage({ wasm, name: "Tone", blurb: "a one-oscillator synth",
//                    engine: "./tone_web_engine.wasm", example: "tone" });
//
// The pure parts (the options' defaults, the browser note) are exported for
// the node tests; the rest needs a DOM.

import { startAudio } from "./silkscreen-audio.mjs";
import { mountKeyboard } from "./silkscreen-keyboard.mjs";
import { fitFaceplate } from "./silkscreen-fit.mjs";
import { attachMidi } from "./silkscreen-midi.mjs";
import { scheduleSurvey } from "./silkscreen-survey.mjs";

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
 * @param {string} [o.example]  its web package, for the
 *        not-isolated message (default: `name`)
 * @param {{ name: string, url?: string }} [o.vendor]  who made it: the
 *        splash says "by NAME", linked to `url` if given
 * @param {string} [o.homepage] the synth's own page, linked from the
 *        splash as "For more details, see …"
 * @param {string} [o.accent]   the splash link's colour
 * @param {{ src: string, alt: string, width?: number }} [o.logo]  shown
 *        on the splash in place of the name
 * @param {number} [o.low]      the keyboard's lowest key (default 36, C2)
 * @param {number} [o.octaves]  the keyboard's octaves (default 5)
 * @param {number} [o.keysHigh] the keyboard's height at zoom 1, CSS px
 *        (default 120)
 * @param {{ src: string, talk: { open: string, closed: string },
 *           afterMs?: number }} [o.survey]  the talking survey
 *        (silkscreen-survey.mjs), asked once the page has been in use
 *        for `afterMs` (default two minutes)
 * @param {boolean | { initial?: number, min?: number, max?: number }} [o.tempo]
 *        a BPM field beside the CPU meter, sent as the engine transport's
 *        tempo and remembered between visits (default 120, 40 to 240)
 * @param {{ text: string, href: string }[]} [o.links]  links in a bar
 *        in the top right, each opening in a new tab
 * @param {{ action: string, label?: string, text?: string,
 *           fields?: Record<string, string> }} [o.signup]  a button in
 *        that bar that opens a mailing-list form: one email field,
 *        posted to `action` in a new tab with `fields` as hidden inputs
 */
export function pageOptions(o) {
  for (const k of ["wasm", "name", "blurb", "engine"]) {
    if (o?.[k] == null) throw new Error(`mountSynthPage: the "${k}" option is required`);
  }
  if (o.signup && !o.signup.action) throw new Error('mountSynthPage: the "signup" option needs an "action"');
  const merged = {
    example: o.name,
    vendor: null,
    homepage: null,
    accent: "#1f9cff",
    logo: null,
    low: 36,
    octaves: 5,
    keysHigh: 120,
    links: [],
    ...Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)),
  };
  merged.tempo = o.tempo ? { initial: 120, min: 40, max: 240, ...(o.tempo === true ? {} : o.tempo) } : null;
  merged.signup = o.signup
    ? { label: "Get release news", text: "Leave your email to hear when it is released.", fields: {}, ...o.signup }
    : null;
  return merged;
}

/**
 * A tempo typed into the field, as whole BPM within `min`..`max`; `fallback`
 * when it isn't a number.
 */
export function tempoValue(input, { min, max }, fallback) {
  const n = Math.round(Number(input));
  if (!Number.isFinite(n) || String(input).trim() === "") return fallback;
  return Math.min(max, Math.max(min, n));
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
#tempo { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8c8c92; }
#tempo input { width: 3em; padding: 2px 4px; background: #151417; color: #f0f0f2; border: 1px solid #3a3a40;
               border-radius: 3px; font: inherit; font-variant-numeric: tabular-nums; }

/* Links and the mailing-list form, top right. */
/* With the bar, the faceplate starts below it rather than under it. */
body.ss-bar #face { padding-top: 48px; }
#links { position: fixed; top: 12px; right: 12px; z-index: 5; display: flex; flex-wrap: wrap; justify-content: flex-end;
         align-items: center; gap: 6px 14px; max-width: calc(100vw - 140px); font-size: 12px; }
#links a { color: #c8c8cc; text-decoration: none; }
#links a:hover { color: #f0f0f2; text-decoration: underline; }
#links button { padding: 4px 10px; font: inherit; color: #f0f0f2; background: color-mix(in srgb, var(--accent) 35%, #202024);
                border: 1px solid color-mix(in srgb, var(--accent) 60%, transparent); border-radius: 4px; cursor: pointer; }
#signup { position: fixed; top: 44px; right: 12px; z-index: 5; width: min(300px, calc(100vw - 24px)); display: grid; gap: 8px;
          padding: 14px; background: #151417; border: 1px solid #3a3438; border-radius: 8px;
          box-shadow: 0 8px 28px rgb(0 0 0 / 0.5); font-size: 13px; }
#signup[hidden] { display: none; }
#signup p { margin: 0; line-height: 1.4; }
#signup .row { display: flex; gap: 6px; }
#signup input[type="email"] { flex: 1; min-width: 0; padding: 6px 8px; background: #202024; color: #f0f0f2;
                              border: 1px solid #3a3a40; border-radius: 4px; font: inherit; }
#signup .done { color: #8c8c92; }
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

  const link = (href, text) => {
    const a = el("a", { href, target: "_blank", rel: "noopener" });
    a.textContent = text;
    return a;
  };
  const about = el("p", {}, "This is the web demo of ", el("strong", {}, o.name), `, ${o.blurb}`);
  if (o.vendor) {
    about.append(" by ", o.vendor.url ? link(o.vendor.url, o.vendor.name) : o.vendor.name);
  }
  about.append(".");
  if (o.homepage) {
    about.append(" For more details, see ", link(o.homepage, o.homepage.replace(/^https?:\/\//, "")), ".");
  }
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
  const tempo = o.tempo
    ? el("input", { type: "number", min: o.tempo.min, max: o.tempo.max, step: 1, inputmode: "numeric", "aria-label": "Tempo, BPM" })
    : null;
  const audio = el(
    "div",
    { id: "audio" },
    el("div", { id: "cpu", title: "The engine's share of the audio thread" }, cpuText, el("div", { id: "cpu-bar" }, cpuFill)),
    ...(tempo ? [el("label", { id: "tempo", title: "The tempo synced arpeggiators, LFOs and delays follow" }, "BPM", tempo)] : []),
    midi,
    status,
  );

  const extras = [];
  let signup = null;
  if (o.links.length || o.signup) {
    const bar = el("nav", { id: "links", "aria-label": `About ${o.name}` }, ...o.links.map((l) => link(l.href, l.text)));
    extras.push(bar);
    document.body.classList.add("ss-bar");
    if (o.signup) {
      signup = buildSignup(o.signup);
      bar.append(signup.button);
      extras.push(signup.form);
    }
  }

  const canvas = el("canvas", { id: "faceplate" });
  const stage = el("div", { id: "stage" }, el("div", { id: "face" }, canvas));
  const keyboard = el("div", { id: "keyboard" });
  keyboard.style.height = `${o.keysHigh}px`;
  const keys = el("div", { id: "keys" }, keyboard);

  body.replaceChildren(splash, audio, ...extras, stage, keys);
  return { splash, browsers, prompt, cpuText, cpuFill, midi, status, tempo, canvas, stage, keyboard };
}

/**
 * The mailing-list button and the form it opens. The form posts in a new
 * tab, so the player keeps playing. The keyboard ignores keys typed into
 * a field, so typing an address plays no notes; Escape closes the form.
 */
function buildSignup(s) {
  const button = el("button", { type: "button", "aria-expanded": "false", "aria-controls": "signup" }, s.label);
  const email = el("input", { type: "email", name: "email", required: "", autocomplete: "email",
                              placeholder: "you@example.com", "aria-label": "Email address" });
  const done = el("p", { class: "done", hidden: "" }, "Thanks. Check your inbox to confirm.");
  const form = el(
    "form",
    { id: "signup", action: s.action, method: "post", target: "_blank", hidden: "" },
    el("p", {}, s.text),
    el("div", { class: "row" }, email, el("button", { type: "submit" }, "Subscribe")),
    ...Object.entries(s.fields).map(([name, value]) => el("input", { type: "hidden", name, value })),
    done,
  );
  const show = (open) => {
    form.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    if (open) email.focus();
    else if (document.activeElement && form.contains(document.activeElement)) document.activeElement.blur();
  };
  button.addEventListener("click", () => show(form.hidden));
  form.addEventListener("keydown", (e) => {
    if (e.key === "Escape") show(false);
  });
  // The post happens in its new tab; this tab just says so.
  form.addEventListener("submit", () => setTimeout(() => {
    done.hidden = false;
    email.value = "";
    email.blur();
  }));
  return { button, form };
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
    if (o.survey) scheduleSurvey({ ...o.survey, keyboard });
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
  // The bar of links, if any, adds to the stage's top padding (STYLE).
  const padY = document.body.classList.contains("ss-bar") ? 48 : 16;
  const fit = fitFaceplate({ page, stage: ui.stage, canvas: ui.canvas, keyboard: ui.keyboard, padY });
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
    failed = `Not cross-origin isolated, so no audio. Serve with cargo silkscreen web ${o.example} --serve.`;
  }
  if (ui.tempo) {
    // Remembered per synth; an engine without tempo-synced features
    // simply ignores it.
    const key = `silkscreen-tempo:${o.example}`;
    let saved = null;
    try {
      saved = localStorage.getItem(key);
    } catch {
      // Storage refused (a private window): the field still works.
    }
    let bpm = tempoValue(saved ?? o.tempo.initial, o.tempo, o.tempo.initial);
    ui.tempo.value = bpm;
    audio?.setTempo(bpm);
    ui.tempo.addEventListener("change", () => {
      bpm = tempoValue(ui.tempo.value, o.tempo, bpm);
      ui.tempo.value = bpm;
      audio?.setTempo(bpm);
      try {
        localStorage.setItem(key, String(bpm));
      } catch {
        // As above.
      }
    });
    // A click selects the value, so typing replaces it.
    ui.tempo.addEventListener("focus", () => ui.tempo.select());
    // Enter sets it and hands the keys back to the keyboard.
    ui.tempo.addEventListener("keydown", (e) => e.key === "Enter" && ui.tempo.blur());
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
