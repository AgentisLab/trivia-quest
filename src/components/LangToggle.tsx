"use client"

import { Lang } from "@/data/types"

interface Props {
  lang: Lang
  onChange: (lang: Lang) => void
  size?: "sm" | "md"
}

export default function LangToggle({ lang, onChange, size = "md" }: Props) {
  const padding = size === "sm" ? "p-[2px]" : "p-[3px]"
  const itemPadding = size === "sm" ? "px-2.5 py-1" : "px-3 py-[5px]"
  const fontSize = size === "sm" ? 12 : 13

  return (
    <div
      role="tablist"
      aria-label="Language"
      className={`inline-flex rounded-full ${padding} select-none`}
      style={{ background: "var(--ios-fill-tertiary)", fontSize, fontWeight: 600 }}
    >
      {(["en", "fr"] as const).map((value) => {
        const active = lang === value
        return (
          <button
            key={value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className={`${itemPadding} rounded-full transition-all duration-200 cursor-pointer`}
            style={{
              background: active ? "var(--ios-surface)" : "transparent",
              color: active ? "var(--ios-label)" : "var(--ios-label-secondary)",
              boxShadow: active ? "0 1px 2px rgba(15, 15, 25, 0.08)" : "none",
            }}
          >
            {value.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
