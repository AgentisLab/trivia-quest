"use client"

import { Lang, Question } from "@/data/types"
import { ui } from "@/data/ui-strings"

interface AnswerRecord {
  question: Question
  selected: "A" | "B" | "C" | "D" | null
  correct: boolean
}

interface Props {
  lang: Lang
  score: number
  maxScore: number
  answers: AnswerRecord[]
  categoryIcon: string
  categoryName: string
  isRandomMix: boolean
  onPlayAgain: () => void
  onChooseAnother: () => void
}

const POINTS: Record<Question["difficulty"], number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
}

const DIFFICULTY_TINTS: Record<Question["difficulty"], { color: string; bg: string }> = {
  easy:   { color: "#1f6e2c", bg: "#e2f6e6" },
  medium: { color: "#8a5b00", bg: "#fff4d6" },
  hard:   { color: "var(--ca-red-deep)", bg: "var(--ca-red-soft)" },
  expert: { color: "#5e2b8a", bg: "#f3e6fc" },
}

export default function ResultsScreen({
  lang,
  score,
  maxScore,
  answers,
  categoryIcon,
  categoryName,
  isRandomMix,
  onPlayAgain,
  onChooseAnother,
}: Props) {
  const t = (key: string) => ui[key]?.[lang] || key
  const correctCount = answers.filter((a) => a.correct).length
  const ratio = maxScore > 0 ? score / maxScore : 0
  const trophy = ratio >= 0.8 ? "🏆" : ratio >= 0.5 ? "🎉" : "💪"

  const breakdown = (["easy", "medium", "hard", "expert"] as const).map((d) => ({
    difficulty: d,
    label: t(`${d}Label`),
    items: answers.filter((a) => a.question.difficulty === d),
  }))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10" style={{ background: "var(--ios-bg)" }}>
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-3">{trophy}</div>
        <h1
          style={{
            fontSize: "var(--type-title-1)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "var(--ios-label)",
            margin: 0,
          }}
        >
          {t("gameOver")}
        </h1>
        <p
          className="mt-1.5"
          style={{ fontSize: "var(--type-subhead)", color: "var(--ios-label-secondary)", fontWeight: 500 }}
        >
          <span className="mr-1">{categoryIcon}</span>
          {categoryName}
        </p>

        <div
          className="my-5 inline-flex items-baseline gap-2"
          style={{ fontSize: 44, fontWeight: 800, color: "var(--ca-red)", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}
        >
          {score}
          <span style={{ fontSize: 22, color: "var(--ios-label-secondary)", fontWeight: 600 }}>/ {maxScore}</span>
        </div>
        <p
          className="mb-7"
          style={{ fontSize: "var(--type-subhead)", color: "var(--ios-label-secondary)" }}
        >
          {correctCount} / {answers.length} {t("questionsCorrect")}
        </p>

        {/* Breakdown card */}
        <div
          className="text-left p-5 mb-7"
          style={{
            background: "var(--ios-surface)",
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h3
            className="text-center mb-4"
            style={{
              fontSize: "var(--type-headline)",
              fontWeight: 700,
              color: "var(--ios-label)",
              letterSpacing: "-0.01em",
            }}
          >
            {t("scoreBreakdown")}
          </h3>
          <div className="flex flex-col gap-3">
            {breakdown.map(({ difficulty, label, items }) => {
              if (items.length === 0) return null
              const tint = DIFFICULTY_TINTS[difficulty]
              const got = items.filter((a) => a.correct).length
              return (
                <div key={difficulty} className="flex items-center justify-between gap-3">
                  <span
                    className="font-semibold"
                    style={{
                      fontSize: "var(--type-footnote)",
                      padding: "4px 10px",
                      borderRadius: "var(--radius-pill)",
                      color: tint.color,
                      background: tint.bg,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{ fontSize: "var(--type-subhead)", color: "var(--ios-label-secondary)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
                  >
                    {got} / {items.length} · {got * POINTS[difficulty]} {t("pts")}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onPlayAgain}
            className="ios-press w-full cursor-pointer"
            style={{
              padding: "14px 18px",
              background: "var(--ca-red)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "var(--type-body)",
              borderRadius: "var(--radius-button)",
              border: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {t("playAgain")} {isRandomMix ? "🎲" : ""}
          </button>
          <button
            onClick={onChooseAnother}
            className="ios-press w-full cursor-pointer"
            style={{
              padding: "14px 18px",
              background: "var(--ios-surface)",
              color: "var(--ios-label)",
              fontWeight: 600,
              fontSize: "var(--type-body)",
              borderRadius: "var(--radius-button)",
              border: "0.5px solid var(--ios-separator)",
              letterSpacing: "-0.01em",
            }}
          >
            {t("chooseAnother")}
          </button>
        </div>
      </div>
    </div>
  )
}
