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
import { IOSScaffold, IOSSection, IOSRow } from "@/components/IOSScaffold"
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
  const handleLang = (next: Lang) => { setLang(next); saveLang(next) }

  const handleSound = (next: boolean) => {
    setSound(next)
    saveBoolPref(PREF_KEYS.sound, next)
  }

  const handleHaptics = (next: boolean) => {
    setHaptics(next)
    saveBoolPref(PREF_KEYS.haptics, next)
    if (next && typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try { navigator.vibrate(20) } catch { /* no-op */ }
    }
  }

  const handleResetStats = () => {
    if (typeof window === "undefined") return
    if (window.confirm(t("statsResetConfirm"))) {
      clearStats()
    }
  }

  if (!hydrated) {
    return <div className="min-h-screen" style={{ background: "var(--ios-bg)" }} />
  }

  return (
    <>
      <IOSScaffold title={t("settingsTitle")} lang={lang} onLangChange={handleLang} showLangToggle={false}>
        <IOSSection header={t("settingsLanguage")}>
          <IOSRow withSeparator={false}>
            <div className="flex items-center justify-between w-full">
              <span style={{ fontSize: "var(--type-body)" }}>{t("settingsLanguage")}</span>
              <LangToggle lang={lang} onChange={handleLang} />
            </div>
          </IOSRow>
        </IOSSection>

        <IOSSection header={t("settingsGameplay")}>
          <IOSRow withSeparator={false}>
            <div className="flex items-center justify-between w-full">
              <span style={{ fontSize: "var(--type-body)" }}>{t("settingsSound")}</span>
              <IOSSwitch checked={sound} onChange={handleSound} ariaLabel={t("settingsSound")} />
            </div>
          </IOSRow>
          <IOSRow>
            <div className="flex items-center justify-between w-full">
              <span style={{ fontSize: "var(--type-body)" }}>{t("settingsHaptics")}</span>
              <IOSSwitch checked={haptics} onChange={handleHaptics} ariaLabel={t("settingsHaptics")} />
            </div>
          </IOSRow>
        </IOSSection>

        <IOSSection header={t("settingsData")}>
          <IOSRow withSeparator={false} onClick={handleResetStats} destructive>
            <span style={{ fontSize: "var(--type-body)", fontWeight: 500 }}>
              {t("settingsResetStats")}
            </span>
          </IOSRow>
        </IOSSection>
      </IOSScaffold>
      <TabBar />
    </>
  )
}
