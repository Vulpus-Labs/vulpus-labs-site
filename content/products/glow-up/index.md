+++
title = "Glow-Up"
date = 2026-11-26
type = "products"
range = "fx"
weight = 62
tagline = "A harmonic filter: draw a second pitch out of the overtones already there"
accent = "#f2a33a"
blurb = "Boosts the overtones already in a sound at two intervals above its strongest pitches, an octave and a fifth by default. On plucked guitar it draws out a second pitch; elsewhere it brightens or rings. Free, and open source."
status = "shipping"
formats = ["CLAP", "VST3"]
license = "Free · MIT or Apache-2.0"
version = "0.3.0"
signed = true
manual = "/manuals/glow-up/"

[install]
clap = "Glow-Up.clap"
vst3 = "Glow-Up.vst3"

[[downloads]]
platform = "macOS"
format = "CLAP plugin"
arch = "Universal"
url = "https://downloads.vulpuslabs.com/glow-up/0.3.0/glow-up-0.3.0-macos.clap.zip"

[[downloads]]
platform = "macOS"
format = "VST3 plugin"
arch = "Universal"
url = "https://downloads.vulpuslabs.com/glow-up/0.3.0/glow-up-0.3.0-macos.vst3.zip"

[[downloads]]
platform = "Windows"
format = "CLAP plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/glow-up/0.3.0/glow-up-0.3.0-windows.clap.zip"

[[downloads]]
platform = "Windows"
format = "VST3 plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/glow-up/0.3.0/glow-up-0.3.0-windows.vst3.zip"

[[downloads]]
platform = "Linux"
format = "CLAP plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/glow-up/0.3.0/glow-up-0.3.0-linux.clap.zip"

[[downloads]]
platform = "Linux"
format = "VST3 plugin"
arch = "x64"
url = "https://downloads.vulpuslabs.com/glow-up/0.3.0/glow-up-0.3.0-linux.vst3.zip"

[[extras]]
label = "SHA-256 checksums"
url = "https://downloads.vulpuslabs.com/glow-up/0.3.0/SHA256SUMS"

[[extras]]
label = "Source code (GitHub)"
url = "https://github.com/Vulpus-Labs/vxn-free"
+++

**Glow-Up** finds the strongest pitches in a sound and boosts the
overtones already there at chosen intervals above them: an octave, a
fifth, or any ratio you set. On a plucked guitar note, rich in overtones,
the one at that interval comes forward until you hear it as a second
pitch alongside the note. On other sounds it brightens, and with its
resonance turned up it adds overtones that ring and sing. For a shimmer,
turn on **DRY CUT** and send only the boosts into a reverb.

It is a free
[CLAP](https://cleveraudio.org/) and VST3 plugin for macOS, Windows and
Linux ([downloads](#downloads)), and its source is on
[GitHub](https://github.com/Vulpus-Labs/vxn-free) under the MIT or
Apache-2.0 licence.

## The boosts

Glow-Up has two boosts, A and B. Each has an **AMOUNT** and a ratio set
as **MULT** over **DIV**, each from 1 to 8: A starts at 2/1, an octave up,
and B at 3/2, a fifth up. Ratios that land on a note's overtones, such
as 2/1, 3/2, 3/1 and 4/1, are where the effect is strongest; a ratio
below 1, such as 1/2, boosts below each peak, where there is something
there to boost.

## The filters

**FOCUS** decides where the filters sit. At **GRID** they stay on fixed
pitches, and a bend or slide sweeps through them, swelling as it passes,
like the resonances of a body or a room; the **GRID** keys pick an even
(**LIN**), irregular (**IRR**) or equal-tempered (**TET**) grid. At
**TRACK** each filter follows its target exactly, through bends and
vibrato. **RESONANCE** sharpens the boosts until, past its SING mark,
strong notes make their filters sing. **WIDTH**, **SPEED**, **TONE** and
**THRESHOLD** set how narrow the boosts are, how fast they react, whether
they favour low or high pitches, and how strong a pitch must be to get
one.

## The screen

The screen shows the input in red and the output in amber, with the glow
between them where the boosts land, the pitches found as vertical lines,
and each filter as a dot.

## Output

**MIX** blends the effect with the clean sound, and **DRY CUT** leaves
only the boosts. **MONO**, the default, takes the left input to both
outputs; **STEREO** boosts each side. Glow-Up adds no latency, so it can
sit on a live input.
