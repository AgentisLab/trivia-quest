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
      className="relative inline-flex flex-shrink-0 cursor-pointer"
      style={{
        width: 51,
        height: 31,
        borderRadius: 999,
        background: checked ? "var(--ios-green)" : "rgba(120, 120, 128, 0.16)",
        border: 0,
        padding: 0,
        transition: "background 200ms ease",
      }}
    >
      <span
        className="absolute"
        style={{
          top: 2,
          left: checked ? 22 : 2,
          width: 27,
          height: 27,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.06)",
          transition: "left 200ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      />
    </button>
  )
}
