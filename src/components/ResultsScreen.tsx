"use client"

import { useEffect, useMemo, useState } from "react"
import { Lang, Question } from "@/data/types"
import { ui } from "@/data/ui-strings"
import { TriviaStats, emptyStats, loadStats } from "@/lib/stats"

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

function pullQuoteKey(pct: number): string {
  if (pct >= 95) return "pullQuoteNearPerfect"
  if (pct >= 80) return "pullQuoteConfident"
  if (pct >= 60) return "pullQuoteSolid"
  if (pct >= 40) return "pullQuoteAnotherGo"
  return "pullQuoteHardRound"
}

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
  const pullQuote = t(pullQuoteKey(accuracyPct))

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

  const timeText = formatDuration(totalElapsedMs, lang)
  const avgText = formatAverage(totalElapsedMs, total, lang)

  const headerKicker = difficultyLabel
    ? `${categoryName} · ${difficultyLabel}`
    : categoryName

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{ background: "var(--bg-0)", color: "var(--ink-100)" }}
    >
      <div
        className="flex flex-1 flex-col px-[26px] pb-[170px]"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 36px)" }}
      >
        {/* Kicker — YOU PLAYED · category */}
        <p
          className="m-0"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-60)",
          }}
        >
          <span style={{ color: "var(--accent)" }}>{t("kickerYouPlayed")}</span>
          <span style={{ marginLeft: 8, marginRight: 8, color: "var(--ink-40)" }}>·</span>
          <span>{headerKicker}</span>
        </p>

        {/* Score — editorial display */}
        <div className="mt-5 flex items-baseline gap-3">
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
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--ink-40)",
            }}
          >
            / {total}
          </span>
        </div>

        {/* Pull quote */}
        <p
          className="m-0 mt-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 500,
            color: "var(--ink-80)",
            letterSpacing: "-0.018em",
            lineHeight: 1.3,
            maxWidth: "28ch",
          }}
        >
          {pullQuote}
        </p>

        {/* Stats — hairline rows */}
        <div
          className="mt-9"
          style={{ borderTop: "1px solid var(--separator)" }}
        >
          <StatRow label={t("accuracy")} value={`${accuracyPct}%`} />
          <StatRow label={t("bestStreak")} value={`${bestStreak} ${t("inARow")}`} />
          <StatRow label={t("totalTime")} value={timeText} />
          <StatRow label={t("avgPerQuestion")} value={avgText} />
          <StatRow
            label={t("dayStreakLabel")}
            value={`${stats.currentStreak} ${t("daysUnit")}`}
            last
          />
        </div>

        {/* By difficulty */}
        <div className="mt-8">
          <p
            className="m-0 mb-3"
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--ink-60)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {t("byDifficulty")}
          </p>
          <div style={{ borderTop: "1px solid var(--separator)" }}>
            {breakdown.map((row, i) => (
              <BarRow
                key={row.difficulty}
                label={t(row.difficulty)}
                got={row.got}
                total={row.total}
                last={i === breakdown.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div
        className="absolute left-[22px] right-[22px] z-10 flex flex-col gap-2"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)" }}
      >
        <button
          type="button"
          onClick={onPlayAgain}
          className="press flex items-center justify-center"
          style={{
            height: 52,
            borderRadius: 14,
            background: "var(--accent)",
            color: "var(--on-accent)",
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            border: 0,
          }}
        >
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
        padding: "16px 0",
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

function BarRow({
  label,
  got,
  total,
  last = false,
}: {
  label: string
  got: number
  total: number
  last?: boolean
}) {
  const pct = total > 0 ? (got / total) * 100 : 0
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: "14px 0",
        borderBottom: last ? "none" : "1px solid var(--separator)",
      }}
    >
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
          background: "var(--timer-track)",
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
