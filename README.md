# scroll-craft
An agent skill for building premium, immersive, scroll-driven websites. Works with Codex, Claude Code, and other coding agents.

## Live reference

`index.html` — **Sender — Engineering the Signal**, an immersive one-pager (Spanish) for a Chilean RF / broadcast engineering company. Vanilla HTML/CSS/JS with vendored GSAP + ScrollTrigger + Lenis (no build step):

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Motion system: preloader with decode text, Lenis smooth scroll, custom cursor, scramble/decode eyebrow, marquee tickers, word-scrub statement reveal, pinned process steps, pinned horizontal project gallery, sticky two-column product catalog (12 families), magnetic buttons, section HUD, grain overlay.
