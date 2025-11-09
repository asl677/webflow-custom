"use client"

import { useEffect, useRef } from "react"

interface AfterDarkScreensaverProps {
  isActive: boolean
  onDeactivate: () => void
}

export function AfterDarkScreensaver({ isActive, onDeactivate }: AfterDarkScreensaverProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  const isMobileSafari = () => {
    if (typeof window === "undefined") return false
    const userAgent = window.navigator.userAgent
    const isMobile = window.innerWidth < 768
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
    return isMobile && isSafari
  }

  useEffect(() => {
    console.log("[v0] Screensaver component - isActive:", isActive)
    console.log("[v0] Screensaver component - isMobileSafari:", isMobileSafari())
  }, [isActive])

  const handleMouseMove = () => {
    console.log("[v0] Mouse moved, deactivating screensaver")
    onDeactivate()
  }

  const handleKeyPress = () => {
    console.log("[v0] Key pressed, deactivating screensaver")
    onDeactivate()
  }

  useEffect(() => {
    if (isActive) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("keydown", handleKeyPress)
      document.addEventListener("click", handleMouseMove)
      document.addEventListener("touchstart", handleMouseMove)
      document.addEventListener("touchmove", handleMouseMove)
      document.addEventListener("touchend", handleMouseMove)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("click", handleMouseMove)
      document.removeEventListener("touchstart", handleMouseMove)
      document.removeEventListener("touchmove", handleMouseMove)
      document.removeEventListener("touchend", handleMouseMove)
    }
  }, [isActive])

  useEffect(() => {
    if (!isActive || !containerRef.current || !logoRef.current) return

    const container = containerRef.current
    const logo = logoRef.current

    const initializeAnimation = () => {
      const logoWidth = logo.offsetWidth
      const logoHeight = logo.offsetHeight

      let x = Math.random() * (container.clientWidth - logoWidth)
      let y = Math.random() * (container.clientHeight - logoHeight)
      let dx = 0.8
      let dy = 0.8
      let hue = 0

      const animate = () => {
        if (!container || !logo) return

        x += dx
        y += dy

        if (x <= 0 || x >= container.clientWidth - logoWidth) {
          dx = -dx
          hue = Math.random() * 360
          logo.style.filter = `invert(1) hue-rotate(${hue}deg)`
        }
        if (y <= 0 || y >= container.clientHeight - logoHeight) {
          dy = -dy
          hue = Math.random() * 360
          logo.style.filter = `invert(1) hue-rotate(${hue}deg)`
        }

        logo.style.left = `${x}px`
        logo.style.top = `${y}px`

        requestAnimationFrame(animate)
      }

      logo.style.filter = "invert(1)"
      animate()
    }

    if (logo.complete && logo.naturalWidth > 0) {
      initializeAnimation()
    } else {
      logo.onload = () => {
        console.log("[v0] DVD logo loaded successfully")
        initializeAnimation()
      }
      logo.onerror = (e) => {
        console.log("[v0] DVD logo failed to load:", e)
      }
    }
  }, [isActive])

  if (isMobileSafari() || !isActive) {
    console.log("[v0] Screensaver not rendering - isMobileSafari:", isMobileSafari(), "isActive:", isActive)
    return null
  }

  console.log("[v0] Screensaver rendering with isActive:", isActive)

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black cursor-none overflow-hidden"
      style={{
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        maxHeight: "100vh",
        WebkitOverflowScrolling: "touch",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        WebkitTransform: "translate3d(0,0,0)",
        transform: "translate3d(0,0,0)",
        overflow: "hidden",
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        marginTop: "calc(-1 * env(safe-area-inset-top, 0px))",
        marginBottom: "calc(-1 * env(safe-area-inset-bottom, 0px))",
      }}
    >
      <img
        ref={logoRef}
        src="/icons/DVD_VIDEO_logo.png"
        alt="DVD Logo"
        width={150}
        height={60}
        loading="eager"
        fetchPriority="high"
        className="absolute md:w-[150px] w-[120px]"
        style={{
          height: "auto",
          filter: "invert(1)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  )
}
