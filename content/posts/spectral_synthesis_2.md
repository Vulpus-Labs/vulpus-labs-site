+++
date = '2026-01-03T22:22:00Z'
draft = false
title = 'Spectral Synthesis (2)'
+++
A short addendum on the [RKW-1](/posts/spectral_synthesis). It turns out that merely observing the speaker state at a series of instants clocked to Voltage Modular's 48kHz sample rate introduces aliasing. This happens because we're shifting the points in time at which sharp transitions occur in the output, which generates upper harmonics that aren't there in the source signal and which start to fold back past the Nyquist frequency, adding metallic aliasing. It's extra colour, sure, but it isn't the colour we're looking for.

I was further motivated to fix this by the fact that the output of the RKW-1 could sound a bit ear-tiringly regular, and I wanted the ability to introduce some timing jitter. This has the further advantage that it decorrelates aliasing even more, smoothing it away into low-level noise, in a way that sounds "natural", "analog" and so on.

The timing jitter really needed to be introduced in the source signal generation, rather than the sample rate conversion, so that motivated me to write a [TickRateEngine](https://github.com/Vulpus-Labs/vulpus-labs-vm/blob/main/modules/rkw-1/src/main/java/com/vulpuslabs/modules/piezo/TickRateEngine.java) that would output _every_ beeper toggle produced by the imaginary Z80 machine code routine. The `TickRateEngine`'s beeper states are then observed by a [ClockRateEngine](https://github.com/Vulpus-Labs/vulpus-labs-vm/blob/main/modules/rkw-1/src/main/java/com/vulpuslabs/modules/piezo/ClockRateEngine.java) that properly integrates all the events occuring within each sample interval.

The integration is performed using piecewise constant integration. Essentially, for every state the underlying `TickRateEngine` passes through during a given sample interval, we multiply the beeper value for that state by the amount of time it holds for and add it to a rolling sum, dividing the final sum by the total interval width. So for example we might capture the fact that for 10% of the time the beeper was on, then it was off for 70% of the time, then it was on again for the remaining 20% of the time, and output 30% of our "on" voltage of +5v.

The code for this is a bit finickier, but it's a generally useful technique, and the results (while still authentically dirty) are much easier on the ears.