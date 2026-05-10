"use client"

import { useCallback, useEffect, useState } from "react"
import {
  PREF_KEYS,
  ResolvedTheme,
  ThemePreference,
  applyTheme,
  loadTheme,
  resolveTheme,
  saveTheme,
} from "./preferences"

/**
 * Hook that owns the active theme preference + resolved theme.
 * - Reads `trivia-theme` from localStorage on mount.
 * - Re-resolves live when the system pref changes (only relevant for "system").
 * - Re-resolves when another tab updates `trivia-theme` (storage event).
 * - Applies the resolved theme to <html data-theme="..."> + <meta theme-color>.
 *
 * SSR safety: until `hydrated` is true, the hook reports `theme = "system"` and
 * `resolved = "dark"` (matching the SSR fallback in layout.tsx and the inline
 * pre-paint script). Components that need to gate on the real value should use
 * `hydrated`.
 */
export function useTheme(): {
  theme: ThemePreference
  resolved: ResolvedTheme
  hydrated: boolean
  setTheme: (next: ThemePreference) => void
} {
  const [theme, setThemeState] = useState<ThemePreference>("system")
  const [resolved, setResolved] = useState<ResolvedTheme>("dark")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const initial = loadTheme()
    const initialResolved = resolveTheme(initial)
    setThemeState(initial)
    setResolved(initialResolved)
    applyTheme(initialResolved)
    setHydrated(true)
  }, [])

  // Live system pref reactivity (only acts when pref === "system").
  useEffect(() => {
    if (!hydrated) return
    if (theme !== "system") return
    if (typeof window === "undefined" || !window.matchMedia) return

    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => {
      const next: ResolvedTheme = e.matches ? "dark" : "light"
      setResolved(next)
      applyTheme(next)
    }
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [theme, hydrated])

  // Cross-tab sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== PREF_KEYS.theme) return
      const next = loadTheme()
      const nextResolved = resolveTheme(next)
      setThemeState(next)
      setResolved(nextResolved)
      applyTheme(nextResolved)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const setTheme = useCallback((next: ThemePreference) => {
    saveTheme(next)
    const nextResolved = resolveTheme(next)
    setThemeState(next)
    setResolved(nextResolved)
    applyTheme(nextResolved)
  }, [])

  return { theme, resolved, hydrated, setTheme }
}
