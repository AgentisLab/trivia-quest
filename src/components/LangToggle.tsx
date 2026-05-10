"use client"

import { Lang } from "@/data/types"

interface Props {
  lang: Lang
  onChange: (lang: Lang) => void
  size?: "sm" | "md"
}

export default function LangToggle({ lang, onChange, size = "md" }: Props) {
  const itemPadding = size === "sm" ? "5px 12px" : "6px 14px"
  const fontSize = size === "sm" ? 12 : 13

  return (
    <div
      role="tablist"
      aria-label="Language"
      className="inline-flex select-none"
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--separator)",
        borderRadius: 999,
        padding: 3,
        gap: 2,
        fontSize,
        fontWeight: 600,
      }}
    >
      {(["en", "fr"] as const).map((value) => {
        const active = lang === value
        return (
          <button
            key={value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className="press cursor-pointer"
            style={{
              padding: itemPadding,
              borderRadius: 999,
              border: 0,
              background: active ? "var(--ink-100)" : "transparent",
              color: active ? "#000" : "var(--ink-60)",
              letterSpacing: "-0.005em",
            }}
          >
            {value.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
