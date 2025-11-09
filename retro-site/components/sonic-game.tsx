"use client"

import { Window } from "./window"
import { useRef } from "react"

interface SonicGameProps {
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  isActive?: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize?: () => void
  onResize?: (size: { width: number; height: number }) => void
  gameUrl: string
}

export function SonicGame({
  position,
  zIndex,
  isAnimating = false,
  isMinimized = false,
  isMaximized = false,
  onMaximize,
  size = { width: 640, height: 480 },
  isActive = true,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
  gameUrl,
}: SonicGameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleGameAreaClick = () => {
    onFocus()
    setTimeout(() => {
      if (iframeRef.current && document.activeElement !== iframeRef.current) {
        iframeRef.current.focus()
        console.log("[v0] Sonic game iframe focused after click")
      }
    }, 10)
  }

  const handleMouseLeave = () => {
    if (document.exitPointerLock) {
      document.exitPointerLock()
    }
    if (iframeRef.current) {
      iframeRef.current.blur()
    }
    console.log("[v0] Released pointer lock and iframe focus on mouse leave")
  }

  return (
    <Window
      id="sonic-game"
      title="Sonic the Hedgehog"
      position={position}
      size={size}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      isActive={isActive}
      onClose={onClose}
      onMove={onMove}
      onResize={onResize}
      onFocus={onFocus}
      onMinimize={onMinimize}
    >
      <div
        className="w-full h-full bg-black overflow-hidden"
        onClick={handleGameAreaClick}
        onMouseLeave={handleMouseLeave}
      >
        <iframe
          ref={iframeRef}
          src={gameUrl}
          className="w-full h-full border-0"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; microphone; camera"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          title="Sonic the Hedgehog (1991)"
          onLoad={() => {
            console.log("[v0] Sonic game iframe loaded and ready for interaction")
          }}
        />
      </div>
    </Window>
  )
}
