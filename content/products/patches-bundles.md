+++
title = "Patches Bundles"
date = 2026-06-07
type = "products"
weight = 20
tagline = "Stdlib module bundles for the Patches modular-audio framework"
accent = "#3fd8b8"
status = "in development"
releaseRepo = "Vulpus-Labs/patches-bundles"
license = "MIT"
+++

Add-on module bundles for [Patches](/products/patches/). No binary release is
published yet — build from
[the repository](https://github.com/Vulpus-Labs/patches-bundles) in the
meantime. Each bundle is a
native plugin (`.pxm`) loaded into the host at runtime by the plugin scanner —
drop it into a scanned plugin directory and the modules become available in
your `.patches` files.

## Bundles

| Bundle | Modules |
|--------|---------|
| **patches-vintage** | VChorus, VBbd, VStereoBbd, VDco, VPolyDco, VFlanger, VFlangerStereo, VReverb, VLadder, VPolyLadder, VOtaVcf, VOtaPolyVcf |
| **patches-drums** | Kick, Snare, ClapDrum, OpenHiHat, ClosedHiHat, Tom, Cymbal, Claves |
| **patches-fft-bundle** | ConvolutionReverb, StereoConvolutionReverb, PitchShift |

## Install

Unpack the archive and place the `.pxm` files in a directory scanned by the
Patches host. The scanner checks, in order:

1. paths in the `PATCHES_PLUGIN_PATH` environment variable
2. the host's global plugin directories

See the [Patches manual](https://vulpus-labs.github.io/patches/) for the full
list of per-platform scan locations.
