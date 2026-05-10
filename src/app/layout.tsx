import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Canadian Trivia Quest | Quête trivia canadienne",
  description:
    "A bilingual trivia quiz game with 600+ Canadian-themed questions across 12 categories. Un jeu-questionnaire bilingue avec 600+ questions sur le Canada.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

/**
 * Pre-paint script. Runs before React hydrates so the correct theme is applied
 * before the first paint, eliminating the flash of wrong theme.
 *
 * Reads `trivia-theme` from localStorage:
 *   "light" | "dark" | "system" | (missing) -> default to system
 * For "system", consults prefers-color-scheme. The matching <meta theme-color>
 * is also patched here so iOS Safari's address bar matches on first paint.
 *
 * Wrapped in IIFE + try/catch: if anything throws (private mode, etc.) we keep
 * the SSR default of `data-theme="dark"`.
 */
const themeBootstrapScript = `
(function () {
  try {
    var saved = null;
    try { saved = localStorage.getItem('trivia-theme'); } catch (e) {}
    var pref = (saved === 'light' || saved === 'dark' || saved === 'system') ? saved : 'system';
    var resolved = pref;
    if (pref === 'system') {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolved = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', resolved);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', resolved === 'light' ? '#ffffff' : '#000000');
  } catch (e) {}
})();
`.trim()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        {/* Default theme-color matches the dark SSR fallback; the bootstrap
            script below patches it before paint when needed. */}
        <meta name="theme-color" content="#000000" />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
      </head>
      <body className="min-h-screen antialiased" style={{ background: "var(--bg-1)" }}>
        {children}
      </body>
    </html>
  )
}
