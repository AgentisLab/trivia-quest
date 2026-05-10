"use client"

import { useEffect, useMemo, useState } from "react"
import { Lang, Question } from "@/data/types"
import { ui } from "@/data/ui-strings"
import { TriviaStats, emptyStats, loadStats } from "@/lib/stats"
import { CloseIcon, PlaySolidIcon } from "./icons"

interface AnswerRecord {
  question: Question
  selected: "A" | "B" | "C" | "D" | null
  correct: boolean
}

interface Props {
  lang: Lang
  answers: AnswerRecord[]
  categoryName: string
  difficultyLabel?: string
  totalElapsedMs: number
  bestStreak: number
  onPlayAgain: () => void
  onChooseAnother: () => void
}

const ORDER: Question["difficulty"][] = ["easy", "medium", "hard", "expert"]

export default function ResultsScreen({
  lang,
  answers,
  categoryName,
  difficultyLabel,
  totalElapsedMs,
  bestStreak,
  onPlayAgain,
  onChooseAnother,
}: Props) {
  const t = (key: string) => ui[key]?.[lang] || key
  const [stats, setStats] = useState<TriviaStats>(emptyStats())

  useEffect(() => {
    setStats(loadStats())
  }, [])

  const correct = answers.filter((a) => a.correct).length
  const total = answers.length
  const accuracyPct = total > 0 ? Math.round((correct / total) * 100) : 0

  const breakdown = useMemo(
    () =>
      ORDER.map((d) => {
        const items = answers.filter((a) => a.question.difficulty === d)
        return {
          difficulty: d,
          got: items.filter((a) => a.correct).length,
          total: items.length,
        }
      }).filter((row) => row.total > 0),
    [answers]
  )

  const dateLine = useMemo(() => formatDate(new Date(), lang), [lang])
  const timeText = formatDuration(totalElapsedMs, lang)
  const avgText = formatAverage(totalElapsedMs, total, lang)

  const headerKicker = difficultyLabel ? `${categoryName} · ${difficultyLabel}` : categoryName

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{ background: "var(--bg-0)", color: "var(--ink-100)" }}
    >
      <div
        className="flex items-center justify-between px-[18px]"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)" }}
      >
        <button
          type="button"
          onClick={onChooseAnother}
          aria-label={t("chooseAnother")}
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
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--ink-100)",
            letterSpacing: "-0.01em",
          }}
        >
          {t("summary")}
        </div>
        <div className="h-[34px] w-[34px]" aria-hidden />
      </div>

      <div className="flex flex-1 flex-col px-[26px] pb-[170px] pt-9">
        <div className="mb-7 flex flex-col gap-2">
          <p
            className="m-0"
            style={{
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "-0.005em",
              color: "var(--ink-60)",
            }}
          >
            {headerKicker}
          </p>
          <h1
            className="m-0"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: "var(--ink-100)",
            }}
          >
            {dateLine}
          </h1>
        </div>

        <div
          className="mb-6 flex items-end gap-3.5 pb-6"
          style={{ borderBottom: "1px solid var(--separator)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 80,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "var(--ink-100)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {correct}
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--ink-60)",
              marginBottom: 8,
            }}
          >
            / {total}
          </span>
          <div className="ml-auto flex flex-col items-end" style={{ marginBottom: 6 }}>
            <p
              className="m-0"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--success)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {accuracyPct}%
            </p>
            <p
              className="m-0"
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "var(--ink-60)",
                letterSpacing: "-0.005em",
                marginTop: 2,
              }}
            >
              {t("accuracy")}
            </p>
          </div>
        </div>

        <StatRow label={t("bestStreak")} value={`${bestStreak} ${t("inARow")}`} />
        <StatRow label={t("totalTime")} value={timeText} />
        <StatRow label={t("avgPerQuestion")} value={avgText} />
        <StatRow
          label={t("dayStreakLabel")}
          value={`${stats.currentStreak} ${t("daysUnit")}`}
          last
        />

        <div className="mt-2">
          <p
            className="m-0 mb-3"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--ink-60)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {t("byDifficulty")}
          </p>
          {breakdown.map((row) => (
            <BarRow
              key={row.difficulty}
              label={t(row.difficulty)}
              got={row.got}
              total={row.total}
            />
          ))}
        </div>
      </div>

      <div
        className="absolute left-[18px] right-[18px] z-10 flex flex-col gap-2"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)" }}
      >
        <button
          type="button"
          onClick={onPlayAgain}
          className="press flex items-center justify-center gap-2"
          style={{
            height: 52,
            borderRadius: 14,
            background: "var(--accent)",
            color: "#fff",
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            border: 0,
          }}
        >
          <PlaySolidIcon width={16} height={16} />
          {t("playAgain")}
        </button>
        <button
          type="button"
          onClick={onChooseAnother}
          className="press"
          style={{
            height: 46,
            borderRadius: 12,
            background: "transparent",
            color: "var(--ink-60)",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            border: 0,
          }}
        >
          {t("chooseAnother")}
        </button>
      </div>
    </div>
  )
}

function StatRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "14px 0",
        borderBottom: last ? "none" : "1px solid var(--separator)",
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--ink-80)",
          letterSpacing: "-0.005em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 600,
          color: "var(--ink-100)",
          letterSpacing: "-0.012em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  )
}

function BarRow({ label, got, total }: { label: string; got: number; total: number }) {
  const pct = total > 0 ? (got / total) * 100 : 0
  return (
    <div className="flex items-center gap-3" style={{ padding: "10px 0" }}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--ink-80)",
          letterSpacing: "-0.005em",
          width: 64,
        }}
      >
        {label}
      </span>
      <span
        className="flex-1"
        style={{
          height: 4,
          borderRadius: 2,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            height: "100%",
            width: `${pct}%`,
            background: "var(--ink-100)",
            borderRadius: 2,
          }}
        />
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--ink-80)",
          letterSpacing: "-0.005em",
          fontVariantNumeric: "tabular-nums",
          width: 40,
          textAlign: "right",
        }}
      >
        {got} / {total}
      </span>
    </div>
  )
}

function formatDate(date: Date, lang: Lang): string {
  const enFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
  const time = new Intl.DateTimeFormat(lang === "fr" ? "fr-CA" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: lang === "en",
  }).format(date)
  if (lang === "fr") {
    const frFmt = new Intl.DateTimeFormat("fr-CA", { month: "long", day: "numeric" })
      .format(date)
      .replace(/^0+/, "")
    return `${frFmt} · ${time.replace(":", " h ")}`
  }
  return `${enFmt} · ${time}`
}

function formatDuration(ms: number, lang: Lang): string {
  const totalSec = Math.max(0, Math.round(ms / 1000))
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  if (lang === "fr") {
    if (min === 0) return `${sec} s`
    return `${min} min ${String(sec).padStart(2, "0")} s`
  }
  if (min === 0) return `${sec}s`
  return `${min} min ${String(sec).padStart(2, "0")}s`
}

function formatAverage(totalMs: number, count: number, lang: Lang): string {
  if (count <= 0) return lang === "fr" ? "0,0 s" : "0.0s"
  const avg = totalMs / count / 1000
  const rounded = Math.round(avg * 10) / 10
  if (lang === "fr") return `${rounded.toFixed(1).replace(".", ",")} s`
  return `${rounded.toFixed(1)}s`
}
