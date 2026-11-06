"use client"

import { useSyncExternalStore } from "react"

const STORAGE_KEY = "festival-theme"

type Theme = "light" | "dark"

const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light"

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  })

  const refreshAutomaticTheme = () => {
    if (document.documentElement.dataset.themeSource === "manual") return
    try {
      const hour = Number(new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London", hour: "2-digit", hourCycle: "h23",
      }).format(new Date()))
      const theme = hour >= 6 && hour < 18 ? "light" : "dark"
      document.documentElement.dataset.theme = theme
      document.documentElement.dataset.mode = theme
    } catch {
      // Leave the current theme in place if the time zone is unavailable.
    }
  }
  const syncFromAnotherTab = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    if (event.newValue === "light" || event.newValue === "dark") {
      document.documentElement.dataset.theme = event.newValue
      document.documentElement.dataset.mode = event.newValue
      document.documentElement.dataset.themeSource = "manual"
    } else {
      document.documentElement.dataset.themeSource = "auto"
      refreshAutomaticTheme()
    }
  }
  const interval = window.setInterval(refreshAutomaticTheme, 60_000)
  window.addEventListener("storage", syncFromAnotherTab)
  document.addEventListener("visibilitychange", refreshAutomaticTheme)
  return () => {
    observer.disconnect()
    window.clearInterval(interval)
    window.removeEventListener("storage", syncFromAnotherTab)
    document.removeEventListener("visibilitychange", refreshAutomaticTheme)
  }
}

export default function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "light")
  const dark = theme === "dark"

  const toggleTheme = () => {
    const nextTheme: Theme = currentTheme() === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = nextTheme
    document.documentElement.dataset.mode = nextTheme
    document.documentElement.dataset.themeSource = "manual"
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme)
    } catch {
      // The switch still works for this visit if browser storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      className="festival-theme-switch"
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
      data-testid="theme-switch"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="festival-theme-switch__sun">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="festival-theme-switch__moon">
        <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
      </svg>
      <span className="festival-theme-switch__thumb" aria-hidden="true" />
    </button>
  )
}
