"use client"

import { useState, useEffect } from "react"
import { Lang, Question } from "@/data/types"
import { ui } from "@/data/ui-strings"
import { triggerHaptic } from "@/lib/preferences"
import Timer from "./Timer"
import { CheckIcon, CrossIcon } from "./icons"
import { categoryIconBg } from "./categoryIconColor"

type AnswerKey = "A" | "B" | "C" | "D"

interface Props {
  lang: Lang
  question: Question
  questionIndex: number
  totalQuestions: number
  score: number
  categoryIcon: string
  categoryName: string
  categoryId: number | null
  selectedAnswer: AnswerKey | null
  showFeedback: boolean
  timerKey: number
  onAnswer: (answer: AnswerKey) => void
  onTimeUp: () => void
  onQuit: () => void
}

const POINTS: Record<Question["difficulty"], number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
}

export default function GameScreen({
  lang,
  question,
  questionIndex,
  totalQuestions,
  score,
  categoryIcon,
  categoryName,
  categoryId,
  selectedAnswer,
  showFeedback,
  timerKey,
  onAnswer,
  onTimeUp,
  onQuit,
}: Props) {
  const t = (key: string) => ui[key]?.[lang] || key
  const points = POINTS[question.difficulty]
  const progressPercent = (questionIndex / totalQuestions) * 100
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    if (!showFeedback || !selectedAnswer) return
    const isCorrect = selectedAnswer === question.answer
    if (isCorrect) {
      triggerHaptic([8, 40, 16])
    } else {
      triggerHaptic([14, 60, 14, 60, 14])
      setShaking(true)
      const timeout = setTimeout(() => setShaking(false), 360)
      return () => clearTimeout(timeout)
    }
  }, [showFeedback, selectedAnswer, question.answer])

  const difficultyLabel = t(question.difficulty)

  const tintForIcon = categoryId !== null ? categoryIconBg(categoryId) : "var(--ios-fill-tertiary)"

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--ios-bg)" }}>
      {/* Translucent nav bar */}
      <div
        className="ios-nav sticky top-0 z-20"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)",
          paddingBottom: 12,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onQuit}
            className="ios-press cursor-pointer"
            style={{
              background: "transparent",
              border: 0,
              color: "var(--ios-blue)",
              fontSize: "var(--type-body)",
              fontWeight: 500,
              padding: "6px 4px",
            }}
          >
            {t("quit")}
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="inline-flex items-center justify-center flex-shrink-0"
              style={{ width: 26, height: 26, borderRadius: 8, background: tintForIcon, fontSize: 14 }}
            >
              {categoryIcon}
            </span>
            <span
              className="truncate"
              style={{
                fontSize: "var(--type-headline)",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "var(--ios-label)",
              }}
            >
              {categoryName}
            </span>
          </div>
          <div
            className="flex-shrink-0 text-center"
            style={{
              fontSize: "var(--type-footnote)",
              fontWeight: 700,
              color: "var(--ca-red)",
              background: "var(--ca-red-soft)",
              padding: "5px 10px",
              borderRadius: "var(--radius-pill)",
              letterSpacing: "-0.01em",
              minWidth: 56,
            }}
          >
            {score} {t("pts")}
          </div>
        </div>
      </div>

      {/* Progress rail */}
      <div className="relative" style={{ height: 4, background: "rgba(60, 60, 67, 0.12)" }}>
        <div
          className="absolute top-0 bottom-0 left-0"
          style={{
            background: "var(--ca-red)",
            width: `${progressPercent}%`,
            borderRadius: "0 4px 4px 0",
            transition: "width 500ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-5 pt-5 pb-8 max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between mb-3.5">
          <span
            style={{
              fontSize: "var(--type-footnote)",
              fontWeight: 600,
              color: "var(--ios-label-secondary)",
              letterSpacing: "0.01em",
            }}
          >
            {t("question")} {questionIndex + 1} {t("of")} {totalQuestions}
          </span>
          <DifficultyPill difficulty={question.difficulty} label={difficultyLabel} points={points} t={t} />
        </div>

        <div className="flex items-start gap-3.5 mb-5">
          <h1
            className="flex-1 m-0"
            style={{
              fontSize: "var(--type-title-1)",
              fontWeight: 700,
              lineHeight: 1.22,
              letterSpacing: "-0.025em",
              color: "var(--ios-label)",
              marginTop: 4,
            }}
          >
            {question.question[lang]}
          </h1>
          <Timer duration={20} onTimeUp={onTimeUp} resetKey={timerKey} paused={showFeedback} />
        </div>

        <div className="flex flex-col gap-2.5 mt-1">
          {(["A", "B", "C", "D"] as AnswerKey[]).map((key) => {
            const isCorrect = key === question.answer
            const isSelected = key === selectedAnswer
            const showCorrect = showFeedback && isCorrect
            const showWrong = showFeedback && isSelected && !isCorrect
            const showDimmed = showFeedback && !isCorrect && !isSelected

            return (
              <AnswerButton
                key={key}
                answerKey={key}
                text={question.options[key][lang]}
                disabled={showFeedback}
                pressed={!showFeedback && isSelected}
                correct={showCorrect}
                wrong={showWrong}
                dimmed={showDimmed}
                shaking={shaking && isSelected && !isCorrect}
                onClick={() => onAnswer(key)}
              />
            )
          })}
        </div>

        {showFeedback && (
          <FeedbackToast
            lang={lang}
            isCorrect={selectedAnswer === question.answer}
            timedOut={selectedAnswer === null}
            points={points}
            correctText={question.options[question.answer][lang]}
            answerKey={question.answer}
          />
        )}

        <div className="flex-1" />
      </div>
    </div>
  )
}

function DifficultyPill({
  difficulty,
  label,
  points,
  t,
}: {
  difficulty: Question["difficulty"]
  label: string
  points: number
  t: (key: string) => string
}) {
  const tints: Record<Question["difficulty"], { color: string; bg: string; dot: string }> = {
    easy:   { color: "#1f6e2c", bg: "#e2f6e6", dot: "var(--ios-green)" },
    medium: { color: "#8a5b00", bg: "#fff4d6", dot: "#d68a00" },
    hard:   { color: "var(--ca-red-deep)", bg: "var(--ca-red-soft)", dot: "var(--ca-red)" },
    expert: { color: "#5e2b8a", bg: "#f3e6fc", dot: "var(--ios-purple)" },
  }
  const tint = tints[difficulty]
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        fontSize: "var(--type-caption-1)",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "5px 10px",
        borderRadius: "var(--radius-pill)",
        color: tint.color,
        background: tint.bg,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: tint.dot, display: "inline-block" }} />
      {label} · {points} {t(points > 1 ? "pts" : "pt")}
    </span>
  )
}

interface AnswerButtonProps {
  answerKey: AnswerKey
  text: string
  disabled: boolean
  pressed: boolean
  correct: boolean
  wrong: boolean
  dimmed: boolean
  shaking: boolean
  onClick: () => void
}

function AnswerButton({
  answerKey,
  text,
  disabled,
  pressed,
  correct,
  wrong,
  dimmed,
  shaking,
  onClick,
}: AnswerButtonProps) {
  let bg: string = "var(--ios-surface)"
  let borderColor: string = "transparent"
  let keyBg: string = "var(--ios-fill-tertiary)"
  let keyColor: string = "var(--ios-label)"
  let extraShadow = "var(--shadow-card)"
  const opacity = dimmed ? 0.45 : 1

  if (pressed) {
    borderColor = "rgba(213, 43, 30, 0.35)"
    keyBg = "var(--ca-red)"
    keyColor = "#fff"
  }
  if (correct) {
    bg = "var(--ios-green-soft)"
    borderColor = "var(--ios-green)"
    keyBg = "var(--ios-green)"
    keyColor = "#fff"
    extraShadow = "0 0 0 4px rgba(52, 199, 89, 0.10), var(--shadow-card)"
  }
  if (wrong) {
    bg = "var(--ca-red-soft)"
    borderColor = "var(--ca-red)"
    keyBg = "var(--ca-red)"
    keyColor = "#fff"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`ios-press w-full text-left flex items-center gap-3 ${shaking ? "shake" : ""}`}
      style={{
        background: bg,
        borderRadius: "var(--radius-button)",
        border: `1.5px solid ${borderColor}`,
        boxShadow: extraShadow,
        padding: "14px 14px 14px 12px",
        cursor: disabled ? "default" : "pointer",
        opacity,
        color: "inherit",
      }}
    >
      <span
        className="inline-flex items-center justify-center flex-shrink-0"
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          background: keyBg,
          color: keyColor,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          transition: "background 180ms ease, color 180ms ease",
        }}
      >
        {answerKey}
      </span>
      <span
        className="flex-1"
        style={{ fontSize: "var(--type-body)", fontWeight: 500, lineHeight: 1.3, color: "var(--ios-label)" }}
      >
        {text}
      </span>
      {correct && (
        <span
          className="spring-in inline-flex items-center justify-center flex-shrink-0"
          style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--ios-green)", color: "#fff" }}
        >
          <CheckIcon />
        </span>
      )}
      {wrong && (
        <span
          className="spring-in inline-flex items-center justify-center flex-shrink-0"
          style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--ca-red)", color: "#fff" }}
        >
          <CrossIcon />
        </span>
      )}
    </button>
  )
}

interface FeedbackToastProps {
  lang: Lang
  isCorrect: boolean
  timedOut: boolean
  points: number
  correctText: string
  answerKey: AnswerKey
}

function FeedbackToast({ lang, isCorrect, timedOut, points, correctText, answerKey }: FeedbackToastProps) {
  const t = (key: string) => ui[key]?.[lang] || key
  if (isCorrect) {
    return (
      <div
        className="mt-4 flex items-center gap-2.5"
        style={{
          padding: "12px 14px",
          borderRadius: 14,
          background: "var(--ios-green-soft)",
          color: "#1f6e2c",
          fontSize: "var(--type-subhead)",
          fontWeight: 600,
          boxShadow: "0 1px 2px rgba(31, 110, 44, 0.08)",
        }}
      >
        <span
          className="inline-flex items-center justify-center"
          style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--ios-green)", color: "#fff", flexShrink: 0 }}
        >
          <CheckIcon />
        </span>
        {t("correct")} +{points} {t(points > 1 ? "pts" : "pt")}
      </div>
    )
  }
  return (
    <div
      className="mt-4 flex items-center gap-2.5"
      style={{
        padding: "12px 14px",
        borderRadius: 14,
        background: "var(--ca-red-soft)",
        color: "var(--ca-red-deep)",
        fontSize: "var(--type-subhead)",
        fontWeight: 600,
      }}
    >
      <span
        className="inline-flex items-center justify-center flex-shrink-0"
        style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--ca-red)", color: "#fff" }}
      >
        <CrossIcon />
      </span>
      <span>
        {timedOut ? t("timesUp") : t("wrong")} {answerKey}: {correctText}
      </span>
    </div>
  )
}
