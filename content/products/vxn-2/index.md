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
version = "0.1.1"
release = "0.1.1"
formats = ["CLAP", "VST3"]
webdemo = "/products/vxn-2/web/"
license = "MIT"

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

FM lives or dies on what the modulators do over time, so every operator carries
the full set:

- **Tuning by ratio.** Whole-number ratios for the usual harmonic material,
  and just intervals — 3/2, 5/4, 7/4 — for tunings that sit differently under
  the ear. A fine offset sweeps continuously between the detents, including
  ratios that never quite repeat. Fixed mode pins an operator to an absolute
  frequency instead, which is where bells, mallets and struck metal come from.
- **Detune in cents** on top of the ratio, for thickening and beating.
- **A four-stage envelope** per operator, with rates and levels — the control
  that makes an FM sound evolve rather than sit.
- **Velocity sensitivity** and full **keyboard scaling**: a break point, its
  own depth and curve either side, and rate scaling, so a patch stays even from
  the bottom of the keyboard to the top.
- **Pan** for any operator you can hear, greyed out on the ones currently doing
  the modulating.

## Modulation

- **LFO 1** is global: one sweep shared by every voice, tempo-syncable, for
  patch-wide movement.
- **LFO 2** is per-voice, key-triggered, with delay and fade-in — the breathy
  one. Every voice and every stack lane runs its own.
- **Pitch envelope** with signed levels, so pitch can swing up or down into the
  note, plus a depth macro.
- **Mod envelope** — a spare ADSR with no fixed job, routed wherever you send
  it.

### Mod matrix

Sixteen slots. Each maps a source onto one of **29 destinations**, with a depth
and a curve (linear, exponential, logarithmic, bipolar).

**Sources**: LFO 1/2, pitch envelope, mod envelope, mod wheel, aftertouch,
velocity, key, stack position, stack spread, per-note random.
**Destinations**: per-operator pitch, level and pan, global pitch, the LFO and
stack macros, filter cutoff and resonance, FX mix, feedback.

Route key through a bipolar curve and you have a keyboard split without
leaving the patch. The first eight slot depths are exposed to the host as
automatable parameters, which is enough for a set of performance macros.

## Filter

An oversampled ladder filter sits after the stack, and it is off by default —
switched off it leaves the signal path entirely rather than sitting in it doing
nothing. Switched on: low-pass, high-pass, band-pass or notch, 12 or
24 dB/octave, drive on the way in, self-oscillation at full resonance, and
1× to 8× oversampling if you are pushing it hard. Cutoff and resonance are both
matrix destinations.

## Effects

A fixed chain: **dynamics → phaser → delay → reverb**.

- **Dynamics** — a peak compressor into a saturator, first in the chain so it
  evens out FM's sharp transients before the time effects get hold of them.
- **Phaser** — four all-pass stages per channel, sweeping in opposite
  directions left and right for width.
- **Delay** — clean, with tempo sync, feedback and ping-pong.
- **Reverb** — size, decay, damping and mix.

Every effect drops to a clean bypass when it is off, fading its wet signal out
first so nothing clicks.

## Voicing

Up to sixteen voices, or Solo with legato and portamento; glide is available
per note in Poly as well. Master tune and volume finish the chain.

## Install

Unpack the archive and copy the plugin into the matching directory, then
rescan plugins in your DAW.

| | CLAP (`VXN2.clap`) | VST3 (`VXN2.vst3`) |
|---|---|---|
| **macOS** | `~/Library/Audio/Plug-Ins/CLAP/` | `~/Library/Audio/Plug-Ins/VST3/` |
| **Windows** | `C:\Program Files\Common Files\CLAP\` | `C:\Program Files\Common Files\VST3\` |

The Windows CLAP download is the bare `.clap` file — copy it straight in. Every
other download is a zip archive.
