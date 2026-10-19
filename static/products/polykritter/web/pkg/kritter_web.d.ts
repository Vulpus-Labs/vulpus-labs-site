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
     * Send one MIDI 1.0 channel message to the engine. Returns `false` if
     * there's no engine link or the ring is full.
     */
    midi(status: number, data1: number, data2: number): boolean;
    /**
     * Rects put on the canvas since mount, for diagnostics.
     */
    puts(): number;
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
 * Mount the kritter editor on `canvas` and start drawing.
 */
export function start(canvas: HTMLCanvasElement): KritterPage;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_kritterpage_free: (a: number, b: number) => void;
    readonly __wbg_webhost_free: (a: number, b: number) => void;
    readonly kritterpage_editorWantsKeys: (a: number) => number;
    readonly kritterpage_midi: (a: number, b: number, c: number, d: number) => number;
    readonly kritterpage_puts: (a: number) => number;
    readonly kritterpage_sab: (a: number) => any;
    readonly start: (a: any) => [number, number, number];
    readonly webhost_binds: (a: number) => number;
    readonly webhost_panels: (a: number) => number;
    readonly webhost_puts: (a: number) => number;
    readonly webhost_stop: (a: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hba8bcbf3f813da15: (a: number, b: number, c: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h945b9629a7aa37dc: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen__convert__closures_____invoke__haa758b7c3f6e0154: (a: number, b: number, c: any) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
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
