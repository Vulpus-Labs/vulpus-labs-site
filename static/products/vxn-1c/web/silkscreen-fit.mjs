// Fit a silkscreen faceplate to the page's space (0325).
//
// The page gives the faceplate a scroller (`stage`) above the keyboard bar.
// This keeps the faceplate as large as fits in it, between `min` and
// `max` of its own size, by the host's zoom (`page.setZoom`): the editor
// renders at devicePixelRatio × zoom, so it stays sharp. Below `min` it
// stops shrinking and the stage scrolls.
//
// Not on a phone: with a coarse pointer the faceplate keeps its own size,
// and the page pans and pinches as before, since shrinking a faceplate to
// a phone's width leaves its controls too small to touch.
//
// The keyboard takes the faceplate's width, so the two line up.

/// The zoom that fits a `natural` {w, h} faceplate into `avail` {w, h},
/// clamped to `min`..`max`; 1 when `coarse` (a touch screen).
export function fitZoom(avail, natural, { min = 0.6, max = 2, coarse = false } = {}) {
  if (coarse || !(natural.w > 0 && natural.h > 0)) return 1;
  const fit = Math.min(avail.w / natural.w, avail.h / natural.h);
  if (!Number.isFinite(fit)) return 1;
  // Quantised, so a window dragged by a pixel doesn't re-render the
  // faceplate for a change no one can see.
  const q = Math.floor(fit * 64) / 64;
  return Math.min(max, Math.max(min, q));
}

/**
 * Keep `canvas` fitted to `stage`.
 *
 * @param {object} o
 * @param {{ setZoom(z: number): void }} o.page  the mounted page
 * @param {HTMLElement} o.stage     the faceplate's scroller
 * @param {HTMLCanvasElement} o.canvas  the faceplate, mounted at zoom 1
 * @param {HTMLElement} [o.keyboard]  takes the faceplate's width
 * @param {number} [o.min]  smallest zoom (default 0.6)
 * @param {number} [o.max]  largest zoom (default 2)
 * @param {number} [o.padX]  stage padding left + right, CSS px (default 32)
 * @param {number} [o.padY]  stage padding top + bottom, CSS px (default 16)
 * @returns {{ zoom(): number, destroy(): void }}
 */
export function fitFaceplate({ page, stage, canvas, keyboard, min = 0.6, max = 2, padX = 32, padY = 16 }) {
  // The canvas's CSS size at zoom 1 is the faceplate's logical size.
  const natural = { w: canvas.offsetWidth, h: canvas.offsetHeight };
  const coarse = matchMedia("(pointer: coarse)");
  let zoom = 1;
  const apply = () => {
    // The border box, not the client box: a scrollbar the zoom brings or
    // takes away mustn't feed back into the zoom.
    const r = stage.getBoundingClientRect();
    const next = fitZoom({ w: r.width - padX, h: r.height - padY }, natural, { min, max, coarse: coarse.matches });
    if (next !== zoom) {
      zoom = next;
      page.setZoom(zoom);
    }
    if (keyboard) keyboard.style.width = `${Math.round(natural.w * zoom)}px`;
  };
  const observer = new ResizeObserver(apply);
  observer.observe(stage);
  coarse.addEventListener("change", apply);
  apply();
  return {
    zoom: () => zoom,
    destroy() {
      observer.disconnect();
      coarse.removeEventListener("change", apply);
    },
  };
}
