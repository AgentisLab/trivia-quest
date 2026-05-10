"use client"

import { useEffect, useState } from "react"
import { Lang } from "@/data/types"
import { ui } from "@/data/ui-strings"
import {
  loadLang,
  saveLang,
  loadBoolPref,
  saveBoolPref,
  PREF_KEYS,
} from "@/lib/preferences"
import { clearStats } from "@/lib/stats"
import IOSSwitch from "@/components/IOSSwitch"
import LangToggle from "@/components/LangToggle"
import TabBar from "@/components/TabBar"

export default function SettingsPage() {
  const [hydrated, setHydrated] = useState(false)
  const [lang, setLang] = useState<Lang>("en")
  const [sound, setSound] = useState(false)
  const [haptics, setHaptics] = useState(false)

  useEffect(() => {
    setLang(loadLang())
    setSound(loadBoolPref(PREF_KEYS.sound))
    setHaptics(loadBoolPref(PREF_KEYS.haptics))
    setHydrated(true)
  }, [])

  const t = (key: string) => ui[key]?.[lang] || key
  const handleLang = (next: Lang) => {
    setLang(next)
    saveLang(next)
  }

  const handleSound = (next: boolean) => {
    setSound(next)
    saveBoolPref(PREF_KEYS.sound, next)
  }

  const handleHaptics = (next: boolean) => {
    setHaptics(next)
    saveBoolPref(PREF_KEYS.haptics, next)
    if (next && typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(20)
      } catch {
        /* no-op */
      }
    }
  }

  const handleResetStats = () => {
    if (typeof window === "undefined") return
    if (window.confirm(t("statsResetConfirm"))) {
      clearStats()
    }
  }

  if (!hydrated) {
    return <div className="min-h-screen" style={{ background: "var(--bg-1)" }} />
  }

  return (
    <>
      <div
        className="min-h-screen"
        style={{ background: "var(--bg-0)", color: "var(--ink-100)" }}
      >
        <header
          className="px-[22px]"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)" }}
        >
          <h1
            className="m-0"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--ink-100)",
            }}
          >
            {t("settingsTitle")}
          </h1>
        </header>

        <div className="px-[22px] pb-[120px] pt-6">
          <SectionHeader>{t("settingsLanguage")}</SectionHeader>
          <Card>
            <Row>
              <span style={{ fontSize: 15, color: "var(--ink-100)" }}>{t("settingsLanguage")}</span>
              <LangToggle lang={lang} onChange={handleLang} size="sm" />
            </Row>
          </Card>

          <SectionHeader>{t("settingsGameplay")}</SectionHeader>
          <Card>
            <Row>
              <span style={{ fontSize: 15, color: "var(--ink-100)" }}>{t("settingsSound")}</span>
              <IOSSwitch checked={sound} onChange={handleSound} ariaLabel={t("settingsSound")} />
            </Row>
            <Row last>
              <span style={{ fontSize: 15, color: "var(--ink-100)" }}>{t("settingsHaptics")}</span>
              <IOSSwitch
                checked={haptics}
                onChange={handleHaptics}
                ariaLabel={t("settingsHaptics")}
              />
            </Row>
          </Card>

          <SectionHeader>{t("settingsData")}</SectionHeader>
          <Card>
            <button
              type="button"
              onClick={handleResetStats}
              className="press w-full text-left"
              style={{
                padding: "14px 16px",
                background: "transparent",
                border: 0,
                color: "var(--danger)",
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              {t("settingsResetStats")}
            </button>
          </Card>
        </div>
      </div>
      <TabBar />
    </>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mx-1 mb-2 mt-6"
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: "var(--ink-60)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--separator)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  )
}

function Row({ children, last = false }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "12px 16px",
        minHeight: 50,
        borderBottom: last ? "none" : "1px solid var(--separator)",
      }}
    >
      {children}
    </div>
  )
}
