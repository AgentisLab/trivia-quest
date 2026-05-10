"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { categories, Category, Question, Lang } from "@/data/questions"
import {
  GameLength,
  loadLang,
  saveLang,
  loadGameLength,
  saveGameLength,
  getRandomMixSplit,
  triggerHaptic,
} from "@/lib/preferences"
import { recordGame } from "@/lib/stats"
import MenuScreen from "@/components/MenuScreen"
import GameScreen from "@/components/GameScreen"
import ResultsScreen from "@/components/ResultsScreen"
import TabBar from "@/components/TabBar"
import { ui } from "@/data/ui-strings"

type GameState = "menu" | "playing" | "results"
type AnswerKey = "A" | "B" | "C" | "D"

interface AnswerRecord {
  question: Question
  selected: AnswerKey | null
  correct: boolean
}

const POINTS: Record<Question["difficulty"], number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function getRandomMixQuestions(length: GameLength): Question[] {
  const split = getRandomMixSplit(length)
  const all = categories.flatMap((c) => c.questions)
  const pool: Question[] = []
  ;(["easy", "medium", "hard", "expert"] as const).forEach((diff) => {
    pool.push(...shuffleArray(all.filter((q) => q.difficulty === diff)).slice(0, split[diff]))
  })
  return shuffleArray(pool)
}

export default function Home() {
  const [hydrated, setHydrated] = useState(false)
  const [lang, setLang] = useState<Lang>("en")
  const [gameLength, setGameLength] = useState<GameLength>(10)
  const [gameState, setGameState] = useState<GameState>("menu")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isRandomMix, setIsRandomMix] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerKey | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [timerKey, setTimerKey] = useState(0)

  useEffect(() => {
    setLang(loadLang())
    setGameLength(loadGameLength())
    setHydrated(true)
  }, [])

  const handleLangChange = (next: Lang) => {
    setLang(next)
    saveLang(next)
  }

  const handleGameLengthChange = (next: GameLength) => {
    setGameLength(next)
    saveGameLength(next)
  }

  const t = (key: string) => ui[key]?.[lang] || key

  const startGame = (category: Category) => {
    const shuffled = shuffleArray(category.questions).slice(0, gameLength)
    setSelectedCategory(category)
    setIsRandomMix(false)
    setQuestions(shuffled)
    setCurrentIndex(0)
    setScore(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowFeedback(false)
    setTimerKey(0)
    setGameState("playing")
  }

  const startRandomMix = () => {
    const mixed = getRandomMixQuestions(gameLength)
    setSelectedCategory(null)
    setIsRandomMix(true)
    setQuestions(mixed)
    setCurrentIndex(0)
    setScore(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowFeedback(false)
    setTimerKey(0)
    setGameState("playing")
  }

  const finishGame = useCallback(
    (finalAnswers: AnswerRecord[], finalScore: number) => {
      const correct = finalAnswers.filter((a) => a.correct).length
      const categoryId = isRandomMix ? null : selectedCategory?.id ?? null
      recordGame({
        categoryId,
        correct,
        total: finalAnswers.length,
        score: finalScore,
      })
      setGameState("results")
    },
    [isRandomMix, selectedCategory]
  )

  const handleAnswer = useCallback(
    (answer: AnswerKey | null) => {
      if (showFeedback) return

      const currentQuestion = questions[currentIndex]
      const isCorrect = answer === currentQuestion.answer
      const points = isCorrect ? POINTS[currentQuestion.difficulty] : 0

      const nextAnswers: AnswerRecord[] = [
        ...answers,
        { question: currentQuestion, selected: answer, correct: isCorrect },
      ]
      const nextScore = score + points

      setSelectedAnswer(answer)
      setShowFeedback(true)
      setScore(nextScore)
      setAnswers(nextAnswers)

      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          finishGame(nextAnswers, nextScore)
        } else {
          setCurrentIndex((prev) => prev + 1)
          setSelectedAnswer(null)
          setShowFeedback(false)
          setTimerKey((prev) => prev + 1)
        }
      }, 1500)
    },
    [showFeedback, questions, currentIndex, answers, score, finishGame]
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

  const resetGame = () => {
    setGameState("menu")
    setSelectedCategory(null)
    setIsRandomMix(false)
    setQuestions([])
    setCurrentIndex(0)
    setScore(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  const maxScore = useMemo(
    () => questions.reduce((sum, q) => sum + POINTS[q.difficulty], 0),
    [questions]
  )

  const currentLabel = isRandomMix
    ? { icon: "🎲", name: t("randomMix"), id: null as number | null }
    : selectedCategory
    ? { icon: selectedCategory.icon, name: selectedCategory.name[lang], id: selectedCategory.id }
    : { icon: "", name: "", id: null }

  if (!hydrated) {
    // Avoid hydration mismatch: render a neutral background until client preferences load.
    return <div className="min-h-screen" style={{ background: "var(--ios-bg)" }} />
  }

  if (gameState === "menu") {
    return (
      <>
        <MenuScreen
          lang={lang}
          onLangChange={handleLangChange}
          gameLength={gameLength}
          onGameLengthChange={handleGameLengthChange}
          onSelectCategory={startGame}
          onRandomMix={startRandomMix}
        />
        <TabBar />
      </>
    )
  }

  if (gameState === "playing") {
    const currentQuestion = questions[currentIndex]
    return (
      <GameScreen
        lang={lang}
        question={currentQuestion}
        questionIndex={currentIndex}
        totalQuestions={questions.length}
        score={score}
        categoryIcon={currentLabel.icon}
        categoryName={currentLabel.name}
        categoryId={currentLabel.id}
        selectedAnswer={selectedAnswer}
        showFeedback={showFeedback}
        timerKey={timerKey}
        onAnswer={handleAnswerKey}
        onTimeUp={handleTimeUp}
        onQuit={resetGame}
      />
    )
  }

  return (
    <ResultsScreen
      lang={lang}
      score={score}
      maxScore={maxScore}
      answers={answers}
      categoryIcon={currentLabel.icon}
      categoryName={currentLabel.name}
      isRandomMix={isRandomMix}
      onPlayAgain={() => (isRandomMix ? startRandomMix() : selectedCategory && startGame(selectedCategory))}
      onChooseAnother={resetGame}
    />
  )
}
