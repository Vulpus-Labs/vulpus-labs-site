+++
title = "PolyKritter"
date = 2026-10-19
type = "products"
weight = 45
tagline = "Kritter's virtual analog voice, sixteen at a time, with stacking, a mod matrix and effects"
accent = "#e2262e"
blurb = "Every voice is a whole Kritter: two oscillators, the effect section, a diode filter pair and the envelope. Stack them up to sixteen deep on one note, route them through an eight-slot matrix, and finish with chorus, delay, reverb and a limiter."
status = "in development"
formats = ["CLAP", "Browser"]
webdemo = "/products/polykritter/web/"
demoNote = "No install, no account. Works in Chrome, Edge and Firefox — play it from the on-screen keyboard or your computer keys."
demoPitch = "The whole synth runs in the tab: the same engine, the same faceplate and every control of the plugin — and nothing to uninstall afterwards."
+++

**PolyKritter** is Kritter, the Vulpus Labs virtual analog monosynth, played
polyphonically. Each voice is a whole Kritter voice, and every voice shares
one panel: each control is where it is on Kritter, does what it does there,
and starts where it starts there.

It is in development as a [CLAP](https://cleveraudio.org/) plugin, and you
can play it now in your browser: the web demo is the same engine and the same
faceplate, compiled to WebAssembly. Play it from the on-screen keyboard or
from your computer keys (A to ' for the notes, Z and X for the octave). It
works best in Chrome, Edge or Firefox; Safari is not supported.

## The voice

- **Oscillators.** VCO 1 is one oscillator with a divider chain beneath it:
  five waves at five footages, all phase-locked. VCO 2, the effect section's
  own oscillator, tracks VCO 1 at one to four times its pitch, tuned FREE,
  JUST or EQUAL, with FINE.
- **The effect section.** SELECT sets it to noise, a ring modulator (FIX, HI
  or LO) or DUET, and BALANCE sets VCO 1 against it.
- **Filters.** A high-pass and a low-pass diode filter, with resonance,
  envelope and vibrato on the cutoff.
- **Envelope, vibrato, repeat and glide.** Kritter's envelope with SUSTAIN and
  LONG, a vibrato with delayed fade-in, REPEAT to re-strike held notes from
  one shared clock, and portamento with the Bender's swoop.

## Voices and stacking

PolyKritter keeps a pool of twenty voices, sixteen of them sounding at once.
The VOICES strip decides how they are dealt out:

- **WIDTH** stacks from one to sixteen voices on every note.
- **DETUNE**, **SPREAD** and **PHASE** fan a stack out in pitch, in pan (or
  wherever SPREAD is routed), and in start phase; **DIST** spreads them
  linearly, geometrically or at random.
- **SOLO** plays one note at a time. With **LEGATO** on, a new note slides
  the voices to it without a new strike.

A voice that has gone silent stops running, so PolyKritter costs most while
every voice is sounding and little while it waits.

## The mod matrix

Eight slots, each routing a source to a destination through a depth, a curve
and an optional scaling source:

- **Sources:** the envelope, the LFO, velocity, key, the mod wheel,
  aftertouch, a per-note random value, a stack's spread and position, the
  gate, the voice's index, and the delayed vibrato's fade-in.
- **Destinations:** pitch, VCO 2's pitch, BALANCE, the low-pass and
  high-pass filters, cutoff, resonance, amplitude, pan, and the envelope's
  attack, decay and length.

## Effects

- **Chorus.** A bucket-brigade chorus with two modes, and its hiss, drift
  and ripple, each from none to full.
- **Delay.** A stereo delay, ping-pong by default, free or synced to the
  tempo. Its COLOUR tilts the repeats darker or lighter as they feed back.
- **Reverb.** An eight-line feedback delay network, with a low cut on its
  input.
- **Output.** A lookahead limiter after GAIN, and a scope and meters across
  the top and side of the panel.
