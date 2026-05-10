"use client"

import { useEffect, useRef, useState } from "react"
import { Lang, Question } from "@/data/types"
import { ui } from "@/data/ui-strings"
import { triggerHaptic } from "@/lib/preferences"
import LiveActivityPill from "./LiveActivityPill"
import { CheckIcon, CloseIcon, CrossIcon } from "./icons"

type AnswerKey = "A" | "B" | "C" | "D"

interface Props {
  lang: Lang
  question: Question
  questionIndex: number
  totalQuestions: number
  streak: number
  categoryName: string
  selectedAnswer: AnswerKey | null
  showFeedback: boolean
  timerKey: number
  onAnswer: (answer: AnswerKey) => void
  onTimeUp: () => void
  onQuit: () => void
}

const DIFFICULTY_PIPS: Record<Question["difficulty"], number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
}

const TIMER_DURATION = 20

export default function GameScreen({
  lang,
  question,
  questionIndex,
  totalQuestions,
  streak,
  categoryName,
  selectedAnswer,
  showFeedback,
  timerKey,
  onAnswer,
  onTimeUp,
  onQuit,
}: Props) {
  const t = (key: string) => ui[key]?.[lang] || key
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [confirmQuit, setConfirmQuit] = useState(false)
  const timeUpFiredRef = useRef(false)

  useEffect(() => {
    setTimeLeft(TIMER_DURATION)
    timeUpFiredRef.current = false
  }, [timerKey])

  useEffect(() => {
    if (showFeedback || confirmQuit) return
    if (timeLeft <= 0) {
      if (!timeUpFiredRef.current) {
        timeUpFiredRef.current = true
        onTimeUp()
      }
      return
    }
    const id = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => clearInterval(id)
  }, [timeLeft, showFeedback, confirmQuit, onTimeUp])

  useEffect(() => {
    if (!showFeedback || !selectedAnswer) return
    const correct = selectedAnswer === question.answer
    triggerHaptic(correct ? 12 : [14, 60, 14])
  }, [showFeedback, selectedAnswer, question.answer])

  const fillPercent = (Math.max(timeLeft, 0) / TIMER_DURATION) * 100
  const isLastSeconds = timeLeft <= 3 && timeLeft > 0 && !showFeedback
  const difficultyPips = DIFFICULTY_PIPS[question.difficulty]

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{ background: "var(--bg-0)", color: "var(--ink-100)" }}
    >
      <div style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 6px)" }}>
        <LiveActivityPill
          segments={[
            { key: "cat", label: categoryName },
            { key: "q", value: questionIndex + 1, label: `/ ${totalQuestions}` },
            { key: "streak", value: streak, label: t("liveStreak") },
          ]}
        />
      </div>

      {/* Top bar — quiet X quit */}
      <div className="flex items-center justify-between px-[18px] pt-3.5">
        <button
          type="button"
          aria-label={t("quitConfirm")}
          onClick={() => setConfirmQuit(true)}
          className="press flex items-center justify-center"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--bg-2)",
            border: "1px solid var(--separator)",
            color: "var(--ink-100)",
          }}
        >
          <CloseIcon width={14} height={14} />
        </button>
        <div className="h-[34px] w-[34px]" aria-hidden />
      </div>

      {/* Card stack */}
      <div className="relative flex-1 overflow-hidden px-4 pb-10 pt-[18px]">
        {/* Peek cards */}
        <div
          className="absolute"
          style={{
            left: 30,
            right: 30,
            top: 580,
            height: 32,
            borderRadius: 22,
            background: "var(--bg-1)",
            border: "1px solid var(--separator)",
            transform: "rotate(-1deg)",
            zIndex: 1,
          }}
        />
        <div
          className="absolute"
          style={{
            left: 50,
            right: 50,
            top: 610,
            height: 22,
            borderRadius: 22,
            background: "var(--bg-1)",
            border: "1px solid var(--separator)",
            transform: "rotate(1deg)",
            opacity: 0.6,
            zIndex: 1,
          }}
        />

        {/* Active card */}
        <div
          className="relative"
          style={{
            zIndex: 3,
            borderRadius: 24,
            overflow: "hidden",
            background: "var(--bg-2)",
            border: "1px solid var(--separator)",
            transform: "rotate(-1deg)",
          }}
        >
          {/* Horizontal timer */}
          <div
            className="relative"
            style={{ height: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}
          >
            <div
              className={isLastSeconds ? "timer-pulse" : undefined}
              style={{
                height: "100%",
                width: `${fillPercent}%`,
                background: "var(--ink-100)",
                transition: "width 1s linear",
              }}
            />
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between px-5 pb-1 pt-4">
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--ink-80)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {categoryName}
            </span>
            <div
              className="flex items-center gap-1.5"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--ink-60)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {[1, 2, 3, 4].map((p) => (
                <span
                  key={p}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: p <= difficultyPips ? "var(--ink-100)" : "rgba(255,255,255,0.18)",
                  }}
                />
              ))}
              <span style={{ marginLeft: 4 }}>{t(question.difficulty)}</span>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--ink-80)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.005em",
              }}
            >
              <b style={{ color: "var(--ink-100)", fontWeight: 700 }}>{Math.max(timeLeft, 0)}</b>s
            </div>
          </div>

          {/* Question */}
          <h1
            className="m-0"
            style={{
              padding: "14px 22px 22px",
              fontFamily: "var(--font-display)",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.18,
              color: "var(--ink-100)",
            }}
          >
            {question.question[lang]}
          </h1>

          {/* Options */}
          <div className="flex flex-col gap-[9px] px-[18px] pb-5">
            {(["A", "B", "C", "D"] as AnswerKey[]).map((key) => {
              const isCorrect = key === question.answer
              const isSelected = key === selectedAnswer
              const reveal = showFeedback
              const correctState = reveal && isCorrect
              const wrongState = reveal && isSelected && !isCorrect
              const dimmed = reveal && !correctState
              return (
                <AnswerOption
                  key={key}
                  answerKey={key}
                  text={question.options[key][lang]}
                  disabled={reveal}
                  correctState={correctState}
                  wrongState={wrongState}
                  dimmed={dimmed}
                  onClick={() => {
                    if (!reveal) {
                      triggerHaptic(8)
                      onAnswer(key)
                    }
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Hint */}
        <div
          className="pointer-events-none absolute left-0 right-0 text-center"
          style={{
            bottom: 24,
            color: "var(--ink-40)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            zIndex: 5,
          }}
        >
          {showFeedback ? t("nextIn") : t("tapAnswer")}
        </div>
      </div>

      {confirmQuit && (
        <QuitSheet
          title={t("quitGameTitle")}
          body={t("quitGameBody")}
          confirmLabel={t("quitConfirm")}
          cancelLabel={t("quitCancel")}
          onConfirm={onQuit}
          onCancel={() => setConfirmQuit(false)}
        />
      )}
    </div>
  )
}

interface AnswerOptionProps {
  answerKey: AnswerKey
  text: string
  disabled: boolean
  correctState: boolean
  wrongState: boolean
  dimmed: boolean
  onClick: () => void
}

function AnswerOption({
  answerKey,
  text,
  disabled,
  correctState,
  wrongState,
  dimmed,
  onClick,
}: AnswerOptionProps) {
  const isReveal = correctState || wrongState
  let bg = "var(--bg-3)"
  let borderColor: string = "var(--separator)"
  let keyBg = "rgba(255,255,255,0.06)"
  let keyColor: string = "var(--ink-80)"
  let keyBorder: string = "var(--separator)"

  if (correctState) {
    bg = "rgba(48, 209, 88, 0.10)"
    borderColor = "var(--success)"
    keyBg = "var(--success)"
    keyColor = "#003a14"
    keyBorder = "transparent"
  } else if (wrongState) {
    bg = "rgba(255, 69, 58, 0.08)"
    borderColor = "rgba(255,69,58,0.55)"
    keyBg = "var(--danger)"
    keyColor = "#380a07"
    keyBorder = "transparent"
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="press flex w-full items-center gap-3.5 text-left"
      style={{
        padding: "15px 18px",
        borderRadius: 14,
        background: bg,
        border: `1px solid ${borderColor}`,
        color: "var(--ink-100)",
        fontSize: 16,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        opacity: dimmed && !isReveal ? 0.4 : dimmed ? 0.4 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      <span
        className="flex flex-shrink-0 items-center justify-center"
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: keyBg,
          color: keyColor,
          border: `1px solid ${keyBorder}`,
          fontSize: 12,
          fontWeight: 600,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {correctState ? (
          <CheckIcon width={14} height={14} />
        ) : wrongState ? (
          <CrossIcon width={14} height={14} />
        ) : (
          answerKey
        )}
      </span>
      <span className="flex-1">{text}</span>
    </button>
  )
}

interface QuitSheetProps {
  title: string
  body: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

function QuitSheet({ title, body, confirmLabel, cancelLabel, onConfirm, onCancel }: QuitSheetProps) {
  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-end justify-center"
      style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
      >
        <div
          style={{
            background: "var(--bg-2)",
            border: "1px solid var(--separator)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div className="px-5 pb-3 pt-4 text-center">
            <p
              className="m-0"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink-100)",
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </p>
            <p
              className="m-0 mt-1"
              style={{ fontSize: 13, color: "var(--ink-60)", letterSpacing: "-0.005em" }}
            >
              {body}
            </p>
          </div>
          <button
            type="button"
            onClick={onConfirm}
            className="press w-full"
            style={{
              padding: "14px",
              borderTop: "1px solid var(--separator)",
              background: "transparent",
              color: "var(--danger)",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.005em",
            }}
          >
            {confirmLabel}
          </button>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="press mt-2 w-full"
          style={{
            padding: "14px",
            borderRadius: 14,
            background: "var(--bg-2)",
            border: "1px solid var(--separator)",
            color: "var(--ink-100)",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.005em",
          }}
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  )
}

