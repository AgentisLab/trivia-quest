# Trivia Quest — v4 Design Rationale

## Direct response to the v3 feedback

> "I like the layout but I hate the color choices, it is way too bright and tacky. Should be basic iOS style palette of colors, stop with multiple effects and gradient, it is childish."

Heard. The v3 layout (bento grid, card-stack question, Live Activity pill, multi-screen results) was structurally sound — that survives. The 12-color rainbow, multi-stop gradients, animated category covers, glow halos, XP burst language, and 5-step Wrapped story were the noise. They are gone.

v4 is **dark monochrome with a single accent**. The reference apps are Apple Stocks (dark mode), Apple Books, Apple Fitness's end-of-workout summary, Things 3, and Linear. Quiet, content-first, typography-led.

---

## What I threw out from v3 (the boldest cuts)

1. **The 12-color category palette.** Sports red, Music magenta, Science cyan, Geography green, Food orange, Arts purple, Indigenous medicine-wheel quadrants — all gone. Every category tile shares `--bg-2` (#161616). Identity now comes from the monoline SF-Symbol-style icon and the typography, not from color.

2. **All multi-stop gradients.** The `red→purple→blue` Daily Challenge banner. The `white→gold→orange` mega-score numerals. The kinetic gradient text on hero titles. The per-tile `135deg` linear gradients. Gone. The only gradient that remains is one subtle single-color `#1a1a1c → #0e0e10` on the Featured tile for depth — and that's it.

3. **Animated cover art per category.** Pulsing pucks, equalizer bars, orbiting electrons, contour lines, leaf veins, twinkle bokeh, rotating globes, spinning compasses, drifting maples, ink swirls, medicine wheels, rotating film reels. All eleven of those effects gone. Tiles are static.

4. **The entire gamification stack.** No XP, no level badge, no flame icon, no `+10 XP · Streak ×7` floating burst, no Daily Challenge banner with "+50 XP boni" and "2,418 played today" social-proof. The Live Activity pill is now plain text: "12 day streak · 238 played" — no icons, no animation.

5. **The Spotify Wrapped 5-step story.** No story progress bars at the top. No tap-to-advance. No auto-advance every 2.5s. No floating confetti loop. No shimmer animation in the background. No kinetic typography reveal. Results = one clean Apple-Fitness-style summary screen.

6. **All glow halos and pulsing effects.** No glow on the timer fill. No pulse on the streak number. No flicker on the flame (which itself is gone). No tap-ring pulse. No box-shadow stacks layering inset highlights, drop shadows, and colored glow. Static.

7. **Confetti on correct answers + card flying out.** Gone. Correct = a small green check appears in the option's key slot, the wrong three options dim to 40%, and after ~1s the next question replaces the card. That's the entire celebration.

---

## v4 palette (dark only — the only mode in v4)

```
--bg-0:#000000      /* True black, OLED-friendly */
--bg-1:#0a0a0a      /* Page bg */
--bg-2:#161616      /* Tile / card bg */
--bg-3:#1f1f1f      /* Elevated surface (key slot, icon container) */
--separator:rgba(255,255,255,0.08)

--ink-100:#ffffff
--ink-80:rgba(255,255,255,0.78)
--ink-60:rgba(255,255,255,0.55)
--ink-40:rgba(255,255,255,0.38)

--accent:#ef3340    /* Canadian red — used ONLY for primary CTA + "New" tag */
--success:rgba(48,209,88,0.92)   /* iOS systemGreen — only for correct answer + accuracy stat */
--danger:rgba(255,69,58,0.92)    /* iOS systemRed — only for wrong answer */
```

That's the entire palette. 7 grays, 1 accent, 2 functional colors. No magenta, cyan, pink, orange, indigo, purple anywhere on the screen.

---

## What I kept from v3 (it earned its place)

- **Bento grid layout** with varied tile sizes: 1 hero featured · 2 medium trending · 9 standard · 1 spotlight (full-width). The composition works.
- **Card-stack question screen** with the slight `rotate(-1deg)` lean and two peek cards beneath. It still telegraphs forward motion without saying "swipe me."
- **Horizontal pulse-bar timer** at the top of the question card. Now solid white on `rgba(255,255,255,0.08)` — no green→amber→red gradient.
- **Live Activity pill** docked below the notch on every screen. Strip its content to plain text only.
- **SF Pro Rounded for display**, SF Pro Text for body. Sizes pulled back: hero numerals capped at 80px (was 160), question text 26px (was 30), section labels 12px not uppercase-tracked-160-letter-spacing.

---

## Self-rate against the Apple Stocks / Books / Things 3 target

Hits the target. The menu now feels like a quiet content app, not a gamified trivia arcade — every tile is the same surface, the eye is drawn to typography and structure rather than color. The question screen is calm enough that the question itself becomes the focal point. The results screen reads like a stat sheet, not a celebration. If you put v3-01-menu and v4-01-menu next to each other, v3 looks like Duolingo; v4 looks like an app I'd actually open at 9:41 PM on a Tuesday.
