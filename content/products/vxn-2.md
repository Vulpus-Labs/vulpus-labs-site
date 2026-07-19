+++
title = "VXN2"
date = 2026-06-07
type = "products"
weight = 40
tagline = "6-operator FM synth with voice stacking — CLAP plugin"
status = "in beta"
license = "MIT"
+++

**VXN2** ("vixen 2") is a 6-operator FM synthesizer in the DX7 / Montage
lineage, built in Rust as a [CLAP](https://cleveraudio.org/) plugin. It is a
sibling to [VXN1](/products/vxn-1/) — they share the CLAP shell, preset
conventions and HTML-faceplate UI, but VXN2 has its own DSP kernel, parameter
table and patch format. Its headline addition to the classic FM formula is
first-class **voice stacking**: supersaw-style unison without any wavetable
storage.

The DSP kernel, CLAP shell and faceplate are all shipping; the synth is in
mod-matrix / review hardening, with a browser (WASM) port in progress. No
download is available yet.

## Synthesis architecture

- **6 operators, 32 algorithms.** Every DX7-canonical algorithm graph is
  supported. `algo` is a pure topology parameter — it rewires which operators
  are carriers, which modulate which, and which carries the feedback path,
  without touching per-op values. Structural feedback depth is a separate
  0–7 control.
- **Fixed-point phase accumulation.** Q32 phase gives free wraparound and zero
  drift; only past the phase boundary (filters, envelopes, mixing) does the
  signal become `f32`.
- **Approximated sines, not table lookup.** A branch-free Bhaskara + Moser
  polynomial (5 mul + 2 abs + 2 add) that vectorises well and avoids NEON/AVX
  gathers. THD ≈ −59 dB.

## Voice stacking

The differentiator. Each played note can spawn up to 8 concurrent op-voices,
detuned and spread without storing a single wavetable:

- **Density** 1–8 lanes per note (1 = no stacking).
- **Detune** up to 100 cents across the stack, centre lane un-detuned.
- **Parameter spread** distributable via mod-matrix to stereo position or any other modulatable parameter.
- **Phase spread** at note-on, from aligned to maximally decorrelated — the
  "shimmer" trick.
- **Distribution** — Linear, Geometric (exponential clustering) or Random
  (re-rolled per note-on).

## Per-operator control

FM sound design lives in the modulator envelopes and key-scaling, so every
operator (×6) exposes the full set:

- **Rational tuning** — `num / denom` ratios reach sub-octaves and just
  intervals (3/2, 5/4, 7/4); a fine offset sweeps continuously between detents,
  including irrational ratios. A per-op Fixed mode gives absolute-Hz operators
  for inharmonic and percussive timbres.
- **Per-cent detune** on top of the ratio for thickening and beating.
- **Four-stage EG** (rates + levels) per operator, plus **velocity
  sensitivity** and full DX7-style **keyboard scaling** (break point, left/right
  depth and curve, rate scaling).
- **Carrier pan** into the stereo bus (disabled by the UI when an op is a
  modulator under the current algorithm).  

## Modulation

- **LFO 1 (global)** — one phase accumulator shared across all voices, for
  patch-wide, optionally tempo-synced sweeps.
- **LFO 2 (per-voice)** — key-triggered with delay + fade-in, the breathy /
  humanising LFO; each voice and each stack lane has its own phase.
- **Pitch EG** with signed levels (pitch can swing up or down) and a depth
  macro.
- **Mod Env** — a general-purpose ADSR, matrix-routed only.

### Mod matrix

A 16-slot matrix per patch. Each slot maps a **source** (`lfo1`, `lfo2`,
`pitch_eg`, `mod_env`, `mod_wheel`, `aftertouch`, `velocity`, `key`,
`voice_idx`, `voice_spread`, `voice_rand`) onto one of **29 destinations** —
per-op pitch / level / pan, global pitch, LFO and stack macros, filter cutoff /
resonance, FX mix, feedback — with a depth and a curve (lin / exp / log /
bipolar).

Sources and destinations carry a **granularity tier** (patch-global,
per-stack, per-lane); a routing is coherent when the source is coarser-or-equal
to the destination, and the UI flags lossy or degenerate routings in red while
still allowing them so old patches load. Slots 1–8 expose their depth as
CLAP-automatable parameters for performance macros. Routing `key` through a
bipolar curve replaces the old keyboard-split feature within a single patch.

## Filter (optional)

An optional per-voice oversampled **OTA-C ladder**, post-stack-sum. Off by
default — with the filter disabled the render path is bit-identical to a
filterless patch at zero added cost. LP / HP / BP / Notch modes, 12 or
24 dB/oct slope, `tanh` drive, self-oscillation at full resonance, and a
localised 1× / 2× / 4× / 8× oversample factor. Cutoff and resonance are
mod-matrix destinations.

## Effects

A fixed FX bus: **cleanup → dynamics → phaser → delay → reverb → master gain**.
Each block-level effect bypasses to a bit-exact passthrough when off, fading
its wet mix out first to avoid clicks.

- **Dynamics** — a feed-forward peak compressor into a `tanh` saturator
  (channel-strip topology), placed first so it evens FM transients before the
  time effects accumulate them.
- **Phaser** — four cascaded all-pass sections per channel with an anti-phase
  L/R LFO sweep around 600 Hz.
- **Delay** — clean digital delay with BPM sync, feedback and ping-pong.
- **Reverb** — a feedback-delay-network (FDN) reverb with size, decay, damping
  and mix.

## Voicing

Up to **16-voice polyphony**, or a monophonic **Solo** mode with legato and
portamento (glide is also available per-note in Poly). A global master tune and volume finish the chain.
