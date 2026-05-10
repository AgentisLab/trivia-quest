"use client"

import { useTheme } from "@/lib/useTheme"

/**
 * Mount-only component. Wires up the theme hook so the live system-pref
 * listener and cross-tab sync are always active. Render once, near the root
 * of every page (or in a shared layout).
 *
 * Intentionally renders nothing — the inline pre-paint script in layout.tsx
 * already painted the right theme; this just keeps it reactive after hydration.
 */
export default function ThemeMount() {
  useTheme()
  return null
}
