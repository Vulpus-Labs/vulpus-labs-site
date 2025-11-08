+++
date = '2025-11-07T12:30:00Z'
draft = false
title = 'Phantasmatic'
readingTime = 3
+++

[Phantasmatic](https://store.cherryaudio.com/modules/phantasmatic) is another new module for Cherry Audio's [Voltage Modular](https://store.cherryaudio.com/bundles/voltage-modular-software). Like its older brother [Prismatic](https://store.cherryaudio.com/modules/prismatic), it uses [phase distortion](https://www.perfectcircuit.com/signal/casio-cz-series) to shape waveforms by changing the way the phase accumulator moves through a wavetable.

{{< youtube VeDn9p7TBY8 >}}

Where _Prismatic_ uses an 8-bit processing path, with small lookup tables and fixed-point arithmetic running at a 16Khz sample rate, _Phantasmatic_ runs at 48Khz and uses double precision floating point arithmetic throughout. This eliminates most of the soft (and occasionally harsh) digital noise that blankets _Prismatic_'s output, yielding a cleaner but slightly less characterful sound. It also cleans up a lot of aliasing, especially with the 2x oversampling anti-aliasing filter engaged (controlled via a "niceness" switch, where _Prismatic_ had a "nastiness" switch for making the sound _worse_).

The philosophy is the same: rather than using subtractive synthesis, filtering out unwanted harmonics, we dial in extra harmonics over a base frequency by interpolating between waveforms (or, in fact, interpolating between phase distortion profiles that turn a sine wave into something more sawtooth-like or square-like). It's quite a distinctive, and intuitive, way of building patches.

As with _Prismatic_, the [module's code](https://github.com/Vulpus-Labs/vulpus-labs-vm/tree/main/modules/phantasmatic) is in the [vulpus-labs-vm monorepo](https://github.com/Vulpus-Labs/vulpus-labs-vm). It can be interesting to [compare the two](https://github.com/Vulpus-Labs/vulpus-labs-vm/tree/main/modules/prismatic), if you're interested in that sort of thing.