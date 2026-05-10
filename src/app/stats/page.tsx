"use client"

import { useEffect, useState } from "react"
import { Lang } from "@/data/types"
import { categories } from "@/data/questions"
import { ui } from "@/data/ui-strings"
import { loadLang, saveLang } from "@/lib/preferences"
import { TriviaStats, emptyStats, loadStats } from "@/lib/stats"
import { IOSScaffold, IOSSection, IOSRow } from "@/components/IOSScaffold"
import TabBar from "@/components/TabBar"
import { categoryIconBg } from "@/components/categoryIconColor"

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
  const handleLang = (next: Lang) => { setLang(next); saveLang(next) }

  if (!hydrated) {
    return <div className="min-h-screen" style={{ background: "var(--ios-bg)" }} />
  }

  const empty = stats.totalGames === 0
  const accuracy = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0

  return (
    <>
      <IOSScaffold title={t("statsTitle")} lang={lang} onLangChange={handleLang}>
        {empty ? (
          <IOSSection>
            <IOSRow withSeparator={false}>
              <span style={{ color: "var(--ios-label-secondary)", fontSize: "var(--type-body)" }}>
                {t("statsEmpty")}
              </span>
            </IOSRow>
          </IOSSection>
        ) : (
          <>
            <IOSSection header={t("statSummary")}>
              <SummaryRow label={t("statTotalGames")} value={String(stats.totalGames)} first />
              <SummaryRow label={t("statAccuracy")} value={`${accuracy}%`} />
              <SummaryRow label={t("statBestScore")} value={String(stats.bestScore)} />
            </IOSSection>

            <IOSSection header={t("statStreaks")}>
              <SummaryRow label={t("statCurrentStreak")} value={String(stats.currentStreak)} first />
              <SummaryRow label={t("statLongestStreak")} value={String(stats.longestStreak)} />
            </IOSSection>

            <IOSSection header={t("statByCategory")}>
              {categories.map((cat, i) => {
                const s = stats.perCategory[cat.id]
                const acc = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0
                return (
                  <IOSRow key={cat.id} withSeparator={i > 0}>
                    <div className="flex items-center gap-3 w-full">
                      <span
                        className="inline-flex items-center justify-center flex-shrink-0"
                        style={{ width: 32, height: 32, borderRadius: 9, background: categoryIconBg(cat.id), fontSize: 16 }}
                      >
                        {cat.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className="truncate"
                          style={{ fontSize: "var(--type-body)", fontWeight: 500, color: "var(--ios-label)", letterSpacing: "-0.01em" }}
                        >
                          {cat.name[lang]}
                        </div>
                        <div className="mt-1 relative" style={{ height: 6, borderRadius: 3, background: "rgba(60, 60, 67, 0.10)" }}>
                          <div
                            className="absolute top-0 bottom-0 left-0"
                            style={{
                              width: `${acc}%`,
                              borderRadius: 3,
                              background: s ? "var(--ca-red)" : "transparent",
                              transition: "width 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="flex-shrink-0 text-right"
                        style={{ minWidth: 56, fontSize: "var(--type-footnote)", color: "var(--ios-label-secondary)", fontVariantNumeric: "tabular-nums" }}
                      >
                        {s ? `${acc}%` : "—"}
                      </div>
                    </div>
                  </IOSRow>
                )
              })}
            </IOSSection>
          </>
        )}
      </IOSScaffold>
      <TabBar />
    </>
  )
}

function SummaryRow({ label, value, first = false }: { label: string; value: string; first?: boolean }) {
  return (
    <IOSRow withSeparator={!first}>
      <div className="flex items-center justify-between w-full">
        <span style={{ fontSize: "var(--type-body)", color: "var(--ios-label)" }}>{label}</span>
        <span
          style={{
            fontSize: "var(--type-body)",
            color: "var(--ios-label-secondary)",
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
      </div>
    </IOSRow>
  )
}
