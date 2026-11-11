+++
title = "vxn-2b"
date = 2026-11-08
type = "products"
range = "vxn"
weight = 40
tagline = "Six-operator FM synth with voice stacking and LCD displays"
accent = "#ff8a3d"
blurb = "Six-operator FM with all thirty-two operator arrangements, a 16-slot mod matrix, and stacking that turns one note into eight."
status = "coming soon"
formats = ["CLAP", "VST3", "Browser"]
webdemo = "/products/vxn-2b/web/"
manual = "/manuals/vxn-2b/"
storeSoon = "The vxn-2b plugin, as CLAP and VST3 for macOS and Windows, will follow. Until then, play it in your browser."

[[legacy]]
title = "VXN2"
version = "0.3.2"
release = "0.3.2"
note = "vxn-2b's predecessor, free and MIT-licensed, as CLAP and VST3 plugins. It is no longer developed, and vxn-2b does not read its saved sessions or user presets; its factory bank is in vxn-2b."

[legacy.install]
clap = "VXN2.clap"
vst3 = "VXN2.vst3"

[[legacy.downloads]]
platform = "macOS"
format = "CLAP plugin"
arch = "Universal"
asset = "VXN2-macOS-universal.clap.zip"

[[legacy.downloads]]
platform = "macOS"
format = "VST3 plugin"
arch = "Universal"
asset = "VXN2-macOS-universal.vst3.zip"

[[legacy.downloads]]
platform = "Windows"
format = "CLAP plugin"
arch = "x64"
asset = "VXN2-windows-x64.clap"

[[legacy.downloads]]
platform = "Windows"
format = "VST3 plugin"
arch = "x64"
asset = "VXN2-windows-x64.vst3.zip"

[[audio]]
url = "/media/ravel_vxn2.m4a"
title = "Ravel — Jeux d’eau"
caption = "Performed by VXN2, vxn-2b's predecessor, from [Bernd Krueger](http://piano-midi.de/)’s arrangement of Ravel’s *Jeux d’eau*, used under [CC BY-SA 3.0 DE](https://creativecommons.org/licenses/by-sa/3.0/de/deed.en). Rendered through the synth and trimmed; this recording is shared under the same licence."

[[audio]]
url = "/media/mussorgsky_vxn2.m4a"
title = "Mussorgsky — Pictures at an Exhibition: Promenade"
caption = "Performed by VXN2, vxn-2b's predecessor, from [Bernd Krueger](http://piano-midi.de/)’s arrangement of Mussorgsky’s *Pictures at an Exhibition*, used under [CC BY-SA 3.0 DE](https://creativecommons.org/licenses/by-sa/3.0/de/deed.en). Rendered through the synth and trimmed; this recording is shared under the same licence."
+++

**vxn-2b** ("vixen 2b") is a six-operator FM synthesizer. Six sine
oscillators, thirty-two ways of wiring them to each other, and a stacking
engine that turns one note into eight, on a faceplate of rubber knobs and
green LCD panels. It is coming as [CLAP](https://cleveraudio.org/) and VST3
plugins for macOS and Windows, and you can play it now in your browser: the
web build is the same engine and the same faceplate, compiled to
WebAssembly.

FM is where the bells, electric pianos, glassy basses and metallic stabs come
from — sounds that no amount of filtering will get you out of a sawtooth.

## The voice

Six operators. Which ones you hear, and which ones bend the others, is set by
the algorithm: thirty-two arrangements, drawn on their own LCD and changed
with a single control, and changing it never disturbs the values you have
dialled into the operators themselves. One operator in each arrangement feeds
back into itself, running from a pure tone at zero to chaos at full.

The operators are pure sines, and modulation wraps rather than clips, so a
modulator at full level bites at its full depth. **QUALITY** sets how far the
voices are oversampled: Standard runs them at the host's rate, or twice it
while the filter is on, and High at four times, for high notes, deep
modulation and heavy feedback without folded-back aliasing.

## Voice stacking

Play one note and hear up to eight.

Detune fans the lanes out in pitch, up to fifty cents, while the centre lane
stays put, so a patch thickens without the pitch wandering off. Space the lanes
evenly for a smooth chorus, cluster them to keep most of the stack close to the
centre, or scatter them so no two notes come out quite alike.

Phase spread sets how the stack starts. Line the lanes up and the attack is
hard and immediate. Push them apart and the note softens and shimmers into
being.

Spread is a modulation source in its own right, so what varies across the stack
is yours to choose. Route it to pan and one note fills the stereo field. Route
it to a modulator's level and the stack grades from clean at its centre to
biting at its edges — several timbres inside a single note.

## Per-operator control

Every operator has its own four-stage envelope and key scaling, drawn on the
operator's LCD and edited by dragging their points. Tuning is by ratio, with
just intervals and a continuous fine offset, or fixed frequencies for bells,
mallets and struck metal. All six operators' levels, pans and phases sit on
one plate, so a patch's balance is visible at a glance.

## Modulation

Two LFOs — one shared across the patch and tempo-syncable, one per voice with
delay and fade-in. A pitch envelope that can swing up or down into a note. A
spare delay-attack-hold-decay-sustain-release envelope with no fixed job. All
of it lands in a sixteen-slot matrix that reaches per-operator pitch, level
and pan, the filter, the stack and the effects, through linear, exponential,
logarithmic or bipolar curves. A route that can't work as set is flagged in
red.

## Filter and effects

A ladder filter sits after the stack, off by default and out of the signal
path when it is: low-pass, high-pass, band-pass or notch, 12 or 24 dB/octave,
with drive for colour and self-oscillation at full resonance. Turned on at its
defaults it is open, so it changes nothing but cleans up. A high-pass on the
sum sets the low-end weight. Then dynamics, phaser, delay and reverb, and a
limiter.

## Voicing and presets

Up to sixteen voices, or Solo with legato and portamento. The factory bank
has over fifty presets. The [manual](/manuals/vxn-2b/) describes every control, with graphs
measured from the synth's own code.
