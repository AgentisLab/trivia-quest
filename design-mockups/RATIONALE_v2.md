# Canadian Trivia Quest — v2 Design Rationale

## Direct response to CEO feedback

> "I don't like the new design, it is too basic, a full redesign please with more mobile and apple colors"

v1 channeled Apple Settings. v2 channels **Apple Arcade**. Color is now the design — every category owns a saturated iOS-system-color gradient, the menu hero is a deep blue-purple gradient with glowing maple accents, the results screen explodes with confetti and a glowing trophy. The grouped table is gone. The hairline separators are gone. The pastel-tinted icon squares are gone. This reads as a **fun consumer game**, not a settings panel.

## What's fundamentally different from v1 (5 shifts)

1. **Menu = 2-column gradient grid, not a grouped table.** Each of the 12 categories is a square tile with its own iOS-system-color gradient identity (Sports → red, Science → teal, Music → magenta, etc.). Big oversized emoji as decorative backdrop, frosted name pill on top. Active press = scale 0.96 with spring physics.
2. **Random Mix is now a dark hero card** that lifts -22px into the menu hero band. Dark purple→red gradient, glowing white CTA pill, recommended badge in glass. It's the visual centerpiece, not a polite list item.
3. **Hero header is now a deep blue→purple gradient** (Apple Arcade hero treatment) with the title in 38px SF Pro Rounded weight 900, gradient-clipped accent on "Quest" / "trivia". Maple leaves float decoratively in the dark zone. Status bar text becomes white over the hero.
4. **Question screen carries the category color as a top banner** (not a quiet white nav). The timer is now an 86px glowing ring inside the banner — major visual centerpiece. Answer cards become **glassmorphic** (translucent 72% white over a tinted body, blur 20px / saturate 180%), with the press state showing a category-colored border glow. Correct answer triggers a 10-particle confetti burst + spring-lift animation.
5. **Results is brand new and feels like a celebration.** Dark gradient hero, animated glowing trophy/medal SVG with pulsing halo, mega 88px score number, 3-stat band (correct / accuracy / streak), per-difficulty colored breakdown bars, primary pink→orange gradient CTA pill, share-your-score stub.

## The 12-color category palette

Built from iOS system colors, each tile uses a 155° linear-gradient between the light and deep tones below.

| Category | Light | Deep | iOS system color |
| --- | --- | --- | --- |
| Canadian Sports | `#ff7a85` | `#d70015` | systemRed |
| Science & Tech | `#5fdcf0` | `#008299` | systemTeal |
| Geography | `#74e88a` | `#248a3d` | systemGreen |
| Biology & Nature | `#5be6db` | `#0c817b` | systemMint |
| Pop Culture | `#ff7aab` | `#d30f45` | systemPink |
| World Knowledge | `#5badff` | `#0040dd` | systemBlue |
| Canadian History | `#d3a070` | `#7f6545` | systemBrown |
| Food & Drink | `#ffb35e` | `#c93400` | systemOrange |
| Arts & Literature | `#d18cf0` | `#8944ab` | systemPurple |
| Indigenous Peoples | `#8c8bf0` | `#3634a3` | systemIndigo |
| Canadian Music | `#f78bc0` | `#c01876` | systemPink/magenta |
| Cinema & TV | `#ffa86b` | `#d70015` | systemRed/orange |

Hero gradient: `#1a1148 → #2c1769 → #4a1d8c` with red+blue radial glows. Random Mix: `#1a1148 → #d52b1e`. Trophy gold: `#fff5b8 → #ffd24a → #c98a14`.

## What I'm keeping from v1

- **Light theme overall.** Body backgrounds remain on light tinted variants of `#f7f5fb`. Dark accent zones are limited to hero, banner, and results celebration — earned moments.
- **iOS visual language.** Status bar pattern, home indicator, tab bar with 44pt touch targets, segmented language toggle, translucent surfaces with backdrop-filter.
- **SF Pro typography stack** — but upgraded to **SF Pro Rounded** for display/title roles (with Nunito as the loaded fallback). Same `-0.025em` tracking on display sizes, same weight extremes (500/700/900).
- **Accessibility primitives**: 44px+ touch targets, AA contrast on all text, focus-visible rings inherited from buttons.
- **Bilingual stress test.** Each frame shipped with a twin EN/FR variant where the FR copy is 18–30% longer; layout holds.
- **Category list, scoring math, 20s timer, 10-question rounds.** Game flow is unchanged — only the surface is reskinned.

## Judgment calls I made

- **12 categories, not 10.** The data already includes Music + Cinema as #11/#12 (per `src/data/questions.ts`); v1 only showed 10. v2 displays all 12 — needed for a 2-col grid (3 rows of 4 = clean grid; 5 rows × 2 = 12 tiles, fits without scroll-cliff).
- **Random Mix = 15 questions.** Reconciled the v1 ambiguity by going with the code (`build 15 questions for Random Mix`), not the ui-strings copy.
- **Results = 3 tiers, two shown.** Personal best (≥90%, gold trophy + pink-purple hero) and mid-tier (60–89%, silver medal + blue hero). A bronze/encouragement tier for &lt;60% would follow the same template — just different gradient + medal asset. Didn't render a third frame to keep the deliverable tight.
- **Confetti is static SVG in the mockup; canvas-confetti at runtime.** Mockup constraint rules out npm deps, so I rendered a 10-particle scatter inline as a visual stand-in.
