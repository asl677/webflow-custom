"use client"

import { useState, useEffect, useRef } from "react"

interface ScreensaverProps {
  isActive: boolean
  onDeactivate: () => void
}

interface Toaster {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
}

export function Screensaver({ isActive, onDeactivate }: ScreensaverProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const [toasters, setToasters] = useState<Toaster[]>([])

  useEffect(() => {
    if (!isActive) return

    const getViewportHeight = () => {
      return window.visualViewport?.height || window.innerHeight
    }

    const getViewportWidth = () => {
      return window.visualViewport?.width || window.innerWidth
    }

    const updateContainerSize = () => {
      if (containerRef.current) {
        const vh = getViewportHeight()
        const vw = getViewportWidth()
        containerRef.current.style.width = `${vw}px`
        containerRef.current.style.height = `${vh}px`
        containerRef.current.style.minHeight = `${vh}px`
      }
    }

    updateContainerSize()

    // Initialize toasters
    const initialToasters: Toaster[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * getViewportWidth(),
      y: Math.random() * getViewportHeight(),
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
    }))
    setToasters(initialToasters)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = getViewportWidth()
      canvas.height = getViewportHeight()
      updateContainerSize() // Update container size when canvas resizes
    }

    updateCanvasSize()

    const handleResize = () => {
      updateCanvasSize()
    }

    window.addEventListener("resize", handleResize)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize)
    }

    const animate = () => {
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      setToasters((prevToasters) =>
        prevToasters.map((toaster) => {
          let newX = toaster.x + toaster.vx
          let newY = toaster.y + toaster.vy
          let newVx = toaster.vx
          let newVy = toaster.vy

          // Bounce off walls
          if (newX <= 0 || newX >= canvas.width - 60) {
            newVx = -newVx
            newX = Math.max(0, Math.min(canvas.width - 60, newX))
          }
          if (newY <= 0 || newY >= canvas.height - 40) {
            newVy = -newVy
            newY = Math.max(0, Math.min(canvas.height - 40, newY))
          }

          const newRotation = toaster.rotation + toaster.rotationSpeed

          // Draw toaster
          ctx.save()
          ctx.translate(newX + 30, newY + 20)
          ctx.rotate((newRotation * Math.PI) / 180)

          // Draw toaster body (black and white pixelated style)
          ctx.fillStyle = "white"
          ctx.fillRect(-25, -15, 50, 30)

          // Draw toaster outline
          ctx.strokeStyle = "white"
          ctx.lineWidth = 2
          ctx.strokeRect(-25, -15, 50, 30)

          // Draw toaster slots
          ctx.fillStyle = "black"
          ctx.fillRect(-20, -12, 8, 24)
          ctx.fillRect(-5, -12, 8, 24)
          ctx.fillRect(10, -12, 8, 24)

          // Draw toaster base
          ctx.fillStyle = "white"
          ctx.fillRect(-30, 10, 60, 8)
          ctx.strokeRect(-30, 10, 60, 8)

          // Draw control knob
          ctx.fillStyle = "white"
          ctx.fillRect(20, -5, 8, 10)
          ctx.strokeRect(20, -5, 8, 10)

          ctx.restore()

          return {
            ...toaster,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
          }
        }),
      )

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize)
      }
    }
  }, [isActive])

  const handleMouseMove = () => {
    onDeactivate()
  }

  const handleKeyPress = () => {
    onDeactivate()
  }

  useEffect(() => {
    if (isActive) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("keydown", handleKeyPress)
      document.addEventListener("click", handleMouseMove)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("click", handleMouseMove)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div
      ref={containerRef}
      className="fixed bg-black cursor-none"
      style={{
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        minWidth: "100vw",
        minHeight: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        margin: 0,
        padding: 0,
        backgroundColor: "black",
        overflow: "hidden",
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          imageRendering: "pixelated",
          backgroundColor: "black",
          width: "100%",
          height: "100%",
          display: "block",
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  )
}
