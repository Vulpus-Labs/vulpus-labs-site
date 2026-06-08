+++
title = "VXN1"
date = 2026-06-07
type = "products"
weight = 30
tagline = "An 80s-style analogue polysynth — CLAP plugin"
status = "shipping"
version = "0.0.6"
license = "MIT"
[[downloads]]
platform = "macOS"
format = "CLAP plugin"
arch = "Universal"
file = "vxn-1/VXN1-macos-0.0.6.zip"
[[downloads]]
platform = "Windows"
format = "CLAP plugin"
arch = "x64"
file = "vxn-1/VXN1-windows-0.0.6.zip"
+++

**VXN1** ("vixen 1") is an 80s-style analogue polysynth, built in Rust as a
[CLAP](https://cleveraudio.org/) plugin. 16-voice polyphony, dual oscillators
with cross-modulation, a 4-pole ladder filter, and a vintage-flavoured chorus —
packaged as a single `.clap` bundle.

## Features

- **16-voice polyphony** with per-voice envelopes and a global LFO.
- **Dual oscillators** with hard-sync and phase/cross-modulation, plus optional
  anti-aliasing oversampling up to 8×.
- **OTA-C ladder VCF** (R3109/IR3109-style) with a switchable 12 / 24 dB/oct
  slope, plus a separate high-pass filter.
- **Pitch envelope** alongside the amplitude and filter envelopes.
- **Vintage bucket-brigade (BBD) chorus** — "Bright" voicing with bucket
  saturation, anti-image/reconstruction filter banks, and inverted-LFO
  mono-compatible stereo.
- Embedded GUI via CLAP's `gui` extension.

## Install

Unpack the archive and copy `VXN1.clap` into your CLAP plugin directory:

- **macOS** — `~/Library/Audio/Plug-Ins/CLAP/`
- **Windows** — `C:\Program Files\Common Files\CLAP\`

Then rescan plugins in your DAW.
