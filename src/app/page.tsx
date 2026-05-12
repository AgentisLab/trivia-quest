"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { categories, Category, Question, Lang } from "@/data/questions"
import { ui } from "@/data/ui-strings"
import {
  GameLength,
  Difficulty,
  loadLang,
  loadGameLength,
  saveGameLength,
  loadDifficulty,
  saveDifficulty,
  getRandomMixSplit,
  triggerHaptic,
} from "@/lib/preferences"
import { recordGame } from "@/lib/stats"
import MenuScreen from "@/components/MenuScreen"
import GameScreen from "@/components/GameScreen"
import ResultsScreen from "@/components/ResultsScreen"
import TabBar from "@/components/TabBar"
import ThemeMount from "@/components/ThemeMount"

type GameState = "menu" | "playing" | "results"
type AnswerKey = "A" | "B" | "C" | "D"

interface AnswerRecord {
  question: Question
  selected: AnswerKey | null
  correct: boolean
}

const RANDOM_MIX_LENGTH = 15

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/** Filter questions by the user-selected difficulty.
 *  "mixte" = all, "easy" = easy only, "medium" = medium only, "hard" = hard + expert */
function filterByDifficulty(qs: Question[], diff: Difficulty): Question[] {
  if (diff === "mixte") return qs
  if (diff === "hard") return qs.filter((q) => q.difficulty === "hard" || q.difficulty === "expert")
  return qs.filter((q) => q.difficulty === diff)
}

function getRandomMixQuestions(diff: Difficulty): Question[] {
  const all = filterByDifficulty(categories.flatMap((c) => c.questions), diff)
  if (diff !== "mixte") {
    return shuffleArray(all).slice(0, RANDOM_MIX_LENGTH)
  }
  // balanced split across difficulties
  const split = getRandomMixSplit(RANDOM_MIX_LENGTH)
  const pool: Question[] = []
  ;(["easy", "medium", "hard", "expert"] as const).forEach((d) => {
    pool.push(...shuffleArray(all.filter((q) => q.difficulty === d)).slice(0, split[d]))
  })
  return shuffleArray(pool)
}

export default function Home() {
  const [hydrated, setHydrated] = useState(false)
  const [lang, setLang] = useState<Lang>("en")
  const [gameLength, setGameLength] = useState<GameLength>(10)
  const [difficulty, setDifficulty] = useState<Difficulty>("mixte")
  const [gameState, setGameState] = useState<GameState>("menu")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isRandomMix, setIsRandomMix] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerKey | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const startedAtRef = useRef<number>(0)

  useEffect(() => {
    setLang(loadLang())
    setGameLength(loadGameLength())
    setDifficulty(loadDifficulty())
    setHydrated(true)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "trivia-lang") setLang(loadLang())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const t = (key: string) => ui[key]?.[lang] || key

  const handleGameLengthChange = (next: GameLength) => {
    setGameLength(next)
    saveGameLength(next)
  }

  const handleDifficultyChange = (next: Difficulty) => {
    setDifficulty(next)
    saveDifficulty(next)
  }

  const beginRound = (qs: Question[]) => {
    setQuestions(qs)
    setCurrentIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowFeedback(false)
    setTimerKey(0)
    setStreak(0)
    setBestStreak(0)
    setElapsedMs(0)
    startedAtRef.current = Date.now()
    setGameState("playing")
  }

  const startGame = (category: Category) => {
    const filtered = filterByDifficulty(category.questions, difficulty)
    const shuffled = shuffleArray(filtered).slice(0, gameLength)
    setSelectedCategory(category)
    setIsRandomMix(false)
    beginRound(shuffled)
  }

  const startRandomMix = () => {
    const mixed = getRandomMixQuestions(difficulty)
    setSelectedCategory(null)
    setIsRandomMix(true)
    beginRound(mixed)
  }

  const finishRound = useCallback(
    (finalAnswers: AnswerRecord[]) => {
      const correct = finalAnswers.filter((a) => a.correct).length
      const total = finalAnswers.length
      const categoryId = isRandomMix ? null : selectedCategory?.id ?? null
      recordGame({ categoryId, correct, total, score: correct })
      setElapsedMs(Date.now() - startedAtRef.current)
      setGameState("results")
    },
    [isRandomMix, selectedCategory]
  )

  const handleAnswer = useCallback(
    (answer: AnswerKey | null) => {
      if (showFeedback) return
      const currentQuestion = questions[currentIndex]
      const isCorrect = answer === currentQuestion.answer

      const nextAnswers: AnswerRecord[] = [
        ...answers,
        { question: currentQuestion, selected: answer, correct: isCorrect },
      ]
      const nextStreak = isCorrect ? streak + 1 : 0
      const nextBest = Math.max(bestStreak, nextStreak)

      setSelectedAnswer(answer)
      setShowFeedback(true)
      setAnswers(nextAnswers)
      setStreak(nextStreak)
      setBestStreak(nextBest)

      const delay = isCorrect ? 1000 : 1500
      window.setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          finishRound(nextAnswers)
        } else {
          setCurrentIndex((prev) => prev + 1)
          setSelectedAnswer(null)
          setShowFeedback(false)
          setTimerKey((prev) => prev + 1)
        }
      }, delay)
    },
    [showFeedback, questions, currentIndex, answers, streak, bestStreak, finishRound]
  )

  const handleAnswerKey = useCallback(
    (answer: AnswerKey) => {
      triggerHaptic(8)
      handleAnswer(answer)
    },
    [handleAnswer]
  )

  const handleTimeUp = useCallback(() => {
    if (!showFeedback) handleAnswer(null)
  }, [showFeedback, handleAnswer])

  const resetToMenu = () => {
    setGameState("menu")
    setSelectedCategory(null)
    setIsRandomMix(false)
    setQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  if (!hydrated) {
    return <div className="min-h-screen" style={{ background: "var(--bg-1)" }} />
  }

  if (gameState === "menu") {
    return (
      <>
        <ThemeMount />
        <MenuScreen
          lang={lang}
          gameLength={gameLength}
          difficulty={difficulty}
          onGameLengthChange={handleGameLengthChange}
          onDifficultyChange={handleDifficultyChange}
          onSelectCategory={startGame}
          onRandomMix={startRandomMix}
          randomMixCount={RANDOM_MIX_LENGTH}
        />
        <TabBar />
      </>
    )
  }

  if (gameState === "playing") {
    const currentQuestion = questions[currentIndex]
    const categoryName = isRandomMix
      ? t("randomMix")
      : selectedCategory?.name[lang] ?? ""
    return (
      <>
        <ThemeMount />
        <GameScreen
          lang={lang}
          question={currentQuestion}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          streak={streak}
          categoryName={categoryName}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
          timerKey={timerKey}
          onAnswer={handleAnswerKey}
          onTimeUp={handleTimeUp}
          onQuit={resetToMenu}
        />
      </>
    )
  }

  const categoryName = isRandomMix
    ? t("randomMix")
    : selectedCategory?.name[lang] ?? ""

  return (
    <>
      <ThemeMount />
      <ResultsScreen
        lang={lang}
        answers={answers}
        categoryName={categoryName}
        totalElapsedMs={elapsedMs}
        bestStreak={bestStreak}
        onPlayAgain={() => (isRandomMix ? startRandomMix() : selectedCategory && startGame(selectedCategory))}
        onChooseAnother={resetToMenu}
      />
    </>
  )
}
