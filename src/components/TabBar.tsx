"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Lang } from "@/data/types"
import { ui } from "@/data/ui-strings"
import { loadLang } from "@/lib/preferences"
import { PlayIcon, StatsIcon, GearIcon } from "./icons"

const tabs = [
  { href: "/", labelKey: "tabPlay", Icon: PlayIcon },
  { href: "/stats", labelKey: "tabStats", Icon: StatsIcon },
  { href: "/settings", labelKey: "tabSettings", Icon: GearIcon },
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
      className="ios-tabbar fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around"
      style={{
        paddingTop: 6,
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
      }}
    >
      {tabs.map(({ href, labelKey, Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-[3px] py-2 px-1 transition-colors"
            style={{
              color: active ? "var(--ca-red)" : "var(--ios-label-tertiary)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.01em",
            }}
          >
            <Icon />
            <span>{ui[labelKey][lang]}</span>
          </Link>
        )
      })}
    </nav>
  )
}
