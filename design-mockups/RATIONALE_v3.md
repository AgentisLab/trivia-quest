# Canadian Trivia Quest — v3 Design Rationale

## Direct response to "MORE modern app metaphor"

v2 looked like a themed website with iOS chrome. v3 looks like an **Apple Arcade × Spotify Wrapped × Duolingo native app**. The shifts are not cosmetic -- the frame, the navigation gestures, the live state model, and the celebration arc are all native-app primitives now. If v2 was "trivia game in a browser," v3 is "the trivia app you'd download from the App Store and tell your friend about."

## Top 5 fundamental shifts vs v2

1. **Dark canvas + true glass.** v2 was light-mode default. v3 ships dark as the only mode (deep navy `#0a0a14` → `#14122c`). Vibrant content pops. Glass surfaces use real specs: `backdrop-filter: blur(40px) saturate(180%)`, inner-highlight `inset 0 1px 0 rgba(255,255,255,0.16)`, dark base `rgba(0,0,0,0.55)`, floating shadow. Light mode is a deferred Settings toggle.

2. **Bento grid with varied tile sizes + animated cover art.** Gone is the uniform 2-col grid. v3 has 1 hero featured tile (Random Mix with floating blob kaleidoscope), 2 medium "Trending Tonight" tiles (Music = pulsing equalizer, Sports = puck pulse + rink rings), 9 standard tiles, and Cinema spans full-width as "NEW THIS WEEK." Each of the 12 categories has its **own** animated SVG/CSS ornament -- not a static gradient. Music has equalizer bars. Science has orbiting electrons. Geo has contour lines. World has a rotating globe. Indigenous has a medicine wheel. Cinema has a spinning film reel. Apple Arcade tile-as-cover-art logic.

3. **Live Activity pill + gamification loop.** Dynamic-Island-style pill docks below the notch on every screen. Menu state shows streak/XP/level. In-game state morphs to show category swatch · Q 7/10 · streak with flickering flame. After a correct answer, the streak number ticks up live in the pill. Daily Challenge banner above the bento (Duolingo loop pressure: "5 Music Qs in 60s · +50 XP boni · 2,418 played today · ends 11:59 PM"). +XP badge floats up after each correct answer. Level number is always visible.

4. **Card stack question screen with horizontal pulse timer.** v2's circular timer ring is gone. v3 puts a story-style horizontal progress bar at the top of the question card (Instagram/Snapchat lineage), color-shifting green→amber→red with a glowing tick at the leading edge. The active question is a card with a `rotate(-1.2deg)` lean -- two more cards peek from below, telegraphing forward motion and swipe-ability. Glass option pills sit on the card with category-tinted backgrounds. Correct = card lifts, confetti scatters, +XP floats up, wrong answers dim, streak ticks in the pill, card flies up out of frame, next slides in.

5. **Spotify Wrapped-style 5-step results story.** v2's "results screen" is replaced by a vertical story: (1) "You played Canadian Sports" full-bleed hero, (2) **Score reveal** with 160px gradient-clipped numerals, (3) per-difficulty animated bars, (4) Streak/XP/Level with flickering flame, (5) Share moment with copyable card. Tap-to-advance or auto-advance @ 2.5s. Story progress bars at top. Floating confetti loops endlessly behind the content. Kinetic typography (48px display, gradient text, glow halos).

## Dark-mode color palette

```
/* Canvas */
--bg-0:#07060f   --bg-1:#0a0a14   --bg-2:#14122c   --bg-3:#1c1840

/* Ink */
--ink-100:#ffffff
--ink-80:rgba(255,255,255,0.82)   --ink-60:rgba(255,255,255,0.62)
--ink-40:rgba(255,255,255,0.42)   --ink-20:rgba(255,255,255,0.18)

/* Glass */
--glass-bg:rgba(255,255,255,0.06)         --glass-bg-strong:rgba(255,255,255,0.10)
--glass-border:rgba(255,255,255,0.12)     --glass-highlight:rgba(255,255,255,0.18)

/* Category accents (dark-tuned, raised saturation/luminance vs v2) */
Sports     #ff5a6c → #ff2d55       Pop        #ff7ab8 → #ff2e7e
Science    #5fe3ff → #0ab8d4       World      #6cb6ff → #0a72ff
Geo        #7dffa4 → #1fc04f       History    #e8b889 → #a37044
Bio        #5cf2da → #0fbfa3       Food       #ffbe5c → #ff7a1a
Arts       #d99dff → #a04ed7       Indigenous #9c9bff → #5249f0
Music      #ff8fd1 → #d61b8f       Cinema     #ffaa6e → #ff3d3d

/* Hero gradients */
Daily Challenge:  #ff2e7e → #7c2bff → #0a72ff
Featured tile:    #1a0b3d → #3a0a6c → #6a0fb0
Results hero:     #1a0a3d → #3a0a6c → #1a0a3d  (with #ff2e7e + #7c2bff + #0a72ff radials)
Score numerals:   white → #ffd24a → #ff7a1a
```

## What I threw out from v2 (no kept-alive corpses)

- **Light theme as default.** Gone. Dark only, light is deferred.
- **Uniform 2-col grid.** Gone. Bento with 4 tile sizes (full-width hero · medium · standard · full-width spotlight).
- **Static category gradients.** Gone. Every tile has its own animated cover art.
- **Circular timer ring.** Gone. Horizontal pulse bar at top of card.
- **Single-screen results page.** Gone. 5-step Wrapped story with per-step kinetic typography.
- **White surfaces / off-white question card.** Gone. Everything dark, vibrant glass on top.
- **Random Mix as a separate hero band that sits between header and grid.** Gone. It's the featured tile inside the bento now.
- **Maple-leaves-as-background-decoration on the menu hero.** Gone. Maple is now a subtle texture inside the Featured tile and the Food tile, not the hero language.

## Judgment calls I made

- **No tab bar on the question/results screens** -- a quit/X button replaces it, because tab bars during gameplay break flow. Tab bar persists on Menu only. (App Store apps treat gameplay as modal.)
- **Question card uses Sports red as the demo accent**, not a neutral palette. Each category's gameplay screen tints the same skeleton with that category's gradient -- the system extends naturally to all 12.
- **Live activity pill stays full-width visible** during gameplay, even though space is tight. It's the trust contract: the player always knows their streak isn't being hidden from them.
- **5 story steps, not 7 or 3.** Wrapped uses many; the trivia loop is shorter. 5 is the sweet spot: opener, score, breakdown, gamification reveal, share.

## Open questions for CEO

1. **Daily Challenge content source** -- is it manually curated (RnD picks one each morning) or algorithmic (random category × random subset)? Affects backend scope.
2. **Share moment** -- should the share image be auto-generated server-side as a 1080×1920 story-card PNG, or do we just deep-link to a results URL? OG-image generation is a 1-day Dev task if we want it; URL-only is free.
