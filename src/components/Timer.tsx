"use client"

import { useEffect, useState } from "react"

interface TimerProps {
  duration: number
  onTimeUp: () => void
  resetKey: number
  paused?: boolean
}

export default function Timer({ duration, onTimeUp, resetKey, paused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    setTimeLeft(duration)
  }, [resetKey, duration])

  useEffect(() => {
    if (paused) return
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timeLeft, onTimeUp, paused])

  const radius = 26
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.max(timeLeft, 0) / duration) * circumference

  const phase: "ok" | "warn" | "danger" = timeLeft <= 5 ? "danger" : timeLeft <= 10 ? "warn" : "ok"
  const color =
    phase === "danger" ? "var(--ca-red)" : phase === "warn" ? "var(--ios-orange)" : "var(--ios-green)"

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: 60, height: 60 }}>
      <svg viewBox="0 0 60 60" width="100%" height="100%" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="30" cy="30" r={radius} fill="none" stroke="rgba(60,60,67,0.12)" strokeWidth={5} />
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={phase === "danger" ? "timer-pulse" : undefined}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 300ms ease" }}
        />
      </svg>
      <span
        className="absolute"
        style={{
          color,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.max(timeLeft, 0)}
      </span>
    </div>
  )
}
