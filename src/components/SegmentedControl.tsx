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
}

export default function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
}: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex w-full rounded-[10px] p-[2px] gap-[2px]"
      style={{ background: "var(--ios-fill-tertiary)" }}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={String(option.value)}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className="flex-1 rounded-[8px] py-1.5 text-center cursor-pointer transition-all duration-200"
            style={{
              background: active ? "var(--ios-surface)" : "transparent",
              color: active ? "var(--ios-label)" : "var(--ios-label-secondary)",
              boxShadow: active ? "0 1px 2px rgba(15, 15, 25, 0.10)" : "none",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
