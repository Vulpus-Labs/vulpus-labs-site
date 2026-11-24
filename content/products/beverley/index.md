+++
title = "Beverley"
date = 2026-11-24
type = "products"
range = "fx"
weight = 60
tagline = "A bitcrusher that adds harmonic grit, not just stair-steps"
accent = "#d9572b"
blurb = "Gamma-curved, fractional-depth bit reduction with smoothing between steps, and auto gain that crushes quiet passages as hard as loud ones. Free, and open source."
status = "shipping"
formats = ["CLAP", "VST3"]
license = "Free · MIT or Apache-2.0"
version = "0.1.1"
signed = true
manual = "/manuals/beverley/"

[install]
clap = "Beverley.clap"
vst3 = "Beverley.vst3"

[[downloads]]
platform = "macOS"
format = "CLAP plugin"
arch = "Universal"
url = "https://downloads.vulpuslabs.com/beverley/0.1.1/beverley-0.1.1-macos.clap.zip"

[[downloads]]
platform = "macOS"
format = "VST3 plugin"
arch = "Universal"
url = "https://downloads.vulpuslabs.com/beverley/0.1.1/beverley-0.1.1-macos.vst3.zip"

[[downloads]]
platform = "Windows"
format = "CLAP plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/beverley/0.1.1/beverley-0.1.1-windows.clap.zip"

[[downloads]]
platform = "Windows"
format = "VST3 plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/beverley/0.1.1/beverley-0.1.1-windows.vst3.zip"

[[downloads]]
platform = "Linux"
format = "CLAP plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/beverley/0.1.1/beverley-0.1.1-linux.clap.zip"

[[downloads]]
platform = "Linux"
format = "VST3 plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/beverley/0.1.1/beverley-0.1.1-linux.vst3.zip"

[[extras]]
label = "SHA-256 checksums"
url = "https://downloads.vulpuslabs.com/beverley/0.1.1/SHA256SUMS"

[[extras]]
label = "Source code (GitHub)"
url = "https://github.com/Vulpus-Labs/vxn-free"
+++

**Beverley** is a bitcrusher for guitars, drums, synths and anything else
that could do with some dirt. Most bitcrushers chop a signal into hard
stair-steps; Beverley lets you choose where the steps fall, how many there
are and how sharp their edges are, so it runs from a gentle grain to a
full-on square-wave fuzz. It is a free [CLAP](https://cleveraudio.org/)
and VST3 plugin for macOS, Windows and Linux ([downloads](#downloads)), and its
source is on [GitHub](https://github.com/Vulpus-Labs/vxn-free) under the
MIT or Apache-2.0 licence.

It began life as a Vulpus Labs module for Voltage Modular, and keeps that
module's sound and controls.

## The crush

**BIT DEPTH** sets how many steps the signal is cut into, from one bit (a
square wave) to sixteen (barely touched). It turns smoothly: between whole
depths Beverley blends the two either side, so sweeping it never clicks
from one depth to the next.

**SMOOTHING** shapes each step. At 0 they are hard edges; around the middle
each step becomes an S-curve, rounder and less harsh; at 100 % the steps are
gone and the signal passes untouched. It is also the way to tame the
crush's high-frequency fizz: the further it goes, the less fizz is left.

**GAMMA** decides whether quiet or loud parts of the sound break up first.
Below 1 the steps are coarse where the sound is quiet, so soft tails grit
up while peaks stay clean; above 1 they are coarse where it is loud, so the
attack breaks up first while quiet parts keep their detail.

**CRUSH** picks how the steps are laid out. **SYM** crushes each side of
the waveform on its own, with a step at silence, so quiet sounds fall
away to nothing. **ASYM** crushes the whole wave on one grid with no step
at silence, which buzzes and spits more, closer to an old sampler.

## Gain

**GAIN** pushes the signal up to 20 dB into the crush and takes it back
down afterwards, so it changes how hard the signal is crushed without
making it louder. Push it far enough and the peaks clip as well, coming out
flattened and quieter.

Press **AUTO** and Beverley sets the gain for you, following the input so
that quiet passages are crushed as hard as loud ones. **DETECT** chooses
how it listens: **PEAK** follows the loudest parts of the signal, while
**RANGE** follows its highest and lowest points, crushing a signal with an
offset around its centre rather than around silence. **DECAY** sets how
quickly either lets go after a loud moment, from a millisecond to five
seconds.

## Stereo and mix

**STEREO** sets how the two channels are treated: **MONO** sums them and
crushes once; **SEP** crushes each on its own; **LINK** crushes each but
with one auto gain for both, so the stereo image stays put. **MIX** blends
the crushed signal back with the dry one.

Beverley adds no latency, so it can sit on a live input.
