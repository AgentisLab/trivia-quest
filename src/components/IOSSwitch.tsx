"use client"

interface Props {
  checked: boolean
  onChange: (next: boolean) => void
  ariaLabel?: string
}

export default function IOSSwitch({ checked, onChange, ariaLabel }: Props) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className="press relative inline-flex flex-shrink-0 cursor-pointer"
      style={{
        width: 51,
        height: 31,
        borderRadius: 999,
        background: checked ? "var(--accent)" : "var(--switch-track-off)",
        border: "1px solid var(--separator)",
        padding: 0,
        transition: "background 200ms ease",
      }}
    >
      <span
        className="absolute"
        style={{
          top: 2,
          left: checked ? 22 : 2,
          width: 25,
          height: 25,
          borderRadius: "50%",
          background: "var(--switch-knob)",
          boxShadow: "var(--switch-knob-shadow)",
          transition: "left 200ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      />
    </button>
  )
}
