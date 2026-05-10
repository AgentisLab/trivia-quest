"use client"

import { useEffect, useState } from "react"
import { Lang } from "@/data/types"
import { Category, categories } from "@/data/questions"
import { ui } from "@/data/ui-strings"
import { GameLength, GAME_LENGTHS } from "@/lib/preferences"
import { TriviaStats, emptyStats, loadStats } from "@/lib/stats"
import LiveActivityPill from "./LiveActivityPill"
import SegmentedControl from "./SegmentedControl"

interface Props {
  lang: Lang
  gameLength: GameLength
  onGameLengthChange: (length: GameLength) => void
  onSelectCategory: (cat: Category) => void
  onRandomMix: () => void
  randomMixCount: number
}

const NEW_CATEGORY_IDS = new Set<number>([11, 12])

function greetingKey(): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  const h = new Date().getHours()
  if (h < 12) return "greetingMorning"
  if (h < 18) return "greetingAfternoon"
  return "greetingEvening"
}

function formatRelative(ms: number, lang: Lang, t: (key: string) => string): string {
  const diff = Math.max(0, Date.now() - ms)
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return lang === "fr" ? "à l'instant" : "just now"
  let n: number
  let unit: string
  if (minutes < 60) {
    n = minutes
    unit = t("unitMinutes")
  } else if (minutes < 60 * 24) {
    n = Math.floor(minutes / 60)
    unit = t("unitHours")
  } else if (minutes < 60 * 24 * 7) {
    n = Math.floor(minutes / (60 * 24))
    unit = t("unitDays")
  } else {
    n = Math.floor(minutes / (60 * 24 * 7))
    unit = t("unitWeeks")
  }
  if (lang === "fr") {
    return `${t("metaLastPlayedPrefix")} ${n} ${unit}`
  }
  return `${t("metaLastPlayedPrefix")} ${n}${unit} ${t("metaLastPlayedSuffix")}`
}

export default function MenuScreen({
  lang,
  gameLength,
  onGameLengthChange,
  onSelectCategory,
  onRandomMix,
  randomMixCount,
}: Props) {
  const t = (key: string) => ui[key]?.[lang] || key
  const [stats, setStats] = useState<TriviaStats>(emptyStats())

  useEffect(() => {
    setStats(loadStats())
  }, [])

  const greeting = t(greetingKey())
  const questionsLabel = t("questionsLabel")

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-0)", color: "var(--ink-100)" }}
    >
      <div style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 6px)" }}>
        <LiveActivityPill
          segments={[
            { key: "streak", value: stats.currentStreak, label: t("liveDayStreak") },
            { key: "played", value: stats.totalGames, label: t("livePlayed") },
          ]}
        />
      </div>

      <header className="px-[26px] pt-7 pb-1">
        <p
          className="m-0 mb-2"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--ink-60)",
            letterSpacing: "-0.005em",
          }}
        >
          {greeting}
        </p>
        <h1
          className="m-0"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            color: "var(--ink-100)",
          }}
        >
          {t("menuTitle")}
        </h1>
      </header>

      <div className="flex-1 px-[26px] pb-[120px]">
        {/* Length picker — editorial kicker, no card chrome */}
        <div className="mt-7 mb-2">
          <Kicker>{t("kickerLength")}</Kicker>
          <div className="mt-3">
            <SegmentedControl
              ariaLabel={t("gameLengthPickerLabel")}
              value={gameLength}
              onChange={onGameLengthChange}
              options={GAME_LENGTHS.map((n) => ({ value: n, label: String(n) }))}
            />
          </div>
        </div>

        {/* Lead story — Random Mix */}
        <div
          className="mt-9"
          style={{
            borderTop: "1px solid var(--separator)",
            borderBottom: "1px solid var(--separator)",
          }}
        >
          <button
            type="button"
            onClick={onRandomMix}
            className="press story-card hover-tint w-full text-left"
            style={{
              padding: "26px 0 28px",
              background: "transparent",
              border: 0,
              color: "inherit",
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div className="min-w-0 flex-1">
              <p
                className="m-0 mb-2"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                }}
              >
                {t("kickerFeatured")}
              </p>
              <h2
                className="m-0"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 38,
                  fontWeight: 700,
                  letterSpacing: "-0.028em",
                  lineHeight: 1.04,
                  color: "var(--ink-100)",
                }}
              >
                {t("randomMix")}
              </h2>
              <p
                className="m-0 mt-2.5"
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: "var(--ink-80)",
                  lineHeight: 1.5,
                  letterSpacing: "-0.005em",
                }}
              >
                {t("leadDek")}
              </p>
              <p
                className="m-0 mt-3"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--ink-60)",
                  letterSpacing: "-0.005em",
                }}
              >
                {randomMixCount} {questionsLabel}
              </p>
            </div>
            <Chevron />
          </button>
        </div>

        {/* Section kicker */}
        <div className="mt-8 mb-1">
          <Kicker>{t("kickerSection")}</Kicker>
        </div>

        {/* Story cards */}
        <ul className="m-0 list-none p-0">
          {categories.map((cat, i) => {
            const s = stats.perCategory[cat.id]
            const isNew = NEW_CATEGORY_IDS.has(cat.id)
            const meta =
              s && s.lastPlayedAt
                ? formatRelative(s.lastPlayedAt, lang, t)
                : t("metaNotPlayed")
            return (
              <li
                key={cat.id}
                style={{
                  borderTop: i === 0 ? "1px solid var(--separator)" : "none",
                  borderBottom: "1px solid var(--separator)",
                }}
              >
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className="press story-card hover-tint w-full text-left"
                  style={{
                    padding: "20px 0 22px",
                    background: "transparent",
                    border: 0,
                    color: "inherit",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <h3
                      className="m-0 flex flex-wrap items-baseline gap-x-2.5 gap-y-1"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 28,
                        fontWeight: 700,
                        letterSpacing: "-0.022em",
                        lineHeight: 1.08,
                        color: "var(--ink-100)",
                      }}
                    >
                      <span>{cat.name[lang]}</span>
                      {isNew && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--accent)",
                            position: "relative",
                            top: -3,
                          }}
                        >
                          {t("kickerNew")}
                        </span>
                      )}
                    </h3>
                    <p
                      className="m-0 mt-2"
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--ink-60)",
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {cat.questions.length} {questionsLabel} · {meta}
                    </p>
                  </div>
                  <Chevron muted />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--ink-60)",
      }}
    >
      {children}
    </span>
  )
}

function Chevron({ muted = false }: { muted?: boolean }) {
  return (
    <span
      aria-hidden
      className="chevron-arrow flex flex-shrink-0 items-center justify-center"
      style={{
        marginTop: 6,
        color: muted ? "var(--ink-40)" : "var(--ink-60)",
        fontFamily: "var(--font-display)",
        fontSize: 22,
        fontWeight: 300,
        lineHeight: 1,
        transition: "color 140ms ease",
      }}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </span>
  )
}
