"use client"

import React from "react"

import { useState, useRef } from "react"

interface DesktopIconProps {
  id?: string
  icon: string
  label: string
  onDoubleClick: () => void
  position?: { x: number; y: number }
  onMove?: (position: { x: number; y: number }) => void
  isDarkMode?: boolean
  isSelected?: boolean
  onSelect?: (id: string) => void
  flipped?: boolean
  rotation?: number // Rotation in degrees
}

const FALLBACK_ICON = "/icons/folder.png"

export function DesktopIcon({
  id,
  icon,
  label,
  onDoubleClick,
  position,
  onMove,
  isDarkMode,
  isSelected = false,
  onSelect,
  flipped = false,
  rotation = 0,
}: DesktopIconProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [hasDragged, setHasDragged] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasErrored, setHasErrored] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)

  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false

  const handleClick = () => {
    if (dragRef.current) {
      dragRef.current.blur()
    }
    if (onSelect && id) {
      onSelect(id)
    }
    if (isMobile && onDoubleClick) {
      onDoubleClick()
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isMobile && !hasDragged && onDoubleClick) {
      console.log("[v0] Desktop icon double-clicked:", label, id)
      if (dragRef.current) {
        dragRef.current.blur()
      }
      onDoubleClick()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (position && onMove) {
      setIsDragging(true)
      setHasDragged(false)
      const rect = dragRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && position && onMove) {
      setHasDragged(true)
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      }
      onMove(newPosition)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setTimeout(() => setHasDragged(false), 100)
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  const iconStyle = position
    ? {
        position: "absolute" as const,
        left: position.x,
        top: position.y,
        cursor: "default",
      }
    : {}

  const getBackgroundColor = () => {
    return "transparent"
  }

  const getTextColor = () => {
    if (isSelected || isHovered) {
      return "#ffffff"
    }
    return "#ffffff"
  }

  const getTextBackgroundColor = () => {
    if (isSelected || isDragging) {
      return "var(--color-win95-titlebar)"
    }
    return "transparent"
  }

  const getTextBorder = () => {
    if (isSelected || isDragging) {
      return "1px dotted rgb(255, 255, 255)"
    }
    return "1px dotted transparent"
  }

  return (
    <div
      ref={dragRef}
      tabIndex={0}
      className={`flex flex-col items-center justify-start p-1 select-none transition-colors outline-none ${
        isDragging ? "z-50" : ""
      } ${isMobile ? "w-24" : "w-20"}`}
      style={{
        ...iconStyle,
        backgroundColor: getBackgroundColor(),
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        minHeight: isMobile ? "80px" : "72px",
        opacity: 1,
        filter: "none",
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon?.endsWith(".mp4") ? (
        <video
          src={icon}
          className={`mb-1 ${isMobile ? "w-20 h-12" : "w-20 h-8"}`}
          style={{
            imageRendering: "pixelated",
            background: "transparent",
            aspectRatio: "16/9",
            objectFit: "cover",
            transform: flipped ? `scaleX(-1) rotate(${rotation}deg)` : `rotate(${rotation}deg)`,
          }}
          muted
          loop
          autoPlay
          onError={(e) => {
            console.log("[v0] Video preview failed to load:", icon)
          }}
          onLoadedData={() => {
            console.log("[v0] Video preview loaded successfully:", icon)
          }}
        />
      ) : (
        <img
          src={icon || FALLBACK_ICON}
          alt={label}
          className={`mb-1 ${isMobile ? "w-auto h-12" : "w-auto h-8"}`}
          style={{
            imageRendering: "pixelated",
            background: "transparent",
            transform: flipped ? `scaleX(-1) rotate(${rotation}deg)` : `rotate(${rotation}deg)`,
          }}
          width={isMobile ? "auto" : "32"}
          height={isMobile ? "48" : "32"}
          loading="eager"
          fetchPriority="high"
          draggable={false}
          onError={(e) => {
            if (!hasErrored) {
              console.log("[v0] Icon failed to load:", icon)
              const target = e.target as HTMLImageElement
              target.src = FALLBACK_ICON
              setHasErrored(true)
            }
          }}
          onLoad={() => {
            console.log("[v0] Icon loaded successfully:", icon)
          }}
        />
      )}
      <div
        className={`text-center font-mono leading-tight select-none win95-icon-text ${isMobile ? "text-sm" : "text-xs"}`}
        style={{
          color: getTextColor(),
          backgroundColor: getTextBackgroundColor(),
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          padding: "1px 2px",
          border: getTextBorder(),
          display: "inline-block",
          width: "fit-content",
          minWidth: "auto",
          minHeight: "auto",
          whiteSpace: "normal",
          overflow: "hidden",
          textOverflow: "ellipsis",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          lineHeight: "1.2",
          maxHeight: "2.6em",
          boxSizing: "border-box",
          margin: "0 auto",
          textShadow: "none",
          fontFamily: '"w95fa", "MS Sans Serif", sans-serif',
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  )
}
