/* tslint:disable */
/* eslint-disable */

/**
 * The running page: the editor, the buffer to hand the worklet, and the
 * MIDI ring's writer for the keyboard.
 */
export class KritterPage {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Whether the editor wants the keys: a panel (a menu, the matrix) is
     * open. The page's computer-keyboard notes stand aside while it does.
     */
    editorWantsKeys(): boolean;
    /**
     * Param `index`'s plain value.
     */
    getParam(index: number): number;
    /**
     * Send one MIDI 1.0 channel message to the engine. Returns `false` if
     * there's no engine link or the ring is full.
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
     * Save the current sound as user preset `name` at the root, for the
     * console and checks (the faceplate's bar is 0141's).
     */
    savePreset(name: string): void;
    /**
     * Set param `index` to plain `value` as the user would, for the
     * console and checks.
     */
    setParam(index: number, value: number): void;
    /**
     * Share the current sound (as the browser's Share does) and return
     * the link.
     */
    shareLink(): string | undefined;
    /**
     * The shared buffer for `startAudio`, or `undefined` if the page isn't
     * cross-origin isolated.
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
     * Stop the loop and remove the input listeners. The canvas keeps its
     * last frame.
     */
    stop(): void;
}

/**
 * Open the user's presets, then mount the kritter editor on `canvas` and
 * start drawing.
 */
export function start(canvas: HTMLCanvasElement): Promise<KritterPage>;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_kritterpage_free: (a: number, b: number) => void;
    readonly __wbg_webhost_free: (a: number, b: number) => void;
    readonly kritterpage_editorWantsKeys: (a: number) => number;
    readonly kritterpage_getParam: (a: number, b: number) => number;
    readonly kritterpage_midi: (a: number, b: number, c: number, d: number) => number;
    readonly kritterpage_presetKeys: (a: number) => [number, number];
    readonly kritterpage_presetName: (a: number) => [number, number];
    readonly kritterpage_presetProblem: (a: number) => [number, number];
    readonly kritterpage_presetsPending: (a: number) => number;
    readonly kritterpage_puts: (a: number) => number;
    readonly kritterpage_sab: (a: number) => any;
    readonly kritterpage_savePreset: (a: number, b: number, c: number) => [number, number];
    readonly kritterpage_setParam: (a: number, b: number, c: number) => void;
    readonly kritterpage_shareLink: (a: number) => [number, number];
    readonly start: (a: any) => any;
    readonly webhost_binds: (a: number) => number;
    readonly webhost_panels: (a: number) => number;
    readonly webhost_puts: (a: number) => number;
    readonly webhost_stop: (a: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hc7c07d0c256e8439: (a: number, b: number, c: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h20de225a3517def9: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h945b9629a7aa37dc: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen__convert__closures_____invoke__h2c3d51778d15fc98: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1f60fbc9ca9f93d5: (a: number, b: number) => void;
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
