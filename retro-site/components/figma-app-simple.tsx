"use client"

import { WindowFrame } from "./window-frame"

interface FigmaAppProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  isActive?: boolean
  size?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onMaximize: () => void
  onResize: (size: { width: number; height: number }) => void
  isDarkMode?: boolean
}

const FigmaAppSimple = ({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  isActive,
  size,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onMaximize,
  onResize,
}: FigmaAppProps) => {
  return (
    <WindowFrame
      id={id}
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive}
      size={size}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onResize={onResize}
      title="Figma"
      icon="/icons/factory-icon.png"
    >
      <div className="p-4">
        <h1 className="text-xl font-bold">Figma App</h1>
        <p>Simple Figma app for testing</p>
      </div>
    </WindowFrame>
  )
}

export default FigmaAppSimple
