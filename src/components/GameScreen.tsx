"use client"

import { useEffect, useRef, useState } from "react"
import { Lang, Question } from "@/data/types"
import { ui } from "@/data/ui-strings"
import { triggerHaptic } from "@/lib/preferences"
import { CheckIcon, CloseIcon } from "./icons"

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

const TIMER_DURATION = 20

export default function GameScreen({
  lang,
  question,
  questionIndex,
  totalQuestions,
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

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{ background: "var(--bg-0)", color: "var(--ink-100)" }}
    >
      {/* Top horizontal pulse-bar timer (kept from v4) */}
      <div
        className="relative"
        style={{
          height: 3,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          marginTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div
          className={isLastSeconds ? "timer-pulse" : undefined}
          style={{
            height: "100%",
            width: `${fillPercent}%`,
            background: isLastSeconds ? "var(--accent)" : "var(--ink-100)",
            transition: "width 1s linear",
          }}
        />
      </div>

      {/* Top bar — quiet X quit */}
      <div className="flex items-center justify-between px-[22px] pt-3.5">
        <button
          type="button"
          aria-label={t("quitConfirm")}
          onClick={() => setConfirmQuit(true)}
          className="press flex items-center justify-center"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "transparent",
            border: 0,
            color: "var(--ink-80)",
          }}
        >
          <CloseIcon width={18} height={18} />
        </button>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--ink-60)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.max(timeLeft, 0)}s
        </span>
        <div className="h-[34px] w-[34px]" aria-hidden />
      </div>

      {/* Editorial article body */}
      <div className="flex flex-1 flex-col items-center px-[26px] pb-10 pt-10">
        {/* Section kicker — Question N of M + category */}
        <p
          className="m-0 text-center"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-60)",
          }}
        >
          <span style={{ color: "var(--accent)" }}>
            {t("questionOfTotalPrefix")} {questionIndex + 1}
          </span>
          <span style={{ marginLeft: 8, marginRight: 8, color: "var(--ink-40)" }}>·</span>
          <span>{categoryName}</span>
        </p>

        {/* Question (editorial display) */}
        <h1
          className="mt-7"
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "-0.022em",
            lineHeight: 1.25,
            color: "var(--ink-100)",
            textAlign: "center",
            maxWidth: "32ch",
          }}
        >
          {question.question[lang]}
        </h1>

        <p
          className="m-0 mt-3"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--ink-40)",
            letterSpacing: "-0.005em",
          }}
        >
          {t(question.difficulty)}
        </p>

        {/* Answers — text-forward, hairline-separated rows */}
        <ul
          className="m-0 mt-10 w-full list-none p-0"
          style={{ maxWidth: 520, borderTop: "1px solid var(--separator)" }}
        >
          {(["A", "B", "C", "D"] as AnswerKey[]).map((key) => {
            const isCorrect = key === question.answer
            const isSelected = key === selectedAnswer
            const reveal = showFeedback
            const correctState = reveal && isCorrect
            const wrongState = reveal && isSelected && !isCorrect
            const dimmed = reveal && !correctState && !wrongState
            return (
              <AnswerRow
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
        </ul>

        {/* Hint */}
        <p
          className="m-0 mt-8 text-center"
          style={{
            color: "var(--ink-40)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          {showFeedback ? t("nextIn") : t("tapAnswer")}
        </p>
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

interface AnswerRowProps {
  answerKey: AnswerKey
  text: string
  disabled: boolean
  correctState: boolean
  wrongState: boolean
  dimmed: boolean
  onClick: () => void
}

function AnswerRow({
  answerKey,
  text,
  disabled,
  correctState,
  wrongState,
  dimmed,
  onClick,
}: AnswerRowProps) {
  let textColor: string = "var(--ink-100)"
  let prefixColor: string = "var(--ink-40)"
  let opacity = 1

  if (correctState) {
    textColor = "var(--success)"
    prefixColor = "var(--success)"
  } else if (wrongState) {
    textColor = "var(--danger)"
    prefixColor = "var(--danger)"
  } else if (dimmed) {
    opacity = 0.3
  }

  return (
    <li style={{ borderBottom: "1px solid var(--separator)" }}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="press flex w-full items-center gap-4 text-left"
        style={{
          padding: "18px 4px",
          background: "transparent",
          border: 0,
          color: textColor,
          fontSize: 17,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          lineHeight: 1.35,
          opacity,
          cursor: disabled ? "default" : "pointer",
          transition: "color 180ms ease, opacity 180ms ease",
        }}
      >
        <span
          aria-hidden
          className="flex flex-shrink-0 items-center justify-center"
          style={{
            width: 22,
            height: 22,
            color: prefixColor,
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.005em",
            transition: "color 180ms ease",
          }}
        >
          {correctState ? (
            <CheckIcon width={16} height={16} />
          ) : (
            <span>{answerKey}.</span>
          )}
        </span>
        <span className="flex-1">{text}</span>
      </button>
    </li>
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
