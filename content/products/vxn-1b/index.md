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
version = "0.3.1"
release = "0.3.1"
formats = ["CLAP", "VST3"]
webdemo = "/products/vxn-1b/web/"
license = "MIT"

[install]
clap = "vxn1b.clap"
vst3 = "VXN1b.vst3"

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
patch is two independent layers, each with its own voice and 16-slot modulation matrix. Place a pad under a lead, or thicken a sound with a detuned copy of itself.

No modulation route is hard-wired: every modulatable parameter is assignable from every modulation source.

## The voice

- **Oscillators.** Two, with variable pulse width, plus a sub and a noise
  source. Hard sync, phase modulation and ring modulation are available as
  cross-modulation modes between the pair.
- **Filter.** A 4-pole ZDF ladder capable of overdrive and self-oscillating resonance.
- **Envelopes and LFOs.** Two ADSRs and two LFOs per layer.
- **Effects.** A bucket-brigade chorus, phaser, delay, reverb and dynamics.

## Voice stacking

By default, each layer is 32-note polyphonic. But you can choose to stack voices: 16 doubled, 8 quadrupled, and so on all the way to having all 32 notes playing in unison at once.

Within the stack, voices can be detuned and phased, fanning them out in pitch and start phase. There is also a routable "spread" modulation source which can be applied to any attribute the voice possesses, from pan to pulse width or cross-modulation depth.

## Install

Unpack the archive and copy the plugin into the matching directory, then rescan
plugins in your DAW.

| | CLAP (`vxn1b.clap`) | VST3 (`VXN1b.vst3`) |
|---|---|---|
| **macOS** | `~/Library/Audio/Plug-Ins/CLAP/` | `~/Library/Audio/Plug-Ins/VST3/` |
| **Windows** | `C:\Program Files\Common Files\CLAP\` | `C:\Program Files\Common Files\VST3\` |

The Windows CLAP download is the bare `.clap` file — copy it straight in. Every
other download is a zip archive.
