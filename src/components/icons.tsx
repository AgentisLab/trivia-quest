import { SVGProps } from "react"

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
    </svg>
  )
}

export function StatsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 21V10M12 21V3M19 21v-7" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  )
}

export function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" strokeWidth={2} />
      <path
        d="M19.4 13a1.6 1.6 0 010-2l1.5-1.2-1.7-3-1.8.7a1.6 1.6 0 01-1.7-1L15 4.5h-3l-.7 1.9a1.6 1.6 0 01-1.7 1l-1.8-.7-1.7 3 1.5 1.2a1.6 1.6 0 010 2L5.1 14.2l1.7 3 1.8-.7a1.6 1.6 0 011.7 1l.7 1.9h3l.7-1.9a1.6 1.6 0 011.7-1l1.8.7 1.7-3-1.5-1.2z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" {...props}>
      <path d="M2.5 7.2L5.6 10l5.9-6.3" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CrossIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" {...props}>
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  )
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={8} height={14} viewBox="0 0 8 14" fill="none" {...props}>
      <path d="M1 1l5.5 6L1 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SparklesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}
