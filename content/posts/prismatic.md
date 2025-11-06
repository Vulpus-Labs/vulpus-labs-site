+++
date = '2025-11-05T14:33:07Z'
draft = false
title = 'Prismatic'
readingTime = 3
+++

> Whatever you now find weird, ugly, uncomfortable and nasty about a new medium will surely become its signature. CD distortion, the jitteriness of digital video, the crap sound of 8-bit - all of these will be cherished and emulated as soon as they can be avoided.
>
> -- Brian Eno, _A Year With Swollen Appendices_

[Prismatic](https://store.cherryaudio.com/modules/prismatic) is a new module for Cherry Audio's [Voltage Modular](https://store.cherryaudio.com/bundles/voltage-modular-software). It uses [phase distortion](https://www.perfectcircuit.com/signal/casio-cz-series) to shape waveforms by changing the way the phase accumulator moves through a wavetable.

{{< youtube yHmgdnwUkTU >}}

In the interests of crunchy 80s digital synth realness, the wavetable _Prismatic_ uses is just 256 bytes long and encodes a sine wave at 8-bit resolution. What's more, the oscillator runs at 16khz, and has to be upsampled to Voltage Modular's native 48Khz sample rate. So things do get very artifact-y, and the module has a "nastiness" knob that lets you dial out some of the smoothing and filtering that's done to make it cleaner and more well-behaved.

One interesting thing about the presets demoed in the above video is that, with one exception, none of them uses any kind of filter. Harmonics are controlled by adjusting the phase distortion behaviour, smoothly interpolating between a sine wave (no harmonics) and a square or sawtooth wave (many additional harmonics). There's an additional waveform which uses the "DCW" control to speed up or slow down the oscillator while keeping it synced to the base frequency, producing a "resonant" effect (you can read more about how this works on the [wikipedia page on phase distortion synthesis](https://en.wikipedia.org/wiki/Phase_distortion_synthesis)).

The patch that does use a filter is the one which runs an arpeggiator through the mono channel while producing chords with the poly channel -- a nice trick. We lowpass the chords to give the arpeggios a bit of space in the overall mix of voices.

The [module's code](https://github.com/Vulpus-Labs/vulpus-labs-vm/tree/main/modules/prismatic) is in the [vulpus-labs-vm monorepo](https://github.com/Vulpus-Labs/vulpus-labs-vm), along with that of all the other Voltage Modular modules I've built over the past few years (in various states of abandonment and disrepair - _caveat lector_).