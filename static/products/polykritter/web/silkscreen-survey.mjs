// The talking survey (0363): after a while on a synth's web page, a
// portrait pops up over it with a text box under it, and asks a few
// questions, answered with the A, B and C keys (or a click). Its words are
// typed into the box while the portrait's two frames, mouth open and
// closed, alternate at random, as in a 16-bit RPG. Reaching an ending
// sends the answers to the survey's endpoint.
//
// The questions are a markdown file (see parseSurvey). The page passes
//
//   survey: { src: "survey/survey.md",
//             talk: { open: "survey/talk-open.png", closed: "survey/talk-closed.png" } }
//
// to mountSynthPage, which calls scheduleSurvey once the splash is gone.
// For now it's asked only when the page's URL has `?survey`, and then every
// time: `?survey` waits the usual two minutes, `?survey=5` five seconds.
// `&test` shows the answers on the page in place of sending them. Served
// from this machine (localhost), both are on without asking.
//
// The box's type is VT323 (fonts/, SIL Open Font License).
//
// The pure parts (the parser, a run through the screens, the flags) are
// exported for the node tests; the rest needs a DOM.

/** The `next` that closes the box without sending anything. */
export const CLOSE = "close";

const OPTION = /^[-*]\s+([A-Za-z])\)\s+(.*?)\s*->\s*(\S+)\s*$/;

/**
 * A survey from its markdown. Throws, naming the screen and the fix, on
 * anything it can't read.
 *
 * ```markdown
 * ---
 * id: polykritter-2026-11
 * endpoint: https://example.com/survey
 * send: off
 * ---
 *
 * ## intro
 *
 * Would you be willing to answer a few questions?
 *
 * - A) Sure! -> like
 * - B) Not now, thanks -> close
 *
 * ## like
 * ...
 * ```
 *
 * Front matter: `id` (required; sent with the answers), `endpoint`
 * (where the answers are POSTed) and `send` (`on` to POST them, `off`,
 * the default, to log them to the console instead). Each `## name` is a screen: its
 * paragraphs, then its options `- A) label -> next`, `next` naming
 * another screen or `close`. A screen without options is an ending. The
 * first screen is the start. HTML comments are ignored.
 *
 * @param {string} md
 * @param {string} [source]  the file's name, for errors
 * @returns {{ id: string, endpoint: string, send: boolean, start: string,
 *             screens: Record<string, { paragraphs: string[],
 *               options: { key: string, label: string, next: string }[] }> }}
 */
export function parseSurvey(md, source = "survey") {
  let text = md.replace(/\r\n?/g, "\n").replace(/<!--[\s\S]*?-->/g, "");
  const meta = {};
  const front = /^\s*---\n([\s\S]*?)\n---[ \t]*(\n|$)/.exec(text);
  if (front) {
    for (const line of front[1].split("\n")) {
      const m = /^\s*([\w-]+)\s*:\s*(.*?)\s*$/.exec(line);
      if (m) meta[m[1]] = m[2];
    }
    text = text.slice(front[0].length);
  }
  if (!meta.id) throw new Error(`${source}: the front matter needs an "id:" (---\\nid: my-survey\\n---)`);
  const sendFlag = meta.send || "off";
  if (sendFlag !== "on" && sendFlag !== "off") {
    throw new Error(`${source}: "send: ${sendFlag}" should be "send: on" or "send: off"`);
  }
  if (sendFlag === "on" && !meta.endpoint) {
    throw new Error(`${source}: "send: on" needs an "endpoint:" to send to`);
  }

  const screens = {};
  let start = null;
  let screen = null;
  let name = null;
  let para = [];
  const endPara = () => {
    if (para.length) screen.paragraphs.push(para.join(" "));
    para = [];
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const heading = /^##\s+(.+?)\s*$/.exec(line);
    if (heading) {
      if (screen) endPara();
      name = heading[1];
      if (name === CLOSE) throw new Error(`${source}: "## ${CLOSE}" is reserved (options use it to close the box); rename the screen`);
      if (screens[name]) throw new Error(`${source}: two screens are called "${name}"; rename one`);
      screen = screens[name] = { paragraphs: [], options: [] };
      start ??= name;
      continue;
    }
    if (!line) {
      if (screen) endPara();
      continue;
    }
    if (!screen) throw new Error(`${source}: "${line}" is before the first "## screen" heading; put it under one`);
    if (/^[-*]\s/.test(line)) {
      const m = OPTION.exec(line);
      if (!m) throw new Error(`${source}: screen "${name}": "${line}" should read "- A) label -> next"`);
      endPara();
      const key = m[1].toUpperCase();
      if (screen.options.some((o) => o.key === key)) {
        throw new Error(`${source}: screen "${name}" has two options ${key}; give each its own letter`);
      }
      screen.options.push({ key, label: m[2], next: m[3] });
      continue;
    }
    if (screen.options.length) {
      throw new Error(`${source}: screen "${name}": "${line}" is after its options; move it above them`);
    }
    para.push(line);
  }
  if (screen) endPara();
  if (!start) throw new Error(`${source}: no screens; start one with "## intro"`);

  for (const [n, s] of Object.entries(screens)) {
    if (!s.paragraphs.length) throw new Error(`${source}: screen "${n}" has nothing to say; give it a paragraph`);
    for (const o of s.options) {
      if (o.next !== CLOSE && !screens[o.next]) {
        throw new Error(`${source}: screen "${n}", option ${o.key} goes to "${o.next}", which isn't a screen; add "## ${o.next}" or point it at an existing one (or "${CLOSE}")`);
      }
    }
  }
  return { id: meta.id, endpoint: meta.endpoint ?? "", send: sendFlag === "on", start, screens };
}

/** One visitor's way through a survey. */
export class SurveyRun {
  constructor(survey) {
    this.survey = survey;
    this.at = survey.start;
    /** @type {{ screen: string, key: string, label: string }[]} */
    this.answers = [];
  }

  /** The screen shown, or null once closed. */
  get screen() {
    return this.at === CLOSE ? null : this.survey.screens[this.at];
  }

  /** At a screen without options. */
  get ended() {
    return this.screen?.options.length === 0;
  }

  /**
   * Answer the screen shown with `key` (a letter). Returns where it went
   * (a screen's name or `close`), or null if the screen has no such
   * option.
   */
  choose(key) {
    const option = this.screen?.options.find((o) => o.key === key.toUpperCase());
    if (!option) return null;
    this.answers.push({ screen: this.at, key: option.key, label: option.label });
    this.at = option.next;
    return this.at;
  }

  /** What an ending sends: the survey's id and the answers, nothing else. */
  payload() {
    return { survey: this.survey.id, answers: this.answers };
  }
}

/** A page served from this machine. */
export const isLocal = (hostname) => ["localhost", "127.0.0.1", "[::1]", "::1", ""].includes(hostname);

/**
 * The survey's URL flags: whether to ask at all (`survey`), after how
 * long (`?survey=N` seconds, else `afterMs`), and whether to show the
 * answers rather than send them (`test`). On localhost, `survey` and
 * `test` are taken as given.
 *
 * @param {string} search  `location.search`
 * @param {number} afterMs
 * @param {string} [hostname]  `location.hostname`
 * @returns {{ ask: boolean, waitMs: number, test: boolean }}
 */
export function surveyFlags(search, afterMs, hostname = "vulpuslabs.com") {
  const q = new URLSearchParams(search);
  const local = isLocal(hostname);
  const seconds = Number(q.get("survey"));
  return {
    ask: local || q.has("survey"),
    waitMs: q.get("survey") && Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : afterMs,
    test: local || q.has("test"),
  };
}

/** How long to wait after typing `ch` (ms): longer after punctuation. */
export function charDelay(ch) {
  if (".!?…".includes(ch)) return 200;
  if (",;:".includes(ch)) return 90;
  return 28;
}

const FONT = new URL("./fonts/VT323-Regular.ttf", import.meta.url).href;

const STYLE = `
@font-face { font-family: "ss-survey-vt323"; src: url("${FONT}") format("truetype"); font-display: block; }
#ss-survey { position: fixed; inset: 0; z-index: 20; display: grid; place-items: center;
             background: rgb(8 6 20 / 0.6); animation: ss-survey-in 320ms steps(6) both; }
#ss-survey.out { animation: ss-survey-out 480ms steps(8) forwards; pointer-events: none; }
@keyframes ss-survey-in { from { opacity: 0; filter: brightness(0); } to { opacity: 1; filter: brightness(1); } }
@keyframes ss-survey-out { from { opacity: 1; filter: brightness(1); } to { opacity: 0; filter: brightness(0); } }
#ss-survey .card { width: min(360px, 94vw); padding: 2px; display: grid; gap: 2px;
                   background: #918ec6; border: 2px solid #e6e5f4; outline: 2px solid #0e0835;
                   box-shadow: 0 8px 32px rgb(0 0 0 / 0.7); }
#ss-survey .portrait { position: relative; border: 2px solid #0b0c18; aspect-ratio: 696 / 357; background: #0b0c18; }
#ss-survey .portrait img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
#ss-survey .portrait img.open { visibility: hidden; }
#ss-survey .portrait.talking img.open { visibility: visible; }
#ss-survey .box { position: relative; background: #000; border: 2px solid #e6e5f4;
                  box-shadow: inset 0 0 0 2px #5b52a8; padding: 0.9em 1.2em 1em 2.4em;
                  min-height: 8.6em; color: #fafaff; cursor: default;
                  font: 400 14px / 1.2 "ss-survey-vt323", ui-monospace, Menlo, monospace;
                  letter-spacing: 0.02em; text-shadow: 1px 1px 0 #2a2350; }
#ss-survey .box::before { content: "▶"; position: absolute; left: 0.8em; top: 0.9em; color: #f5c518; }
#ss-survey p { margin: 0 0 0.35em; }
#ss-survey .unsaid { visibility: hidden; }
#ss-survey ol { list-style: none; margin: 0.6em 0 0; padding: 0; }
#ss-survey li { padding: 0.05em 0.4em; margin-left: -0.4em; cursor: pointer; }
#ss-survey li:hover { background: #241e52; }
#ss-survey li b { color: #f5c518; }
#ss-survey li.picked { animation: ss-survey-blink 300ms steps(2) 2; background: #3b3280; }
@keyframes ss-survey-blink { 50% { visibility: hidden; } }
#ss-survey-results { position: fixed; top: 12px; right: 12px; z-index: 21; max-width: min(420px, 90vw);
                     background: #000; color: #fafaff; border: 4px solid #e6e5f4; outline: 4px solid #0e0835;
                     padding: 0.8em 1em; font: 12px/1.4 ui-monospace, Menlo, monospace; }
#ss-survey-results h2 { margin: 0 1.5em 0.5em 0; font-size: 13px; color: #f5c518; }
#ss-survey-results pre { margin: 0; white-space: pre-wrap; }
#ss-survey-results button { position: absolute; top: 4px; right: 6px; background: none; border: 0;
                            color: #f5c518; font: inherit; font-size: 16px; cursor: pointer; }
#ss-survey .more { position: absolute; right: 0.8em; bottom: 0.4em; color: #f5c518;
                   animation: ss-survey-blink 900ms steps(2) infinite; }
`;

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else e.setAttribute(k, v);
  }
  e.append(...children);
  return e;
}

function ensureStyle() {
  if (document.getElementById("ss-survey-style")) return;
  const style = el("style", { id: "ss-survey-style" });
  style.textContent = STYLE;
  document.head.append(style);
}

/** The answers in a panel on the page (`&test`), for checking a script. */
export function showResults(body) {
  ensureStyle();
  document.getElementById("ss-survey-results")?.remove();
  const shut = el("button", { "aria-label": "Close" }, "×");
  const panel = el(
    "div",
    { id: "ss-survey-results", role: "status" },
    shut,
    el("h2", {}, "Survey answers (test: not sent)"),
    el("pre", {}, JSON.stringify(body, null, 2)),
  );
  shut.addEventListener("click", () => panel.remove());
  document.body.append(panel);
}

/** POST the answers to the survey's endpoint, or log them if sending is off. */
export async function send(survey, body) {
  const { endpoint } = survey;
  if (!survey.send) {
    console.info(`survey: sending is off; would POST to ${endpoint || "(no endpoint)"}:`, body);
    return;
  }
  try {
    const r = await fetch(endpoint, {
      method: "POST",
      // JSON in a text/plain body: a simple CORS request, with no
      // preflight for the endpoint to answer (codepoetics-host surveys.md).
      headers: { "content-type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(body),
      keepalive: true,
    });
    if (!r.ok) console.warn(`survey: ${endpoint} answered ${r.status}`);
  } catch (e) {
    console.warn("survey: sending failed", e);
  }
}

/**
 * Show `survey` now, over everything. Keys are the box's while it's
 * open (shortcuts with Cmd, Ctrl or Alt pass); Escape closes it.
 *
 * @param {object} o
 * @param {ReturnType<typeof parseSurvey>} o.survey
 * @param {{ open: string, closed: string }} o.talk  the portrait's frames
 * @param {{ releaseAll?: Function }} [o.keyboard]  its held notes are let go
 * @param {(body: object) => void} [o.deliver]  takes the answers at an
 *        ending (default: send)
 */
export function showSurvey({ survey, talk, keyboard, deliver = (body) => send(survey, body) }) {
  ensureStyle();
  keyboard?.releaseAll?.();

  const portrait = el(
    "div",
    { class: "portrait" },
    el("img", { src: talk.closed, alt: "Dominic Fox, in his lab" }),
    el("img", { src: talk.open, alt: "", class: "open" }),
  );
  const box = el("div", { class: "box", "aria-live": "polite" });
  const root = el("div", { id: "ss-survey", role: "dialog", "aria-label": "A few questions" }, el("div", { class: "card" }, portrait, box));
  document.body.append(root);

  const run = new SurveyRun(survey);
  let typing = null; // { skip() } while the words are going in
  let busy = false; // between a pick and the next screen
  let closed = false;

  const close = () => {
    if (closed) return;
    closed = true;
    clearTimeout(typing?.timer);
    window.removeEventListener("keydown", onKey, { capture: true });
    root.classList.add("out");
    const gone = () => root.remove();
    root.addEventListener("animationend", gone, { once: true });
    setTimeout(gone, 700);
  };

  // The screen's words, laid out in full but unseen, then shown a
  // character at a time, so no word jumps to the next line half-typed.
  const say = (screen) => {
    const parts = screen.paragraphs.map((text) => {
      const said = document.createTextNode("");
      const unsaid = el("span", { class: "unsaid" }, text);
      box.append(el("p", {}, said, unsaid));
      return { text, said, unsaid };
    });
    let p = 0;
    let i = 0;
    let nextFlap = 0;
    const t = (typing = { timer: 0 });
    const done = () => {
      for (const part of parts) {
        part.said.data = part.text;
        part.unsaid.textContent = "";
      }
      portrait.classList.remove("talking");
      typing = null;
      offer(screen);
    };
    t.skip = () => {
      clearTimeout(t.timer);
      done();
    };
    const step = () => {
      const part = parts[p];
      const ch = part.text[i++];
      part.said.data = part.text.slice(0, i);
      part.unsaid.textContent = part.text.slice(i);
      // The mouth: open or shut at random while letters go in, shut
      // through the pauses.
      const now = performance.now();
      if (!/[\p{L}\p{N}]/u.test(ch)) portrait.classList.remove("talking");
      else if (now >= nextFlap) {
        portrait.classList.toggle("talking", Math.random() < 0.6);
        nextFlap = now + 60 + Math.random() * 90;
      }
      let wait = charDelay(ch);
      if (i >= part.text.length) {
        p += 1;
        i = 0;
        wait = Math.max(wait, 320);
        if (p >= parts.length) return done();
      }
      t.timer = setTimeout(step, wait);
    };
    step();
  };

  const offer = (screen) => {
    if (!screen.options.length) {
      box.append(el("span", { class: "more", "aria-hidden": "true" }, "▼"));
      return;
    }
    const list = el("ol");
    for (const o of screen.options) {
      const li = el("li", {}, el("b", {}, `${o.key})`), ` ${o.label}`);
      li.dataset.key = o.key;
      list.append(li);
    }
    box.append(list);
  };

  const show = () => {
    box.replaceChildren();
    say(run.screen);
    if (run.ended) deliver(run.payload());
  };

  const pick = (key) => {
    const li = box.querySelector(`li[data-key="${key}"]`);
    if (!li || busy) return;
    busy = true;
    li.classList.add("picked");
    setTimeout(() => {
      busy = false;
      const next = run.choose(key);
      if (next === CLOSE) close();
      else show();
    }, 600);
  };

  // A press while typing finishes the words; at an ending, closes.
  const press = (key) => {
    if (closed) return;
    if (typing) return typing.skip();
    if (run.ended) return close();
    if (key) pick(key);
  };

  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (e.repeat) return;
    if (e.key === "Escape") return close();
    press(/^Key([A-Z])$/.exec(e.code)?.[1] ?? e.key?.toUpperCase());
  }
  window.addEventListener("keydown", onKey, { capture: true });
  root.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.target.closest(".card")) return;
    press(e.target.closest("li")?.dataset.key);
  });

  show();
  return { run, close };
}

/**
 * Load the survey at `src` and show it once the page has been visible for
 * the wait `surveyFlags` gives, if the URL asks for it.
 *
 * @param {object} o
 * @param {string} o.src  the survey's markdown
 * @param {{ open: string, closed: string }} o.talk
 * @param {number} [o.afterMs]  default two minutes
 * @param {object} [o.keyboard]
 * @param {string} [o.search]  default `location.search`
 * @param {string} [o.hostname]  default `location.hostname`
 */
export async function scheduleSurvey({
  src,
  talk,
  afterMs = 120_000,
  keyboard,
  search = location.search,
  hostname = location.hostname,
}) {
  const flags = surveyFlags(search, afterMs, hostname);
  if (!flags.ask) return;
  let survey;
  try {
    const r = await fetch(src);
    if (!r.ok) throw new Error(`${src}: ${r.status}`);
    survey = parseSurvey(await r.text(), src);
  } catch (e) {
    console.error("survey:", e);
    return;
  }
  for (const url of [talk.open, talk.closed]) new Image().src = url;
  ensureStyle();
  document.fonts?.load('20px "ss-survey-vt323"').catch(() => {});
  const deliver = flags.test ? showResults : (body) => send(survey, body);

  const tick = 250;
  let seen = 0;
  const timer = setInterval(() => {
    if (document.visibilityState === "visible") seen += tick;
    if (seen < flags.waitMs) return;
    clearInterval(timer);
    showSurvey({ survey, talk, keyboard, deliver });
  }, tick);
}
