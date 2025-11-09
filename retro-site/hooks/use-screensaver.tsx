"use client"

import { useState, useEffect, useRef } from "react"

export function useScreensaver(timeoutMs = 60000) {
  const [isActive, setIsActive] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef<number>(Date.now())

  const resetTimer = () => {
    lastActivityRef.current = Date.now()
    setIsActive(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsActive(true)
    }, timeoutMs)
  }

  const deactivate = () => {
    setIsActive(false)
    resetTimer()
  }

  useEffect(() => {
    const handleActivity = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.closest("[data-window-content]") || target.closest("iframe")) {
        return
      }
      resetTimer()
    }

    // Track mouse and keyboard activity, but filter window-internal clicks
    document.addEventListener("mousemove", handleActivity)
    document.addEventListener("keydown", handleActivity)
    document.addEventListener("click", handleActivity)
    document.addEventListener("scroll", handleActivity)
    document.addEventListener("touchstart", handleActivity)

    // Initialize timer
    resetTimer()

    return () => {
      document.removeEventListener("mousemove", handleActivity)
      document.removeEventListener("keydown", handleActivity)
      document.removeEventListener("click", handleActivity)
      document.removeEventListener("scroll", handleActivity)
      document.removeEventListener("touchstart", handleActivity)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [timeoutMs])

  return { isActive, deactivate, setIsActive }
}
