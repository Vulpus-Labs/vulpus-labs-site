+++
title = "VXN2"
date = 2026-06-07
type = "products"
range = "vxn"
weight = 40
tagline = "6-operator FM synth with voice stacking — CLAP and VST3"
accent = "#ff8a3d"
blurb = "Six-operator FM with all thirty-two operator arrangements, a 16-slot mod matrix, and stacking that turns one note into eight."
status = "shipping"
version = "0.3.0"
release = "0.3.0"
formats = ["CLAP", "VST3"]
webdemo = "/products/vxn-2/web/"
license = "MIT"

[install]
clap = "VXN2.clap"
vst3 = "VXN2.vst3"

[[downloads]]
platform = "macOS"
format = "CLAP plugin"
arch = "Universal"
asset = "VXN2-macOS-universal.clap.zip"

[[downloads]]
platform = "macOS"
format = "VST3 plugin"
arch = "Universal"
asset = "VXN2-macOS-universal.vst3.zip"

[[downloads]]
platform = "Windows"
format = "CLAP plugin"
arch = "x64"
asset = "VXN2-windows-x64.clap"

[[downloads]]
platform = "Windows"
format = "VST3 plugin"
arch = "x64"
asset = "VXN2-windows-x64.vst3.zip"

[[audio]]
url = "/media/ravel_vxn2.m4a"
title = "Ravel — Jeux d’eau"
caption = "Performed by VXN2 from [Bernd Krueger](http://piano-midi.de/)’s arrangement of Ravel’s *Jeux d’eau*, used under [CC BY-SA 3.0 DE](https://creativecommons.org/licenses/by-sa/3.0/de/deed.en). Rendered through the synth and trimmed; this recording is shared under the same licence."

[[audio]]
url = "/media/mussorgsky_vxn2.m4a"
title = "Mussorgsky — Pictures at an Exhibition: Promenade"
caption = "Performed by VXN2 from [Bernd Krueger](http://piano-midi.de/)’s arrangement of Mussorgsky’s *Pictures at an Exhibition*, used under [CC BY-SA 3.0 DE](https://creativecommons.org/licenses/by-sa/3.0/de/deed.en). Rendered through the synth and trimmed; this recording is shared under the same licence."
+++

**VXN2** ("vixen 2") is a six-operator FM synthesizer, shipped as a
[CLAP](https://cleveraudio.org/) and a VST3 plugin for macOS and Windows. Six
sine oscillators, thirty-two ways of wiring them to each other, and a stacking
engine that turns one note into eight.

FM is where the bells, electric pianos, glassy basses and metallic stabs come
from — sounds that no amount of filtering will get you out of a sawtooth.

## The voice

Six operators. Which ones you hear, and which ones bend the others, is set by
the algorithm: thirty-two arrangements, changed with a single control, and
changing it never disturbs the values you have dialled into the operators
themselves. One operator in each arrangement feeds back into itself, running
from a pure tone at zero up to noise at full.

## Voice stacking

Play one note and hear up to eight.

Detune fans the lanes out by up to a hundred cents while the centre lane stays
put, so a patch thickens without the pitch wandering off. Space the lanes
evenly for a smooth chorus, cluster them to keep most of the stack close to the
centre, or scatter them so no two notes come out quite alike.

Phase spread sets how the stack starts. Line the lanes up and the attack is
hard and immediate. Push them apart and the note softens and shimmers into
being.

Spread is a modulation source in its own right, so what varies across the stack
is yours to choose. Route it to pan and one note fills the stereo field. Route
it to a modulator's level and the stack grades from clean at its centre to
biting at its edges — several timbres inside a single note. Route it to an
operator's pitch and the outer lanes drift into inharmonic territory while the
core stays sweet.

## Per-operator control

Every operator has its own four-stage envelope, so an FM sound evolves rather
than sits — the modulators can fade in behind a carrier, or bite hard on the
attack and vanish. Tuning is by ratio, with just intervals and a continuous
fine offset for ratios that never quite repeat, or Fixed mode for the absolute
frequencies that give you bells, mallets and struck metal. Velocity sensitivity
and keyboard scaling keep a patch even from the bottom of the keyboard to the
top.

## Modulation

Two LFOs — one shared across the patch and tempo-syncable, one per voice with
delay and fade-in for the breathy, humanising kind of movement. A pitch
envelope that can swing up or down into a note. A spare envelope with no fixed
job. All of it lands in a sixteen-slot matrix that reaches per-operator pitch,
level and pan, the filter, the stack macros and the effects, through linear,
exponential, logarithmic or bipolar curves.

## Filter and effects

An oversampled ladder sits after the stack, off by default and out of the
signal path entirely when it is: low-pass through notch, 12 or 24 dB/octave,
drive on the way in and self-oscillation at full resonance, for when you want
FM to sit behind something subtractive. After it, dynamics, phaser, delay and
reverb — the compressor first, so it evens out FM's sharp transients before the
time effects get hold of them.

## Voicing

Up to sixteen voices, or Solo with legato and portamento.

## Install

Unpack the archive and copy the plugin into the matching directory, then
rescan plugins in your DAW.

| | CLAP (`VXN2.clap`) | VST3 (`VXN2.vst3`) |
|---|---|---|
| **macOS** | `~/Library/Audio/Plug-Ins/CLAP/` | `~/Library/Audio/Plug-Ins/VST3/` |
| **Windows** | `C:\Program Files\Common Files\CLAP\` | `C:\Program Files\Common Files\VST3\` |

The Windows CLAP download is the bare `.clap` file — copy it straight in. Every
other download is a zip archive.
