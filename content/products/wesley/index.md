+++
title = "Wesley"
date = 2026-11-25
type = "products"
range = "fx"
weight = 61
tagline = "A bitcrusher in three bands: crush the highs, spare the bass"
accent = "#e2b25a"
blurb = "Two crossovers split the sound into lows, mids and highs, and each band gets a whole bitcrusher of its own, with auto gain, level, mix and solo. The bass stays clean by default. Free, and open source."
status = "shipping"
formats = ["CLAP", "VST3"]
license = "Free · MIT or Apache-2.0"
version = "0.3.1"
signed = true
manual = "/manuals/wesley/"

[install]
clap = "Wesley.clap"
vst3 = "Wesley.vst3"

[[downloads]]
platform = "macOS"
format = "CLAP plugin"
arch = "Universal"
url = "https://downloads.vulpuslabs.com/wesley/0.3.1/wesley-0.3.1-macos.clap.zip"

[[downloads]]
platform = "macOS"
format = "VST3 plugin"
arch = "Universal"
url = "https://downloads.vulpuslabs.com/wesley/0.3.1/wesley-0.3.1-macos.vst3.zip"

[[downloads]]
platform = "Windows"
format = "CLAP plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/wesley/0.3.1/wesley-0.3.1-windows.clap.zip"

[[downloads]]
platform = "Windows"
format = "VST3 plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/wesley/0.3.1/wesley-0.3.1-windows.vst3.zip"

[[downloads]]
platform = "Linux"
format = "CLAP plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/wesley/0.3.1/wesley-0.3.1-linux.clap.zip"

[[downloads]]
platform = "Linux"
format = "VST3 plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/wesley/0.3.1/wesley-0.3.1-linux.vst3.zip"

[[extras]]
label = "SHA-256 checksums"
url = "https://downloads.vulpuslabs.com/wesley/0.3.1/SHA256SUMS"

[[extras]]
label = "Source code (GitHub)"
url = "https://github.com/Vulpus-Labs/vxn-free"
+++

**Wesley** is a bitcrusher that works in three bands. It splits the sound
into lows, mids and highs, crushes each on its own, with its own amount
and character, and puts them back together. Grit up a vocal's presence
while its body stays smooth, fuzz a drum bus's snare and cymbals and leave
the kick round, or crush the bass alone. It is a free
[CLAP](https://cleveraudio.org/) and VST3 plugin for macOS, Windows and
Linux ([downloads](#downloads)), and its source is on
[GitHub](https://github.com/Vulpus-Labs/vxn-free) under the MIT or
Apache-2.0 licence.

Each band has the controls of [Beverley](/products/beverley/), its
single-band sibling.

## The bands

**LOW X** and **HIGH X** set where the sound is split, from 40 Hz to 1 kHz
and from 500 Hz to 12 kHz. The bands overlap gently at each crossover and
always add back up to an even sound: switch every band off, with each
**LEVEL** at 0 dB, for a clean bypass.

Each band's **ON** switches its crush on and off, and **SOLO** lets you hear
it alone while you set it up; one band at a time. Out of the box LOW is
off, so the bass passes clean while the mids and highs are crushed:
crushing a slow bass wave adds buzz far above it, and on a mix or a drum
bus the low end is what most needs protecting. On a bass part, switch it
on for a square-edged fuzz.

## A band

Every band has Beverley's crush: **BIT DEPTH**, **SMOOTHING**, **GAMMA** and
**CRUSH**, with a **1 CYCLE** display that shows what they do to one cycle
of a tone. **GAIN** drives the band into the crush, and **AUTO**, on by
default, sets the gain from the band's level so a quiet band is crushed as
hard as a loud one, with its own **DETECT** and **DECAY**: a release that
suits the treble would make the bass lose its crush, so each band has its
own. **LEVEL** sets the band's volume in the mix, even with its crush off,
and **MIX** blends the band's crushed sound with its clean one.

## Stereo and mix

**STEREO** (mono, separate or linked) applies to every band, and **MIX**
blends the whole of Wesley's sound with the clean one.

Wesley adds no latency, so it can sit on a live input.
