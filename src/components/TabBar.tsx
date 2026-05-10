"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Lang } from "@/data/types"
import { ui } from "@/data/ui-strings"
import { loadLang } from "@/lib/preferences"
import { PlayTabIcon, StatsTabIcon, SettingsTabIcon } from "./icons"

const tabs = [
  { href: "/", labelKey: "tabPlay", Icon: PlayTabIcon },
  { href: "/stats", labelKey: "tabStats", Icon: StatsTabIcon },
  { href: "/settings", labelKey: "tabSettings", Icon: SettingsTabIcon },
] as const

export default function TabBar() {
  const pathname = usePathname()
  const [lang, setLang] = useState<Lang>("en")

  useEffect(() => {
    setLang(loadLang())
    const onStorage = (e: StorageEvent) => {
      if (e.key === "trivia-lang") setLang(loadLang())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around"
      style={{
        background: "var(--tabbar-bg)",
        backdropFilter: "blur(30px) saturate(140%)",
        WebkitBackdropFilter: "blur(30px) saturate(140%)",
        borderTop: "1px solid var(--separator)",
        paddingTop: 8,
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
      }}
    >
      {tabs.map(({ href, labelKey, Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="press flex flex-1 flex-col items-center justify-center gap-[3px] px-1 py-1.5"
            style={{
              color: active ? "var(--ink-100)" : "var(--ink-40)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "-0.005em",
            }}
          >
            <Icon width={22} height={22} />
            <span>{ui[labelKey][lang]}</span>
          </Link>
        )
      })}
    </nav>
  )
}
