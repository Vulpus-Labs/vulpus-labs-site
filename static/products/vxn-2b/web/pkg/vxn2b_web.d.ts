/* tslint:disable */
/* eslint-disable */

/**
 * The running page: the editor, the buffer to hand the worklet,
 * and the MIDI ring's writer for the keyboard, over a
 * [`PresetPage`](silkscreen_host_web::PresetPage).
 */
export class Vxn2bPage {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Whether the editor wants the keys: a panel (a menu, the
     * matrix) is open. The page's computer-keyboard notes stand
     * aside while it does.
     */
    editorWantsKeys(): boolean;
    /**
     * Param `index`'s plain value.
     */
    getParam(index: number): number;
    /**
     * Send one MIDI 1.0 channel message to the engine. Returns
     * `false` if there's no engine link or the ring is full.
     */
    midi(status: number, data1: number, data2: number): boolean;
    /**
     * Every user preset's key (`name` or `folder/name`).
     */
    presetKeys(): string[];
    /**
     * The current preset's name, if any.
     */
    presetName(): string | undefined;
    /**
     * Why presets can't be kept, if they can't.
     */
    presetProblem(): string | undefined;
    /**
     * Whether preset changes are still waiting to be written.
     */
    presetsPending(): boolean;
    /**
     * Rects put on the canvas since mount, for diagnostics.
     */
    puts(): number;
    /**
     * Save the current sound as user preset `name` at the root,
     * for the console and checks.
     */
    savePreset(name: string): void;
    /**
     * Set param `index` to plain `value` as the user would, for
     * the console and checks.
     */
    setParam(index: number, value: number): void;
    /**
     * Show the faceplate at `zoom` CSS pixels per logical pixel,
     * sharp at any zoom; `silkscreen-fit.mjs` fits it to the page
     * with this.
     */
    setZoom(zoom: number): void;
    /**
     * Share the current sound (as the browser's Share does) and
     * return the link.
     */
    shareLink(): string | undefined;
    /**
     * The shared buffer for `startAudio`, or `undefined` if the
     * page isn't cross-origin isolated.
     */
    readonly sab: SharedArrayBuffer | undefined;
}

/**
 * A running editor on a canvas. The loop and input stop on
 * [`stop`](Self::stop) or when this is dropped.
 */
export class WebHost {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Views made of the frame since mount: one per resize or growth of
     * wasm memory.
     */
    binds(): number;
    /**
     * Panels open in the editor (menus, overlays). While one is, keys
     * are the editor's, so a page's own key bindings should stand aside.
     */
    panels(): number;
    /**
     * Rects put on the canvas since mount. Idle frames add none.
     */
    puts(): number;
    /**
     * Show the faceplate at `zoom` CSS pixels per logical pixel, from the
     * next frame. The editor renders at `devicePixelRatio × zoom`, so a
     * zoomed faceplate stays sharp; input maps through the canvas's box at
     * any zoom. Clamped to 0.25–4.
     */
    setZoom(zoom: number): void;
    /**
     * Stop the loop and remove the input listeners. The canvas keeps its
     * last frame.
     */
    stop(): void;
    /**
     * The zoom last asked for.
     */
    zoom(): number;
}

/**
 * Open the user's presets, then mount the editor on `canvas` and
 * start drawing.
 */
export function start(canvas: HTMLCanvasElement): Promise<Vxn2bPage>;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_vxn2bpage_free: (a: number, b: number) => void;
    readonly __wbg_webhost_free: (a: number, b: number) => void;
    readonly start: (a: any) => any;
    readonly vxn2bpage_editorWantsKeys: (a: number) => number;
    readonly vxn2bpage_getParam: (a: number, b: number) => number;
    readonly vxn2bpage_midi: (a: number, b: number, c: number, d: number) => number;
    readonly vxn2bpage_presetKeys: (a: number) => [number, number];
    readonly vxn2bpage_presetName: (a: number) => [number, number];
    readonly vxn2bpage_presetProblem: (a: number) => [number, number];
    readonly vxn2bpage_presetsPending: (a: number) => number;
    readonly vxn2bpage_puts: (a: number) => number;
    readonly vxn2bpage_sab: (a: number) => any;
    readonly vxn2bpage_savePreset: (a: number, b: number, c: number) => [number, number];
    readonly vxn2bpage_setParam: (a: number, b: number, c: number) => void;
    readonly vxn2bpage_setZoom: (a: number, b: number) => void;
    readonly vxn2bpage_shareLink: (a: number) => [number, number];
    readonly webhost_binds: (a: number) => number;
    readonly webhost_panels: (a: number) => number;
    readonly webhost_puts: (a: number) => number;
    readonly webhost_setZoom: (a: number, b: number) => void;
    readonly webhost_stop: (a: number) => void;
    readonly webhost_zoom: (a: number) => number;
    readonly wasm_bindgen__convert__closures_____invoke__h5e49811666bb5fac: (a: number, b: number, c: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1707fddd86a6f68e: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h3ae15ede0744e005: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen__convert__closures_____invoke__h5b4249efc1962cfd: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h34eeeeb7456ccd61: (a: number, b: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
