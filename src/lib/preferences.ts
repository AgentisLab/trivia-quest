import { Lang } from "@/data/types"

export type GameLength = 5 | 10 | 20
export type Difficulty = "mixte" | "easy" | "medium" | "hard"
export type ThemePreference = "system" | "light" | "dark"
export type ResolvedTheme = "light" | "dark"

const LANG_KEY = "trivia-lang"
const LENGTH_KEY = "trivia-game-length"
const DIFFICULTY_KEY = "trivia-difficulty"
const SOUND_KEY = "trivia-sound"
const HAPTICS_KEY = "trivia-haptics"
const THEME_KEY = "trivia-theme"

export const THEME_OPTIONS: ThemePreference[] = ["system", "light", "dark"]

/* Color used by <meta name="theme-color"> per resolved theme. Matches --bg-0. */
export const THEME_COLOR: Record<ResolvedTheme, string> = {
  dark: "#000000",
  light: "#ffffff",
}

export const DEFAULT_GAME_LENGTH: GameLength = 10
export const GAME_LENGTHS: GameLength[] = [5, 10, 20]

export const DEFAULT_DIFFICULTY: Difficulty = "mixte"
export const DIFFICULTIES: Difficulty[] = ["mixte", "easy", "medium", "hard"]

export function loadLang(): Lang {
  if (typeof window === "undefined") return "en"
  const saved = localStorage.getItem(LANG_KEY)
  return saved === "fr" || saved === "en" ? saved : "en"
}

export function saveLang(lang: Lang): void {
  if (typeof window === "undefined") return
  localStorage.setItem(LANG_KEY, lang)
}

export function loadGameLength(): GameLength {
  if (typeof window === "undefined") return DEFAULT_GAME_LENGTH
  const raw = localStorage.getItem(LENGTH_KEY)
  const parsed = raw ? Number(raw) : NaN
  return GAME_LENGTHS.includes(parsed as GameLength) ? (parsed as GameLength) : DEFAULT_GAME_LENGTH
}

export function saveGameLength(length: GameLength): void {
  if (typeof window === "undefined") return
  localStorage.setItem(LENGTH_KEY, String(length))
}

export function loadDifficulty(): Difficulty {
  if (typeof window === "undefined") return DEFAULT_DIFFICULTY
  const saved = localStorage.getItem(DIFFICULTY_KEY)
  return DIFFICULTIES.includes(saved as Difficulty) ? (saved as Difficulty) : DEFAULT_DIFFICULTY
}

export function saveDifficulty(difficulty: Difficulty): void {
  if (typeof window === "undefined") return
  localStorage.setItem(DIFFICULTY_KEY, difficulty)
}

export function loadBoolPref(key: typeof SOUND_KEY | typeof HAPTICS_KEY): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(key) === "1"
}

export function saveBoolPref(key: typeof SOUND_KEY | typeof HAPTICS_KEY, value: boolean): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, value ? "1" : "0")
}

export const PREF_KEYS = {
  sound: SOUND_KEY,
  haptics: HAPTICS_KEY,
  theme: THEME_KEY,
} as const

export function loadTheme(): ThemePreference {
  if (typeof window === "undefined") return "system"
  const saved = localStorage.getItem(THEME_KEY)
  return saved === "light" || saved === "dark" || saved === "system" ? saved : "system"
}

export function saveTheme(theme: ThemePreference): void {
  if (typeof window === "undefined") return
  localStorage.setItem(THEME_KEY, theme)
}

export function systemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === "system") return systemPrefersDark() ? "dark" : "light"
  return pref
}

export function applyTheme(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return
  document.documentElement.dataset.theme = resolved
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute("content", THEME_COLOR[resolved])
}

interface RandomMixSplit {
  easy: number
  medium: number
  hard: number
  expert: number
}

export function getRandomMixSplit(length: number): RandomMixSplit {
  switch (length) {
    case 5:  return { easy: 1, medium: 2, hard: 1, expert: 1 }
    case 10: return { easy: 2, medium: 3, hard: 3, expert: 2 }
    case 15: return { easy: 3, medium: 5, hard: 4, expert: 3 }
    case 20: return { easy: 4, medium: 7, hard: 5, expert: 4 }
    default: {
      const easy = Math.max(1, Math.round(length * 0.2))
      const medium = Math.max(1, Math.round(length * 0.35))
      const hard = Math.max(1, Math.round(length * 0.27))
      const expert = Math.max(1, length - easy - medium - hard)
      return { easy, medium, hard, expert }
    }
  }
}

export function triggerHaptic(pattern: number | number[] = 12): void {
  if (typeof window === "undefined") return
  if (!loadBoolPref(HAPTICS_KEY)) return
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try { navigator.vibrate(pattern) } catch { /* no-op */ }
  }
}
