+++
title = "vxn-1c"
date = 2026-11-08
type = "products"
range = "vxn"
weight = 35
tagline = "Dual-layer subtractive polysynth with a mod matrix and an arpeggiator per layer"
accent = "#5aa8f5"
blurb = "Two complete instruments in one patch, layered or split, each with a 16-slot mod matrix, an arpeggiator and stacking up to 32 voices a note. The successor to VXN1b, with a new faceplate and cleaner sound."
status = "coming soon"
formats = ["CLAP", "Browser"]
webdemo = "/products/vxn-1c/web/"
manual = "/manuals/vxn-1c/"
storeSoon = "vxn-1c is coming soon to [KVR Marketplace](https://www.kvraudio.com/marketplace). Until then, play it in your browser — and the free VXN1b it replaces is still below."

[[legacy]]
title = "VXN1b"
version = "0.3.2"
release = "0.3.2"
note = "vxn-1c's predecessor, free and MIT-licensed, as CLAP and VST3 plugins. It is no longer developed, and vxn-1c does not read its presets or saved sessions."

[legacy.install]
clap = "vxn1b.clap"
vst3 = "VXN1b.vst3"

[[legacy.downloads]]
platform = "macOS"
format = "CLAP plugin"
arch = "Universal"
asset = "VXN1b-macOS-universal.clap.zip"

[[legacy.downloads]]
platform = "macOS"
format = "VST3 plugin"
arch = "Universal"
asset = "VXN1b-macOS-universal.vst3.zip"

[[legacy.downloads]]
platform = "Windows"
format = "CLAP plugin"
arch = "x64"
asset = "VXN1b-windows-x64.clap"

[[legacy.downloads]]
platform = "Windows"
format = "VST3 plugin"
arch = "x64"
asset = "VXN1b-windows-x64.vst3.zip"

[[audio]]
url = "/media/ravel_vxn1.m4a"
title = "Ravel — Jeux d’eau"
caption = "Performed by VXN1b, vxn-1c's predecessor, from [Bernd Krueger](http://piano-midi.de/)’s arrangement of Ravel’s *Jeux d’eau*, used under [CC BY-SA 3.0 DE](https://creativecommons.org/licenses/by-sa/3.0/de/deed.en). Rendered through the synth and trimmed; this recording is shared under the same licence."

[[audio]]
url = "/media/mussorgsky_vxn1.m4a"
title = "Mussorgsky — Pictures at an Exhibition: Promenade"
caption = "Performed by VXN1b, vxn-1c's predecessor, from [Bernd Krueger](http://piano-midi.de/)’s arrangement of Mussorgsky’s *Pictures at an Exhibition*, used under [CC BY-SA 3.0 DE](https://creativecommons.org/licenses/by-sa/3.0/de/deed.en). Rendered through the synth and trimmed; this recording is shared under the same licence."
+++

**vxn-1c** is a dual-layer subtractive polysynth and the successor to
[VXN1b](#previous). It plays VXN1b's sounds through a new faceplate, with
a new chorus, cleaner oscillators and filter, an arpeggiator on each layer,
and a RANDOM button that builds a new sound in one of eleven styles. It is
coming as a [CLAP](https://cleveraudio.org/) plugin for macOS and Windows,
with VST3 to follow, and you can play it now in your browser: the web build
is the same engine and the same faceplate, compiled to WebAssembly.

A patch is two complete instruments, **Layer 1** and **Layer 2**, sharing
one set of effects. Layer 2 doubles Layer 1 on every note or takes the keys
below a split point — a pad under a lead, a bass under an arpeggio, or a
sound thickened by a detuned copy of itself.

No modulation route is hard-wired: every modulatable parameter is assignable
from every modulation source.

## The voice

- **Oscillators.** Two, with variable pulse width, plus a sub and a noise
  source. Hard sync, FM and two kinds of ring modulation are available as
  cross-modulation modes between the pair.
- **Filter.** A 4-pole zero-delay ladder — low-pass, high-pass, band-pass or
  notch, 12 or 24 dB/octave — with drive and self-oscillating resonance.
  A gentle high-pass on each layer's sum keeps its low end in check.
- **Envelopes and LFOs.** Two ADSRs, linear or exponential, and two LFOs
  per layer; LFO 1 has a delayed fade-in.
- **Arpeggiator.** One per layer, so a split can arpeggiate one side and
  hold the other: up, down, up/down, random or as played, over one to four
  octaves, synced to the host's tempo, with gate, swing and hold.

## Voice stacking

Each layer is 32-note polyphonic, or stacks voices: 16 doubled, 8
quadrupled, and so on to all 32 in unison on one note.

Within a stack, voices are detuned and phased, fanning them out in pitch and
start phase, spaced evenly, geometrically or at random. A routable
**spread** source can be applied to anything a voice has, from pan to pulse
width or cross-modulation depth.

## The modulation matrix

Sixteen slots per layer, each routing a source through a depth and a curve
to a destination, optionally scaled by a second source: envelopes, LFOs,
velocity, key, the wheels, aftertouch, a per-note random value and a stack's
spread and position, into pitch, pulse width, cross modulation, cutoff and
resonance, amplitude, pan, LFO 1's rate and the envelopes' times and
sustain.

## Effects

Dynamics, a bucket-brigade chorus, phaser, tempo-syncable delay and reverb,
then a limiter. **QUALITY** sets how far the voices are oversampled:
Standard for everyday playing, High for the cleanest top end.

## Presets

A factory bank of over fifty presets, including VXN1b's converted bank and
the manual's worked examples. The [manual](/manuals/vxn-1c/) describes every
control, with graphs measured from the synth's own code.
