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
          className="px-[26px]"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 28px)" }}
        >
          <h1
            className="m-0"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--ink-100)",
            }}
          >
            {t("settingsTitle")}
          </h1>
        </header>

        <div className="px-[26px] pb-[120px] pt-8">
          <Section kicker={t("settingsLanguage")}>
            <Row>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--ink-80)",
                  letterSpacing: "-0.005em",
                }}
              >
                {t("settingsLanguage")}
              </span>
              <LangToggle lang={lang} onChange={handleLang} size="sm" />
            </Row>
          </Section>

          <Section kicker={t("settingsGameplay")}>
            <Row>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--ink-80)",
                  letterSpacing: "-0.005em",
                }}
              >
                {t("settingsSound")}
              </span>
              <IOSSwitch checked={sound} onChange={handleSound} ariaLabel={t("settingsSound")} />
            </Row>
            <Row last>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--ink-80)",
                  letterSpacing: "-0.005em",
                }}
              >
                {t("settingsHaptics")}
              </span>
              <IOSSwitch
                checked={haptics}
                onChange={handleHaptics}
                ariaLabel={t("settingsHaptics")}
              />
            </Row>
          </Section>

          <Section kicker={t("settingsData")}>
            <button
              type="button"
              onClick={handleResetStats}
              className="press w-full text-left"
              style={{
                padding: "16px 0",
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
          </Section>
        </div>
      </div>
      <TabBar />
    </>
  )
}

function Section({
  kicker,
  children,
}: {
  kicker: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-9 first:mt-0">
      <p
        className="m-0 mb-3"
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-60)",
        }}
      >
        {kicker}
      </p>
      <div style={{ borderTop: "1px solid var(--separator)" }}>{children}</div>
    </section>
  )
}

function Row({ children, last = false }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "14px 0",
        minHeight: 50,
        borderBottom: last ? "none" : "1px solid var(--separator)",
      }}
    >
      {children}
    </div>
  )
}
