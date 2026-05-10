import { Lang } from "@/data/types"

export type GameLength = 5 | 10 | 20

const LANG_KEY = "trivia-lang"
const LENGTH_KEY = "trivia-game-length"
const SOUND_KEY = "trivia-sound"
const HAPTICS_KEY = "trivia-haptics"

export const DEFAULT_GAME_LENGTH: GameLength = 10
export const GAME_LENGTHS: GameLength[] = [5, 10, 20]

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
} as const

interface RandomMixSplit {
  easy: number
  medium: number
  hard: number
  expert: number
}

export function getRandomMixSplit(length: GameLength): RandomMixSplit {
  switch (length) {
    case 5:  return { easy: 1, medium: 2, hard: 1, expert: 1 }
    case 10: return { easy: 2, medium: 3, hard: 3, expert: 2 }
    case 20: return { easy: 4, medium: 7, hard: 5, expert: 4 }
  }
}

export function triggerHaptic(pattern: number | number[] = 12): void {
  if (typeof window === "undefined") return
  if (!loadBoolPref(HAPTICS_KEY)) return
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try { navigator.vibrate(pattern) } catch { /* no-op */ }
  }
}
