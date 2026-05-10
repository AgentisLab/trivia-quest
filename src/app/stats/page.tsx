"use client"

import { useEffect, useState } from "react"
import { Lang } from "@/data/types"
import { categories } from "@/data/questions"
import { ui } from "@/data/ui-strings"
import { loadLang, saveLang } from "@/lib/preferences"
import { TriviaStats, emptyStats, loadStats } from "@/lib/stats"
import LangToggle from "@/components/LangToggle"
import TabBar from "@/components/TabBar"
import { CategoryIcon } from "@/components/icons"

export default function StatsPage() {
  const [hydrated, setHydrated] = useState(false)
  const [lang, setLang] = useState<Lang>("en")
  const [stats, setStats] = useState<TriviaStats>(emptyStats())

  useEffect(() => {
    setLang(loadLang())
    setStats(loadStats())
    setHydrated(true)
  }, [])

  const t = (key: string) => ui[key]?.[lang] || key
  const handleLang = (next: Lang) => {
    setLang(next)
    saveLang(next)
  }

  if (!hydrated) {
    return <div className="min-h-screen" style={{ background: "var(--bg-1)" }} />
  }

  const empty = stats.totalGames === 0
  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      : 0

  return (
    <>
      <div
        className="min-h-screen"
        style={{ background: "var(--bg-0)", color: "var(--ink-100)" }}
      >
        <header
          className="flex items-center justify-between px-[22px]"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)" }}
        >
          <h1
            className="m-0"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--ink-100)",
            }}
          >
            {t("statsTitle")}
          </h1>
          <LangToggle lang={lang} onChange={handleLang} size="sm" />
        </header>

        <div className="px-[22px] pb-[120px] pt-6">
          {empty ? (
            <p
              className="m-0 mt-10 text-center"
              style={{
                fontSize: 14,
                color: "var(--ink-60)",
                letterSpacing: "-0.005em",
              }}
            >
              {t("statsEmpty")}
            </p>
          ) : (
            <>
              <SectionHeader>{t("statSummary")}</SectionHeader>
              <Card>
                <Row label={t("statTotalGames")} value={String(stats.totalGames)} />
                <Row label={t("statAccuracy")} value={`${accuracy}%`} />
                <Row label={t("statBestScore")} value={String(stats.bestScore)} last />
              </Card>

              <SectionHeader>{t("statStreaks")}</SectionHeader>
              <Card>
                <Row label={t("statCurrentStreak")} value={String(stats.currentStreak)} />
                <Row label={t("statLongestStreak")} value={String(stats.longestStreak)} last />
              </Card>

              <SectionHeader>{t("statByCategory")}</SectionHeader>
              <Card>
                {categories.map((cat, i) => {
                  const s = stats.perCategory[cat.id]
                  const acc = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center gap-3"
                      style={{
                        padding: "14px 16px",
                        borderTop: i === 0 ? "none" : "1px solid var(--separator)",
                      }}
                    >
                      <span
                        className="flex flex-shrink-0 items-center justify-center"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 9,
                          background: "var(--bg-3)",
                          color: "var(--ink-100)",
                        }}
                      >
                        <CategoryIcon id={cat.id} width={15} height={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div
                          className="truncate"
                          style={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: "var(--ink-100)",
                            letterSpacing: "-0.005em",
                          }}
                        >
                          {cat.name[lang]}
                        </div>
                        <div
                          className="relative mt-2"
                          style={{
                            height: 4,
                            borderRadius: 2,
                            background: "rgba(255,255,255,0.08)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${s ? acc : 0}%`,
                              height: "100%",
                              background: s ? "var(--ink-100)" : "transparent",
                              borderRadius: 2,
                              transition: "width 400ms ease",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          minWidth: 48,
                          textAlign: "right",
                          fontFamily: "var(--font-display)",
                          fontSize: 13,
                          fontWeight: 600,
                          color: s ? "var(--ink-80)" : "var(--ink-40)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {s ? `${acc}%` : "—"}
                      </div>
                    </div>
                  )
                })}
              </Card>
            </>
          )}
        </div>
      </div>
      <TabBar />
    </>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mx-1 mb-2 mt-6"
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: "var(--ink-60)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--separator)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  )
}

function Row({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "14px 16px",
        borderBottom: last ? "none" : "1px solid var(--separator)",
      }}
    >
      <span
        style={{
          fontSize: 15,
          color: "var(--ink-100)",
          letterSpacing: "-0.005em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 15,
          fontWeight: 600,
          color: "var(--ink-80)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.005em",
        }}
      >
        {value}
      </span>
    </div>
  )
}
