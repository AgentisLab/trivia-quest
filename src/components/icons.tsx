import type { ComponentProps } from "react"

type IconProps = ComponentProps<"svg">

const baseStroke: IconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
}

export function PlaySolidIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} strokeWidth={2} {...props}>
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} strokeWidth={2.4} {...props}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  )
}

export function CrossIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} strokeWidth={2.4} {...props}>
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  )
}

export function PlayTabIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 3l9 8h-3v9h-4v-6h-4v6H6v-9H3l9-8z" />
    </svg>
  )
}

export function StatsTabIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  )
}

export function SettingsTabIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  )
}

/* ---- Category icons (monoline, hairline weight) ---- */

function SportsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <path d="M3 21h18M5 17l11-11 3 3L8 20Z" />
      <circle cx="6.5" cy="18.5" r="1.5" />
    </svg>
  )
}

function ScienceIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <path d="M9 3h6M10 3v6L4 21h16L14 9V3" />
    </svg>
  )
}

function GeographyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <circle cx="12" cy="10" r="3" />
      <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z" />
    </svg>
  )
}

function NatureIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <path d="M12 3c-3 4-4.5 7-4.5 10a4.5 4.5 0 0 0 9 0c0-3-1.5-6-4.5-10Z" />
    </svg>
  )
}

function PopCultureIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <path d="M12 3l2.5 6.5L21 9.5l-5 4.5L17.5 21 12 17l-5.5 4L8 14 3 9.5h6.5L12 3Z" />
    </svg>
  )
}

function WorldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </svg>
  )
}

function HistoryIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function FoodIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <path d="M4 11h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z" />
      <path d="M8 8c0-2 1-3 1-3M12 8c0-2 1-3 1-3M16 8c0-2 1-3 1-3" />
    </svg>
  )
}

function ArtsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <path d="M4 19l8-14 8 14H4z" />
      <circle cx="12" cy="14" r="2" />
    </svg>
  )
}

function IndigenousIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18" />
    </svg>
  )
}

function MusicIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <path d="M9 17V5l11-2v12" />
      <circle cx="6" cy="17" r="3" />
      <circle cx="17" cy="15" r="3" />
    </svg>
  )
}

function CinemaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseStroke} {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M3 14h18" />
    </svg>
  )
}

const categoryIconMap = {
  1: SportsIcon,
  2: ScienceIcon,
  3: GeographyIcon,
  4: NatureIcon,
  5: PopCultureIcon,
  6: WorldIcon,
  7: HistoryIcon,
  8: FoodIcon,
  9: ArtsIcon,
  10: IndigenousIcon,
  11: MusicIcon,
  12: CinemaIcon,
} satisfies Record<number, (props: IconProps) => React.ReactNode>

interface CategoryIconProps {
  id: number
  width?: number | string
  height?: number | string
  className?: string
  style?: React.CSSProperties
}

export function CategoryIcon({ id, ...rest }: CategoryIconProps) {
  const Icon = (categoryIconMap as Record<number, (p: IconProps) => React.ReactNode>)[id] ?? WorldIcon
  return <Icon {...rest} />
}
