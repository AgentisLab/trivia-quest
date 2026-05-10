"use client"

import { useEffect, useState } from "react"
import { Lang } from "@/data/types"
import { categories } from "@/data/questions"
import { ui } from "@/data/ui-strings"
import { loadLang, saveLang } from "@/lib/preferences"
import { TriviaStats, emptyStats, loadStats } from "@/lib/stats"
import LangToggle from "@/components/LangToggle"
import TabBar from "@/components/TabBar"

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
          className="flex items-center justify-between px-[26px]"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 28px)" }}
        >
          <h1
            className="m-0"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--ink-100)",
            }}
          >
            {t("statsTitle")}
          </h1>
          <LangToggle lang={lang} onChange={handleLang} size="sm" />
        </header>

        <div className="px-[26px] pb-[120px] pt-8">
          {empty ? (
            <p
              className="m-0 mt-12 text-center"
              style={{
                fontSize: 15,
                color: "var(--ink-60)",
                letterSpacing: "-0.005em",
                lineHeight: 1.5,
                maxWidth: "30ch",
                marginInline: "auto",
              }}
            >
              {t("statsEmpty")}
            </p>
          ) : (
            <>
              <Section kicker={t("statSummary")}>
                <Row label={t("statTotalGames")} value={String(stats.totalGames)} />
                <Row label={t("statAccuracy")} value={`${accuracy}%`} />
                <Row label={t("statBestScore")} value={String(stats.bestScore)} last />
              </Section>

              <Section kicker={t("statStreaks")}>
                <Row label={t("statCurrentStreak")} value={String(stats.currentStreak)} />
                <Row label={t("statLongestStreak")} value={String(stats.longestStreak)} last />
              </Section>

              <Section kicker={t("statByCategory")}>
                {categories.map((cat, i) => {
                  const s = stats.perCategory[cat.id]
                  const acc = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center gap-4"
                      style={{
                        padding: "16px 0",
                        borderBottom:
                          i === categories.length - 1 ? "none" : "1px solid var(--separator)",
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <div
                          className="truncate"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 16,
                            fontWeight: 600,
                            color: "var(--ink-100)",
                            letterSpacing: "-0.012em",
                          }}
                        >
                          {cat.name[lang]}
                        </div>
                        <div
                          className="relative mt-2"
                          style={{
                            height: 3,
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
                          fontSize: 14,
                          fontWeight: 600,
                          color: s ? "var(--ink-80)" : "var(--ink-40)",
                          fontVariantNumeric: "tabular-nums",
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {s ? `${acc}%` : "—"}
                      </div>
                    </div>
                  )
                })}
              </Section>
            </>
          )}
        </div>
      </div>
      <TabBar />
    </>
  )
}

function Section({
  kicker,
  children,
}: {
  kicker: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-9 first:mt-0">
      <p
        className="m-0 mb-3"
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-60)",
        }}
      >
        {kicker}
      </p>
      <div style={{ borderTop: "1px solid var(--separator)" }}>{children}</div>
    </section>
  )
}

function Row({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
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
          fontSize: 15,
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
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.012em",
        }}
      >
        {value}
      </span>
    </div>
  )
}
