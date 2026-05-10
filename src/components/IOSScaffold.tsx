"use client"

import { ReactNode } from "react"
import { Lang } from "@/data/types"
import LangToggle from "./LangToggle"

interface ScaffoldProps {
  title: string
  lang: Lang
  onLangChange?: (lang: Lang) => void
  children: ReactNode
  showLangToggle?: boolean
}

export function IOSScaffold({ title, lang, onLangChange, children, showLangToggle = true }: ScaffoldProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--ios-bg)" }}>
      <div
        className="ios-nav sticky top-0 z-20 flex items-center justify-end"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          minHeight: 44,
        }}
      >
        {showLangToggle && onLangChange && <LangToggle lang={lang} onChange={onLangChange} />}
      </div>
      <div className="px-5 pb-32 flex-1">
        <h1
          className="pt-2 pb-5"
          style={{
            fontSize: "var(--type-large-title)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "var(--ios-label)",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {children}
      </div>
    </div>
  )
}

interface SectionProps {
  header?: string
  footer?: string
  children: ReactNode
}

export function IOSSection({ header, footer, children }: SectionProps) {
  return (
    <section className="mb-6">
      {header && (
        <div
          className="px-1 pb-2"
          style={{
            fontSize: "var(--type-footnote)",
            fontWeight: 600,
            color: "var(--ios-label-secondary)",
            letterSpacing: 0.02,
            textTransform: "uppercase",
          }}
        >
          {header}
        </div>
      )}
      <div
        className="overflow-hidden"
        style={{
          background: "var(--ios-surface)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {children}
      </div>
      {footer && (
        <div
          className="px-1 pt-2"
          style={{
            fontSize: "var(--type-caption-1)",
            color: "var(--ios-label-secondary)",
          }}
        >
          {footer}
        </div>
      )}
    </section>
  )
}

interface RowProps {
  children: ReactNode
  withSeparator?: boolean
  onClick?: () => void
  destructive?: boolean
}

export function IOSRow({ children, withSeparator = true, onClick, destructive = false }: RowProps) {
  const Tag = onClick ? "button" : "div"
  return (
    <div className="relative">
      {withSeparator && (
        <span
          className="ios-separator absolute"
          style={{ top: 0, left: 16, right: 16, height: "0.5px" }}
          aria-hidden
        />
      )}
      <Tag
        onClick={onClick}
        className={onClick ? "ios-press w-full text-left flex items-center cursor-pointer" : "flex items-center"}
        style={{
          padding: "12px 16px",
          minHeight: 44,
          background: "transparent",
          border: 0,
          color: destructive ? "var(--ios-red)" : "var(--ios-label)",
          font: "inherit",
          width: "100%",
        }}
      >
        {children}
      </Tag>
    </div>
  )
}
