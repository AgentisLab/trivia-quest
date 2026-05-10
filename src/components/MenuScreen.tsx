"use client"

import { useEffect, useState, useMemo } from "react"
import { Lang } from "@/data/types"
import { Category, categories } from "@/data/questions"
import { ui } from "@/data/ui-strings"
import { GameLength, GAME_LENGTHS } from "@/lib/preferences"
import { TriviaStats, emptyStats, loadStats } from "@/lib/stats"
import LiveActivityPill from "./LiveActivityPill"
import SegmentedControl from "./SegmentedControl"
import { CategoryIcon, PlaySolidIcon } from "./icons"

interface Props {
  lang: Lang
  gameLength: GameLength
  onGameLengthChange: (length: GameLength) => void
  onSelectCategory: (cat: Category) => void
  onRandomMix: () => void
  randomMixCount: number
}

const TRENDING_IDS = [11, 1] as const
const SPOTLIGHT_ID = 12

function greetingKey(): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  const h = new Date().getHours()
  if (h < 12) return "greetingMorning"
  if (h < 18) return "greetingAfternoon"
  return "greetingEvening"
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

  const trending = TRENDING_IDS.map((id) => categories.find((c) => c.id === id)).filter(
    (c): c is Category => Boolean(c)
  )
  const spotlight = categories.find((c) => c.id === SPOTLIGHT_ID)
  const standard = useMemo(
    () =>
      categories.filter(
        (c) => !TRENDING_IDS.includes(c.id as 11 | 1) && c.id !== SPOTLIGHT_ID
      ),
    []
  )

  const greeting = t(greetingKey())

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

      <header className="px-[22px] pt-6 pb-2">
        <p
          className="m-0 mb-1.5"
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
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            color: "var(--ink-100)",
          }}
        >
          {t("menuTitle")}
        </h1>
      </header>

      <div className="flex-1 px-[18px] pb-[120px]">
        {/* Game length picker */}
        <div className="mb-2 mt-3">
          <SectionLabel left={t("gameLengthPickerLabel")} right={`${gameLength} ${t("questionsLabel")}`} />
          <SegmentedControl
            ariaLabel={t("gameLengthPickerLabel")}
            value={gameLength}
            onChange={onGameLengthChange}
            options={GAME_LENGTHS.map((n) => ({ value: n, label: String(n) }))}
          />
        </div>

        {/* Featured */}
        <SectionLabel left={t("sectionFeatured")} right={`${randomMixCount} ${t("questionsLabel")}`} />
        <button
          type="button"
          onClick={onRandomMix}
          className="press w-full text-left"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px",
            height: 128,
            borderRadius: 20,
            background: "linear-gradient(180deg, #1a1a1c 0%, #0e0e10 100%)",
            border: "1px solid var(--separator)",
            color: "inherit",
          }}
        >
          <div className="flex min-w-0 flex-col gap-1">
            <p
              className="m-0 mb-1"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-60)",
              }}
            >
              {t("recommended")}
            </p>
            <p
              className="m-0"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--ink-100)",
                lineHeight: 1.1,
              }}
            >
              {t("randomMix")}
            </p>
            <p
              className="m-0 mt-1"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--ink-60)",
                letterSpacing: "-0.005em",
              }}
            >
              {t("randomMixDesc")}
            </p>
          </div>
          <span
            aria-hidden
            className="flex flex-shrink-0 items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "#fff",
            }}
          >
            <PlaySolidIcon width={16} height={16} style={{ marginLeft: 2 }} />
          </span>
        </button>

        {/* Trending */}
        <SectionLabel left={t("sectionTrending")} />
        <div className="grid grid-cols-2 gap-2.5">
          {trending.map((cat, i) => (
            <MediumTile
              key={cat.id}
              cat={cat}
              lang={lang}
              tag={i === 0 ? t("trendingNumberOne") : t("trendingTag")}
              onClick={() => onSelectCategory(cat)}
              t={t}
            />
          ))}
        </div>

        {/* All categories */}
        <SectionLabel left={t("sectionAll")} right={String(categories.length)} />
        <div className="grid grid-cols-2 gap-2.5">
          {standard.map((cat) => (
            <StandardTile
              key={cat.id}
              cat={cat}
              lang={lang}
              onClick={() => onSelectCategory(cat)}
              t={t}
            />
          ))}
          {spotlight && (
            <SpotlightTile
              cat={spotlight}
              lang={lang}
              onClick={() => onSelectCategory(spotlight)}
              t={t}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ left, right }: { left: string; right?: string }) {
  return (
    <div className="mx-1 mb-2.5 mt-[18px] flex items-baseline justify-between">
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--ink-60)",
          letterSpacing: "-0.005em",
        }}
      >
        {left}
      </span>
      {right && (
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-60)" }}>{right}</span>
      )}
    </div>
  )
}

interface TileProps {
  cat: Category
  lang: Lang
  onClick: () => void
  t: (key: string) => string
}

function MediumTile({ cat, lang, tag, onClick }: TileProps & { tag: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press text-left"
      style={{
        height: 118,
        padding: 14,
        borderRadius: 18,
        background: "var(--bg-2)",
        border: "1px solid var(--separator)",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className="flex items-center justify-center"
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: "var(--bg-3)",
            color: "var(--ink-100)",
          }}
        >
          <CategoryIcon id={cat.id} width={16} height={16} />
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--ink-60)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {tag}
        </span>
      </div>
      <div>
        <p
          className="m-0"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.015em",
            color: "var(--ink-100)",
            lineHeight: 1.1,
          }}
        >
          {cat.name[lang]}
        </p>
        <p
          className="m-0 mt-1"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--ink-60)",
            letterSpacing: "-0.005em",
          }}
        >
          {cat.questions.length} Qs
        </p>
      </div>
    </button>
  )
}

function StandardTile({ cat, lang, onClick }: TileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press text-left"
      style={{
        height: 104,
        padding: 13,
        borderRadius: 16,
        background: "var(--bg-2)",
        border: "1px solid var(--separator)",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <span
        className="flex items-center justify-center"
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "var(--bg-3)",
          color: "var(--ink-100)",
        }}
      >
        <CategoryIcon id={cat.id} width={15} height={15} />
      </span>
      <div>
        <p
          className="m-0"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.012em",
            color: "var(--ink-100)",
            lineHeight: 1.1,
          }}
        >
          {cat.name[lang]}
        </p>
        <p
          className="m-0 mt-0.5"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--ink-60)",
            letterSpacing: "-0.005em",
          }}
        >
          {cat.questions.length} Qs
        </p>
      </div>
    </button>
  )
}

function SpotlightTile({ cat, lang, onClick, t }: TileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press col-span-2 text-left"
      style={{
        height: 90,
        padding: 13,
        borderRadius: 16,
        background: "var(--bg-2)",
        border: "1px solid var(--separator)",
        color: "inherit",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <span
        className="flex flex-shrink-0 items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "var(--bg-3)",
          color: "var(--ink-100)",
        }}
      >
        <CategoryIcon id={cat.id} width={17} height={17} />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="m-0"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.012em",
            color: "var(--ink-100)",
            lineHeight: 1.1,
          }}
        >
          {cat.name[lang]}
        </p>
        <p
          className="m-0 mt-0.5"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--ink-60)",
            letterSpacing: "-0.005em",
          }}
        >
          {cat.questions.length} Qs · {t("addedThisWeek")}
        </p>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--accent)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {t("newTag")}
      </span>
    </button>
  )
}
