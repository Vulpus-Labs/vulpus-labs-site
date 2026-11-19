---
id: polykritter-2026-11
endpoint: https://surveys.vulpuslabs.com/polykritter
send: on
---

<!--
The PolyKritter survey (silkscreen-survey.mjs reads this).

Each `## name` is one screen of the text box. Its paragraphs are what
Dominic says; a blank line between them is a line break in the box. Its
options are lines `- A) label -> next`, where `next` is another screen's
name, or `close` (the box fades out, nothing is sent).

A screen with no options is an ending: reaching it sends the answers to
`endpoint` (with `send: on`; `send: off` logs them to the console), and
any key closes the box. The first screen is where it starts.

It's asked after two minutes on the page: once answered, never again in
that browser; after "Not now", not for 14 days. `?survey` in the URL asks
anyway (`?survey=5` after five seconds); `&test` shows the answers on the
page instead of sending them. On localhost both are on.
-->

## intro

Hi! I'm Dominic Fox, Chief Audio Science Whiz at Vulpus Labs!...

I'd love to know what you think of PolyKritter...

Would you be willing to answer a few questions?

- A) Sure! -> like
- B) Not now, thanks -> close

## like

Great! First question...

Do you like PolyKritter?

- A) It's great! -> thanks
- B) It's OK... -> thanks
- C) It's terrible! -> candour

## thanks

Thanks!

How much would you be willing to pay for a CLAP/VST3 PolyKritter plugin?

- A) $20 -> bye
- B) $10 -> bye
- C) $5 -> bye
- D) Nothing! -> bye

## candour

Thank you for your candour.

## bye

Thank you for your answers. Enjoy PolyKritter!
