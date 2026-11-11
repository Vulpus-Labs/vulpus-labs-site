+++
title = "Vulpus Labs"

# The hero. `headline` is inline markdown: *emphasis* renders in the accent
# colour. The page body below is the paragraph under the headline.
[hero]
headline = "Three Synth Plugins you can *play right now*."
chips = ["CLAP", "VST3", "macOS", "Windows"]
highlight = "Web preview available now"

# Every product with a `webdemo` is featured here, in weight order; their
# names, taglines and blurbs come from their own pages.
[synths]
eyebrow = "The synths"
heading = "Virtual Analog, Digital FM, and 70s Retro"
text = """
Three fully-featured synth plugins with distinctive voices and capabilities. The full plugin version, engineered in Rust for high audio quality and CPU-efficiency, has been cross-compiled to WebAssembly and runs identically in the browser, with full MIDI control.

Each synth has a "random" button that generates random presets. If you find a voice you like, you can export it from the browser version and import it into the CLAP/VST3 plugin running in your DAW.
"""

# Products without a web demo are listed here as cards, followed by `cards`.
[others]
eyebrow = "Also from Vulpus Labs"
heading = "Tools for modular synthesis - build your own!"

[[others.cards]]
title = "Voltage Modular modules"
text = "Oscillators, filters and effects for Cherry Audio's Voltage Modular."
url = "/manuals/"
link = "Read the manuals"

[blog]
eyebrow = "From the blog"
heading = "How it is built"
text = "DSP notes, write-ups and the odd dead end."
+++

Three synthesizer plugins for macOS and
Windows. The full versions of all three run in a browser tab today — no install and no signup required.

Plugin releases in CLAP/VST3 format for Windows and macOS are on their way.
