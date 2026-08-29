+++
title = "VXN1b"
date = 2026-08-26
type = "products"
range = "vxn"
weight = 35
tagline = "Dual-layer subtractive polysynth with a mod matrix — CLAP and VST3"
accent = "#5aa8f5"
blurb = "Two independent layers per patch, each with a 16-slot mod matrix and stacking up to 32 voices a note — thick unison, wide supersaw, or a chord that changes timbre across its own width."
status = "shipping"
version = "0.0.3"
release = "vxn-1b-0.0.3"
formats = ["CLAP", "VST3"]
webdemo = "/products/vxn-1b/web/"
license = "MIT"

[[downloads]]
platform = "macOS"
format = "CLAP plugin"
arch = "Universal"
asset = "VXN1b-macOS-universal.clap.zip"

[[downloads]]
platform = "macOS"
format = "VST3 plugin"
arch = "Universal"
asset = "VXN1b-macOS-universal.vst3.zip"

[[downloads]]
platform = "Windows"
format = "CLAP plugin"
arch = "x64"
asset = "VXN1b-windows-x64.clap"

[[downloads]]
platform = "Windows"
format = "VST3 plugin"
arch = "x64"
asset = "VXN1b-windows-x64.vst3.zip"

[[audio]]
url = "/media/ravel_vxn1.m4a"
title = "Ravel — Jeux d’eau"
caption = "Performed by VXN1b from [Bernd Krueger](http://piano-midi.de/)’s arrangement of Ravel’s *Jeux d’eau*, used under [CC BY-SA 3.0 DE](https://creativecommons.org/licenses/by-sa/3.0/de/deed.en). Rendered through the synth and trimmed; this recording is shared under the same licence."

[[audio]]
url = "/media/mussorgsky_vxn1.m4a"
title = "Mussorgsky — Pictures at an Exhibition: Promenade"
caption = "Performed by VXN1b from [Bernd Krueger](http://piano-midi.de/)’s arrangement of Mussorgsky’s *Pictures at an Exhibition*, used under [CC BY-SA 3.0 DE](https://creativecommons.org/licenses/by-sa/3.0/de/deed.en). Rendered through the synth and trimmed; this recording is shared under the same licence."
+++

**VXN1b** is a dual-layer subtractive polysynth, shipped as a
[CLAP](https://cleveraudio.org/) and a VST3 plugin for macOS and Windows. A
patch is two independent layers, each with its own analogue-style voice and its
own 16-slot modulation matrix.

Nothing is hard-wired. Every modulation route in the instrument is a slot you
assign yourself, which buys a lot of freedom and asks for a little patience in
return.

## The voice

- **Oscillators.** Two, with variable pulse width, plus a sub and a noise
  source. Hard sync, phase modulation and ring modulation are available as
  cross-modulation modes between the pair.
- **Filter.** A 4-pole ZDF ladder with a switchable high-pass.
- **Envelopes and LFOs.** Two ADSRs and two LFOs, per layer.
- **Effects.** A bucket-brigade chorus, phaser, delay, reverb and dynamics.

## Two layers

A patch is two independent parameter sets — Layer 1 and Layer 2 — with their
own matrices, played together or split. Level, pan, detune and mute are per
layer; tuning, volume, drift, the limiter, oversampling and the FX chain are
global.

## Mod matrix

16 slots per layer. Each slot is a `source → destination` pair with a depth, a
curve (linear, exponential, logarithmic, bipolar) and a secondary scale source
acting as a per-route VCA.

**Sources**: Env 1/2, LFO 1/2, velocity, key, mod wheel, pitch wheel,
aftertouch, per-note random, stack spread, stack position.
**Destinations**: pitch, cross-mod sweep, cross-mod amount, PWM (both
oscillators together or each alone), cutoff, resonance, HPF cutoff, amp, pan,
Env 1/2 time scale, Env 1/2 sustain, LFO 1 rate.

## Voice stacking

Play one note and hear up to 32.

Detune fans them out in pitch. A little thickens the unison and sets a slow
beat running underneath it. A lot opens into the wide supersaw that cuts
through a busy mix. Space the lanes evenly for a smooth chorus, cluster them to
hold the stack near the centre with a few outliers hanging off the edges, or
scatter them so no two chords land the same way twice.

Phase offset sets how the stack starts. Line the lanes up and the attack is
hard and focused. Push them apart and it softens and blooms — a string section
rather than a single player.

Spread is a modulation source in its own right. Route it to pan and one note
fills the stereo field. Route it to cutoff and the lanes sit at different
depths behind the filter. Route it to cross-modulation and the stack grades
from clean in the middle to metallic at the edges. Route it to pulse width and
it runs hollow to full — a fatter chord with no detuning at all.

All of it works the same in Poly or Solo, with legato on its own switch.

## Automation

The host sees **185 parameters** — 75 per layer, plus 35 globals — with each
Layer 1 control and its Layer 2 twin as separate targets. Matrix depths
automate; the routing behind them lives in the patch, so a slot can be swept
without its topology changing underneath it.

## Install

Unpack the archive and copy the plugin into the matching directory, then rescan
plugins in your DAW.

| | CLAP (`vxn1b.clap`) | VST3 (`VXN1b.vst3`) |
|---|---|---|
| **macOS** | `~/Library/Audio/Plug-Ins/CLAP/` | `~/Library/Audio/Plug-Ins/VST3/` |
| **Windows** | `C:\Program Files\Common Files\CLAP\` | `C:\Program Files\Common Files\VST3\` |

The Windows CLAP download is the bare `.clap` file — copy it straight in. Every
other download is a zip archive.

VXN1b versions independently of the shared `0.x` line that
[VXN2](/products/vxn-2/) rides, and tags its releases `vxn-1b-<version>`.
