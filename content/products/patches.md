+++
title = "Patches"
date = 2026-06-07
type = "products"
weight = 10
tagline = "A modular audio instrument with a text-based patch language"
accent = "#3fd8b8"
status = "shipping"
version = "0.7.3-rc.2"
release = "v0.7.3-rc.2"
releaseRepo = "Vulpus-Labs/patches"
formats = ["CLAP", "Standalone"]
license = "See LICENSE"

[[downloads]]
platform = "macOS"
format = "CLAP plugin + player"
arch = "Apple Silicon"
asset = "patches-0.7.3-rc.2-macos-aarch64.tar.gz"

[[downloads]]
platform = "macOS"
format = "CLAP plugin + player"
arch = "Intel"
asset = "patches-0.7.3-rc.2-macos-x86_64.tar.gz"

[[downloads]]
platform = "Windows"
format = "CLAP plugin + player"
arch = "x64"
asset = "patches-0.7.3-rc.2-windows-x86_64.zip"

[[extras]]
label = "VS Code extension — macOS (Apple Silicon)"
asset = "patches-vscode-darwin-arm64-0.0.1.vsix"

[[extras]]
label = "VS Code extension — macOS (Intel)"
asset = "patches-vscode-darwin-x64-0.0.1.vsix"

[[extras]]
label = "VS Code extension — Windows x64"
asset = "patches-vscode-win32-x64-0.0.1.vsix"

[[extras]]
label = "VS Code extension — Linux x64"
asset = "patches-vscode-linux-x64-0.0.1.vsix"
+++

**Patches** describes a graph of oscillators, filters, envelopes, sequencers,
and effects in a plain-text `.patches` file, then runs it in real time — as a
CLAP plugin in your DAW, as a standalone instrument, or as a self-contained
sequenced piece.

Edit and save the file while audio is playing. The engine re-plans the graph
and swaps it in without interrupting the audio stream or resetting module
state.

```patches
patch {
    module kbd : PolyMidiToCv
    module osc : PolyOsc
    module env : PolyAdsr {
        attack: 0.005, decay: 0.1, sustain: 0.7, release: 0.3
    }
    module vca : PolyVca
    module mix : PolyToMono
    module out : AudioOut

    kbd.trigger -> env.trigger
    kbd.gate    -> env.gate
    kbd.voct    -> osc.voct

    osc.sine    -> vca.in
    env.out     -> vca.cv
    vca.out     -> mix.in
    mix.out -[0.2]-> out.in
}
```

## Three surfaces

- **CLAP plugin** — load Patches in any CLAP-compatible DAW.
- **Standalone player** — `patch_player hello.patches`. The player watches the
  file and hot-reloads on save without interrupting audio.
- **VS Code extension** — syntax highlighting and tooling for `.patches` files.

## Documentation

The full manual covers the DSL, the module library, and OS-specific install
steps: <https://vulpus-labs.github.io/patches/>.

The VS Code extension ships alongside each release — download the `.vsix` for
your platform above and install it with:

```sh
code --install-extension patches-vscode-<platform>-<arch>-<ver>.vsix
```
