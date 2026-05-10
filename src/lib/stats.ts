export interface CategoryStats {
  played: number
  correct: number
  total: number
  best: number
}

export interface TriviaStats {
  totalGames: number
  totalCorrect: number
  totalQuestions: number
  bestScore: number
  currentStreak: number
  longestStreak: number
  perCategory: { [categoryId: number]: CategoryStats }
}

const STORAGE_KEY = "trivia-stats"
const WIN_THRESHOLD = 0.7

export const emptyStats = (): TriviaStats => ({
  totalGames: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  bestScore: 0,
  currentStreak: 0,
  longestStreak: 0,
  perCategory: {},
})

export function loadStats(): TriviaStats {
  if (typeof window === "undefined") return emptyStats()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStats()
    const parsed = JSON.parse(raw) as Partial<TriviaStats>
    return { ...emptyStats(), ...parsed, perCategory: parsed.perCategory ?? {} }
  } catch {
    return emptyStats()
  }
}

export function saveStats(stats: TriviaStats): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function clearStats(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

interface RecordGameInput {
  categoryId: number | null
  correct: number
  total: number
  score: number
}

export function recordGame({ categoryId, correct, total, score }: RecordGameInput): TriviaStats {
  const prev = loadStats()
  const isWin = total > 0 && correct / total >= WIN_THRESHOLD

  const next: TriviaStats = {
    totalGames: prev.totalGames + 1,
    totalCorrect: prev.totalCorrect + correct,
    totalQuestions: prev.totalQuestions + total,
    bestScore: Math.max(prev.bestScore, score),
    currentStreak: isWin ? prev.currentStreak + 1 : 0,
    longestStreak: prev.longestStreak,
    perCategory: { ...prev.perCategory },
  }
  next.longestStreak = Math.max(next.longestStreak, next.currentStreak)

  if (categoryId !== null) {
    const existing = prev.perCategory[categoryId] ?? { played: 0, correct: 0, total: 0, best: 0 }
    next.perCategory[categoryId] = {
      played: existing.played + 1,
      correct: existing.correct + correct,
      total: existing.total + total,
      best: Math.max(existing.best, score),
    }
  }

  saveStats(next)
  return next
}
