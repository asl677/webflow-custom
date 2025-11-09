"use client"

import { WindowFrame } from "./window-frame"
import { Win95MenuBar } from "./win95-menubar"
import { useRef, useEffect } from "react"

interface GTAGameProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  isActive?: boolean
  isDarkMode?: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize?: () => void
  onResize?: (size: { width: number; height: number }) => void
}

export function GTAGame({
  id,
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
}: GTAGameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleWindowFocus = () => {
      if (iframeRef.current && !isMinimized) {
        setTimeout(() => {
          iframeRef.current?.focus()
        }, 100)
      }
    }

    window.addEventListener("focus", handleWindowFocus)
    return () => window.removeEventListener("focus", handleWindowFocus)
  }, [isMinimized])

  const handleGameAreaClick = () => {
    onFocus()
    setTimeout(() => {
      if (iframeRef.current && document.activeElement !== iframeRef.current) {
        iframeRef.current.focus()
      }
    }, 10)
  }

  return (
    <WindowFrame
      id={id}
      title="Grand Theft Auto"
      icon="/icons/gta.png"
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
      resizable={true}
      aspectRatio={4 / 3}
      customFooterContent={
        <div className="flex justify-between w-full">
          <span>Ready</span>
        </div>
      }
    >
      <div className="flex flex-col h-full bg-win95-window mx-2">
        {/* Menu bar */}
        <Win95MenuBar
          items={[
            {
              label: "File",
              items: [
                { label: "New Game", onClick: () => {} },
                { label: "Load Game", onClick: () => {}, shortcut: "Ctrl+L" },
                { type: "separator" },
                { label: "Save Game", onClick: () => {}, shortcut: "Ctrl+S" },
                { label: "Save As...", onClick: () => {} },
                { type: "separator" },
                { label: "Exit", onClick: onClose },
              ],
            },
            {
              label: "Edit",
              items: [
                { label: "Undo", onClick: () => {}, shortcut: "Ctrl+Z" },
                { label: "Redo", onClick: () => {}, shortcut: "Ctrl+Y" },
                { type: "separator" },
                { label: "Cut", onClick: () => {}, shortcut: "Ctrl+X" },
                { label: "Copy", onClick: () => {}, shortcut: "Ctrl+C" },
                { label: "Paste", onClick: () => {}, shortcut: "Ctrl+V" },
                { type: "separator" },
                { label: "Select All", onClick: () => {}, shortcut: "Ctrl+A" },
              ],
            },
            {
              label: "View",
              items: [
                { label: "Full Screen", onClick: () => {}, shortcut: "F11" },
                { label: "Zoom In", onClick: () => {}, shortcut: "Ctrl++" },
                { label: "Zoom Out", onClick: () => {}, shortcut: "Ctrl+-" },
                { type: "separator" },
                { label: "Refresh", onClick: () => {}, shortcut: "F5" },
              ],
            },
            {
              label: "Help",
              items: [
                { label: "GTA Help", onClick: () => {} },
                { label: "Keyboard Shortcuts", onClick: () => {} },
                { type: "separator" },
                { label: "About GTA", onClick: () => {} },
              ],
            },
          ]}
        />

        {/* Game area */}
        <div
          className="flex-1"
          style={{
            backgroundColor: "#000000",
            border: "2px solid",
            borderColor: "#555 rgb(223, 223, 223) rgb(223, 223, 223) #555",
          }}
          onClick={handleGameAreaClick}
        >
          <iframe
            ref={iframeRef}
            src="https://archive.org/embed/grand-theft-auto-1997-dma-design"
            className="w-full h-full border-0"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; microphone; camera"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title="Grand Theft Auto (1997)"
          />
        </div>
      </div>
    </WindowFrame>
  )
}
