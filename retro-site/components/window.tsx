"use client"

import type React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"

interface WindowProps {
  id: string
  title: string
  children: ReactNode
  position: { x: number; y: number }
  size?: { width: number; height: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  isDarkMode?: boolean
  lockAspectRatio?: boolean // Added aspect ratio locking prop
  isActive?: boolean // Added isActive prop for active/inactive window styling
  onClose: () => void
  onMove: (position: { x: number; y: number }) => void
  onResize?: (size: { width: number; height: number }) => void
  onFocus: () => void
  onMinimize?: () => void
  onMaximize?: () => void
}

export function Window({
  id,
  title,
  children,
  position,
  size = { width: 350, height: 250 },
  zIndex,
  isAnimating = false,
  isMinimized = false,
  isMaximized = false,
  isDarkMode = false,
  lockAspectRatio = false, // Default to false for backward compatibility
  isActive = true, // Added isActive with default true
  onClose,
  onMove,
  onResize,
  onFocus,
  onMinimize,
  onMaximize,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isTouchDragging, setIsTouchDragging] = useState(false)
  const [touchDragOffset, setTouchDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false

  const initialAspectRatio = size.width / size.height

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, e.clientX - dragOffset.x)
        const newY = Math.max(0, e.clientY - dragOffset.y)
        onMove({ x: newX, y: newY })
      } else if (isResizing && onResize) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y

        if (lockAspectRatio) {
          // Calculate new dimensions based on the larger delta to maintain aspect ratio
          const newWidth = Math.max(200, resizeStart.width + deltaX)
          const newHeight = Math.max(150, resizeStart.height + deltaY)

          // Determine which dimension changed more and use that as the primary constraint
          const widthRatio = newWidth / resizeStart.width
          const heightRatio = newHeight / resizeStart.height

          let finalWidth, finalHeight

          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Width changed more, calculate height based on width
            finalWidth = newWidth
            finalHeight = Math.max(150, newWidth / initialAspectRatio)
          } else {
            // Height changed more, calculate width based on height
            finalHeight = newHeight
            finalWidth = Math.max(200, newHeight * initialAspectRatio)
          }

          onResize({ width: finalWidth, height: finalHeight })
        } else {
          // Original free resize behavior
          const newWidth = Math.max(200, resizeStart.width + deltaX)
          const newHeight = Math.max(150, resizeStart.height + deltaY)
          onResize({ width: newWidth, height: newHeight })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, onMove, onResize])

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "SPAN") {
      const rect = windowRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
        setIsDragging(true)
        onFocus()
      }
    }
  }

  const handleTitleBarTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      const touch = e.touches[0]
      const rect = windowRef.current?.getBoundingClientRect()
      if (rect) {
        setTouchDragOffset({
          x: touch.clientX - position.x,
          y: touch.clientY - position.y,
        })
        setIsTouchDragging(true)
        onFocus()
      }
    }
  }

  const handleTitleBarTouchMove = (e: React.TouchEvent) => {
    if (isTouchDragging && isMobile) {
      e.preventDefault() // Prevent scrolling
      const touch = e.touches[0]
      const newX = Math.max(0, touch.clientX - touchDragOffset.x)
      const newY = Math.max(0, touch.clientY - touchDragOffset.y)
      onMove({ x: newX, y: newY })
    }
  }

  const handleTitleBarTouchEnd = () => {
    setIsTouchDragging(false)
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    })
    setIsResizing(true)
    onFocus()
  }

  if (isMinimized) {
    return null
  }

  const windowStyle = isMaximized
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100vw",
        height: "calc(100vh - 40px)",
        zIndex,
      }
    : {
        position: "absolute" as const,
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }

  return (
    <div
      ref={windowRef}
      className={`
        border-2 select-none
        ${isDarkMode ? "bg-black border-gray-600" : "bg-win95-window border-win95-border-raised"}
        ${isAnimating ? "animate-window-open" : ""}
      `}
      style={{
        ...windowStyle,
        boxShadow: "var(--shadow-outer-3)",
        minWidth: "320px",
        padding: "var(--spacing-3)",
        gap: "var(--spacing-3)",
      }}
    >
      {/* Title Bar */}
      <div
        className={`
          h-8 flex items-center justify-between px-2 cursor-move border-b-2 win95-titlebar
          ${isDarkMode ? "bg-gray-800 border-gray-600" : "border-win95-border-inset"}
        `}
        onMouseDown={handleTitleBarMouseDown}
        onTouchStart={handleTitleBarTouchStart}
        onTouchMove={handleTitleBarTouchMove}
        onTouchEnd={handleTitleBarTouchEnd}
        onClick={onFocus}
        style={{
          fontFamily: '"MS Sans Serif", sans-serif',
          fontSize: "11px",
          fontWeight: "bold",
          backgroundColor: isActive ? "#000080" : "#808080", // Updated title bar background color based on isActive state
        }}
      >
        <span className="text-white text-sm font-bold truncate" style={{ fontFamily: '"MS Sans Serif", sans-serif' }}>
          {title}
        </span>
        <div className="flex gap-1">
          {onMinimize && (
            <button
              className="win95-window-control"
              onClick={(e) => {
                e.stopPropagation()
                onMinimize()
              }}
            >
              _
            </button>
          )}
          {onMaximize && (
            <button
              className="win95-window-control"
              onClick={(e) => {
                e.stopPropagation()
                onMaximize()
              }}
            >
              □
            </button>
          )}
          <button
            className="win95-window-control"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div
        className="flex-1 overflow-hidden"
        style={{ height: "calc(100% - 32px)" }}
        onMouseDown={(e) => {
          onFocus()
        }}
      >
        {children}
      </div>

      {/* Resize Handle */}
      {onResize && !isMaximized && (
        <div
          className={`
            absolute bottom-0 right-0 w-4 h-4 cursor-se-resize
            ${isDarkMode ? "bg-gray-600" : "bg-win95-window"}
          `}
          onMouseDown={handleResizeMouseDown}
          style={{
            background: `linear-gradient(-45deg, transparent 0%, transparent 30%, ${isDarkMode ? "#666" : "#c0c0c0"} 30%, ${isDarkMode ? "#666" : "#c0c0c0"} 70%, transparent 70%)`,
          }}
        />
      )}
    </div>
  )
}
