# Canadian Trivia Quest — iOS-Native Redesign Rationale

## The "iOS feel" goal

Apple-quality means restraint. The current build has the right bones (clean grid, working flow) but reads as a generic web app -- saturated red header, cartoonish cards, web-typical card grid, no sense of native chrome. The redesign treats this like an Apple-Arcade-tier first-party trivia app: system typography, system gray surfaces, color used as accent (not wallpaper), translucent blurred bars, an iOS Large Title that scrolls into a compact nav, a bottom tab bar, and a circular timer that breathes red only when it matters. Goal: a player who screenshots this thinks it shipped from Cupertino.

## Key design decisions

**Typography.** SF Pro Display via the system stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display"...`), Inter as the loaded fallback so the mockup works on non-Apple machines. Apple's HIG type scale: Large Title 34/800/-0.025em, Title 1 28/700, Headline/Body 17, Footnote 13. Bold weight extremes (500/700/800), tight tracking on display sizes -- this alone moves the design from "Bootstrap quiz" to "iOS app".

**Color.** Canadian red demoted from dominant background to accent: logo mark, primary CTA, selected state, score pill, progress fill, danger timer. Page lives on iOS systemGroupedBackground (#f2f2f7) with white grouped lists. Each category icon gets a tinted square (12px radius, soft pastel) -- visually identifies the topic without screaming. This is how Settings, Health, Notes treat color.

**Layout.** Menu becomes an iOS grouped table (one card containing 10 inset rows with hairline separators) instead of a web card grid. Random Mix is promoted to a hero "featured" card with maple-tinted gradient -- positions it as the recommended starting point. Bottom tab bar reserves space for Stats / Settings (stubs now, real surfaces later -- per the "every backend capability needs a UI" rule). Question screen drops the tab bar (max real estate), keeps only Quit + category title + score in a translucent blurred header.

**Motion.** Spec'd in CSS comments and live where possible: spring scale 0.97 on press (200ms ease-out), green pulse + spring-in checkmark on correct, 4-cycle shake on wrong, horizontal swipe between questions (iOS push-nav feel), timer ring color transitions at 10s (amber) and 5s (red + 1.2s pulse). All purposeful: confirm action, show progress, draw attention to time pressure.

**Translucency & depth.** Nav bars use `backdrop-filter: blur(24px) saturate(180%)` over the systemGray background -- the iOS hallmark. Cards use a layered shadow (1px sharp + 16px diffuse) at low opacity, lifting on hover. No drop shadows on buttons -- iOS doesn't.

## What's intentionally NOT changed

- Game flow (menu → playing → results) and the 10-question round structure
- Scoring math (1/2/3/4 pts by easy/medium/hard/expert)
- 20-second per-question timer
- Language toggle behavior (persists to localStorage, applies everywhere)
- The 10 categories and their existing emoji icons (kept where they add personality; replaced with monoline SF-Symbol-style only for the tab bar)
- The questions themselves and the difficulty taxonomy

## Open questions for the CEO

1. **Tab bar destinations.** Stats and Settings are stubbed. Stats could surface streaks / per-category accuracy / personal bests. Settings would house language toggle, sound on/off, haptics, "reset progress." Want both built in v2, or just Stats first?
2. **Streaks & persistence.** Should we persist score history across rounds (enables stats, leaderboards, "personal best" badges)? Currently the app is fully ephemeral -- lose it on refresh.
3. **Random Mix length.** Code currently builds 15 questions for Random Mix (3+5+4+3 by difficulty) but the menu copy in `ui-strings.ts` says "10 questions per game". Mockup shows "15 questions" on the featured card. Reconcile: is Random Mix 10 or 15?
4. **Sounds & haptics.** iOS-native means subtle audio cues + haptic pulses on correct/wrong. Out of scope for static mockups; want me to spec them for Dev?
5. **Compact vs. large title.** Production should animate the Large Title shrinking into the compact nav title on scroll (iOS-standard). That's CSS scroll-driven animation -- worth the implementation cost or skip for v1?
