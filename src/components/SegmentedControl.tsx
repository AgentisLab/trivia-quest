"use client"

interface Option<T extends string | number> {
  value: T
  label: string
}

interface Props<T extends string | number> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel?: string
  size?: "sm" | "md"
}

export default function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
}: Props<T>) {
  const padding = size === "sm" ? "3px" : "3px"
  const itemPadding = size === "sm" ? "5px 12px" : "8px 16px"
  const fontSize = size === "sm" ? 12 : 13

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex w-full"
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--separator)",
        borderRadius: 999,
        padding,
        gap: 2,
      }}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={String(option.value)}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className="press flex-1 cursor-pointer text-center"
            style={{
              padding: itemPadding,
              borderRadius: 999,
              border: 0,
              background: active ? "var(--ink-100)" : "transparent",
              color: active ? "#000" : "var(--ink-60)",
              fontSize,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
