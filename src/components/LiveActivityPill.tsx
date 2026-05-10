"use client"

import { ReactNode } from "react"

interface PillSegment {
  key: string
  value?: ReactNode
  label: ReactNode
}

interface Props {
  segments: PillSegment[]
}

export default function LiveActivityPill({ segments }: Props) {
  return (
    <div
      className="mx-auto flex w-fit items-center gap-2.5"
      style={{
        marginTop: 6,
        padding: "7px 14px",
        borderRadius: 999,
        background: "var(--pill-bg)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        border: "1px solid var(--separator)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        color: "var(--ink-80)",
      }}
    >
      {segments.map((seg, i) => (
        <span key={seg.key} className="flex items-center gap-2.5">
          {i > 0 && (
            <span
              aria-hidden
              style={{ width: 1, height: 11, background: "var(--pill-divider)" }}
            />
          )}
          <span className="flex items-center gap-1.5">
            {seg.value !== undefined && (
              <span
                style={{
                  color: "var(--ink-100)",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {seg.value}
              </span>
            )}
            <span>{seg.label}</span>
          </span>
        </span>
      ))}
    </div>
  )
}
