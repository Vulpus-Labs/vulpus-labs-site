+++
title = "VXN2"
date = 2026-06-07
type = "products"
weight = 40
tagline = "Next-generation operator-based synth — in design"
status = "in design"
license = "MIT"
+++

**VXN2** is the next-generation Vulpus Labs synth, currently in its design
phase. No download is available yet.

## Design premises

- **Operator-based oscillator architecture** — DX-style operators,
  stack-detuned to enable hypersaw-type voicings without wavetable cost.
- **Fixed-point phase accumulation** — Q32 phase, free wraparound, zero drift.
  Float past the phase boundary (filters, envelopes, mixing stay `f32`).
- **Approximated sines, not table lookup** — a Bhaskara+Moser polynomial
  (5 mul + 2 abs + 2 add), branch-free and well-vectorised. THD ≈ −59 dB,
  masked under hypersaw detune; a higher-accuracy path is reserved for solo
  carriers.

Architecture decision records are forthcoming.
