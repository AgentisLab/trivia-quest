"use client"

import { Lang } from "@/data/types"
import { Category, categories } from "@/data/questions"
import { ui } from "@/data/ui-strings"
import { GameLength, GAME_LENGTHS } from "@/lib/preferences"
import LangToggle from "./LangToggle"
import SegmentedControl from "./SegmentedControl"
import { ChevronRightIcon } from "./icons"
import { categoryIconBg } from "./categoryIconColor"

interface Props {
  lang: Lang
  onLangChange: (lang: Lang) => void
  gameLength: GameLength
  onGameLengthChange: (length: GameLength) => void
  onSelectCategory: (cat: Category) => void
  onRandomMix: () => void
}

export default function MenuScreen({
  lang,
  onLangChange,
  gameLength,
  onGameLengthChange,
  onSelectCategory,
  onRandomMix,
}: Props) {
  const t = (key: string) => ui[key]?.[lang] || key

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--ios-bg)" }}>
      {/* Translucent nav bar */}
      <div
        className="ios-nav sticky top-0 z-20 flex items-center justify-end"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <LangToggle lang={lang} onChange={onLangChange} />
      </div>

      {/* Scroll body */}
      <div className="flex-1 px-5 pb-32">
        <div className="pt-2 pb-6">
          <span
            className="inline-flex items-center gap-1.5 rounded-full font-semibold mb-3.5"
            style={{
              fontSize: 13,
              letterSpacing: "0.02em",
              color: "var(--ca-red)",
              background: "var(--ca-red-soft)",
              padding: "5px 10px",
            }}
          >
            <span aria-hidden>🍁</span>
            {t("pretitle")}
          </span>
          <h1
            style={{
              fontSize: "var(--type-large-title)",
              fontWeight: 800,
              lineHeight: 1.07,
              letterSpacing: "-0.025em",
              margin: 0,
              color: "var(--ios-label)",
            }}
          >
            {t("subtitle")}
          </h1>
          <p
            className="mt-2 font-medium"
            style={{ fontSize: "var(--type-subhead)", color: "var(--ios-label-secondary)", lineHeight: 1.4 }}
          >
            {t("heroMeta")}
          </p>
        </div>

        {/* Game length picker */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <span
              style={{
                fontSize: "var(--type-footnote)",
                color: "var(--ios-label-secondary)",
                fontWeight: 600,
                letterSpacing: 0.02,
                textTransform: "uppercase",
              }}
            >
              {t("gameLengthPickerLabel")}
            </span>
          </div>
          <SegmentedControl
            ariaLabel={t("gameLengthPickerLabel")}
            value={gameLength}
            onChange={onGameLengthChange}
            options={GAME_LENGTHS.map((n) => ({ value: n, label: String(n) }))}
          />
        </div>

        {/* Featured Random Mix */}
        <button
          onClick={onRandomMix}
          className="ios-press relative overflow-hidden w-full text-left mb-7"
          style={{
            padding: 22,
            background: "linear-gradient(135deg, #ffffff 0%, #fff5f4 60%, #ffe9e6 100%)",
            borderRadius: "var(--radius-card)",
            border: "0.5px solid rgba(213, 43, 30, 0.18)",
            boxShadow: "var(--shadow-card)",
            color: "inherit",
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute"
            style={{ right: -10, top: -10, fontSize: 100, opacity: 0.07, transform: "rotate(15deg)" }}
          >
            🍁
          </span>
          <div className="flex items-center gap-4 relative">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 56,
                height: 56,
                background: "var(--ca-red)",
                color: "#fff",
                borderRadius: 16,
                fontSize: 28,
                boxShadow: "0 6px 14px rgba(213, 43, 30, 0.32)",
              }}
            >
              🎲
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="block"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--ca-red-deep)",
                  marginBottom: 4,
                }}
              >
                {t("recommended")}
              </span>
              <p
                className="m-0"
                style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--ios-label)" }}
              >
                {t("randomMix")}
              </p>
              <p className="m-0 mt-0.5" style={{ fontSize: 14, color: "var(--ios-label-secondary)" }}>
                {gameLength} {t("questionsLabel")} · {t("randomMixDesc")}
              </p>
            </div>
            <span style={{ color: "var(--ios-label-tertiary)", flexShrink: 0 }}>
              <ChevronRightIcon />
            </span>
          </div>
        </button>

        {/* Section header */}
        <div className="flex items-baseline justify-between px-1 pb-2.5 mt-1.5">
          <h2
            style={{
              fontSize: "var(--type-title-2)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--ios-label)",
              margin: 0,
            }}
          >
            {t("chooseCategory")}
          </h2>
          <span style={{ fontSize: "var(--type-footnote)", fontWeight: 500, color: "var(--ios-label-secondary)" }}>
            {categories.length} · 50 {t("questionsLabel")}
          </span>
        </div>

        {/* Category grouped table */}
        <div
          className="overflow-hidden"
          style={{
            background: "var(--ios-surface)",
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="ios-press relative w-full flex items-center text-left"
              style={{ padding: "14px 16px", gap: 14, background: "transparent", color: "inherit" }}
            >
              {i > 0 && (
                <span
                  className="ios-separator absolute"
                  style={{ top: 0, left: 70, right: 16, height: "0.5px" }}
                  aria-hidden
                />
              )}
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: categoryIconBg(cat.id),
                  fontSize: 22,
                }}
              >
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="block"
                  style={{
                    fontSize: "var(--type-headline)",
                    fontWeight: 600,
                    color: "var(--ios-label)",
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {cat.name[lang]}
                </span>
                <span
                  className="block overflow-hidden"
                  style={{
                    fontSize: "var(--type-footnote)",
                    color: "var(--ios-label-secondary)",
                    lineHeight: 1.35,
                    marginTop: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis",
                  }}
                >
                  {cat.description[lang]}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  style={{
                    fontSize: "var(--type-caption-1)",
                    color: "var(--ios-label-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {cat.questions.length} {t("questionsCount")}
                </span>
                <span style={{ color: "var(--ios-label-tertiary)" }}>
                  <ChevronRightIcon />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
