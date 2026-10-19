// The engine's share of the audio thread: time spent rendering over the
// time the quanta stand for, reported over a window of quanta.
//
// An AudioWorklet may have no fine clock (Chrome's has Date.now() alone,
// in whole milliseconds). A quantum renders in a fraction of one, but
// quanta start at phases unrelated to the clock's ticks, so the sum of
// whole-millisecond differences over a window averages to the true sum.
// Nothing here allocates.

export class LoadMeter {
  /**
   * @param {number} quantumMs  the audio time one quantum stands for
   * @param {number} window     quanta per report
   * @param {() => number} now  a clock in milliseconds
   */
  constructor(quantumMs, window, now) {
    this.quantumMs = quantumMs;
    this.window = window;
    this.now = now;
    this.busy = 0;
    this.count = 0;
  }

  /** Before rendering: the clock's reading, to hand to `end`. */
  begin() {
    return this.now();
  }

  /**
   * After rendering. Returns the window's load (0 = idle, 1 = all of the
   * budget) when a window completes, or -1.
   */
  end(start) {
    this.busy += this.now() - start;
    if (++this.count < this.window) return -1;
    const load = this.busy / (this.count * this.quantumMs);
    this.busy = 0;
    this.count = 0;
    return load;
  }
}

/** The finest clock in scope. */
export function clock() {
  return typeof performance !== "undefined" && performance.now
    ? () => performance.now()
    : () => Date.now();
}
