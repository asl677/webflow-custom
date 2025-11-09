"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface WindowFrameProps {
  id: string
  title: string
  position: { x: number; y: number }
  zIndex: number
  width?: number
  height?: number
  size?: { width: number; height: number }
  isAnimating?: boolean
  clickOrigin?: { x: number; y: number }
  isMinimized?: boolean
  isMaximized?: boolean
  isActive?: boolean
  icon?: string
  iconStyle?: React.CSSProperties
  customFooterContent?: React.ReactNode
  aspectRatio?: number // e.g., 4/3 or 16/9
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onResize?: (size: { width: number; height: number }) => void
  onMinimize?: () => void
  onMaximize?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  children: React.ReactNode
}

export function WindowFrame({
  id,
  title,
  position = { x: 100, y: 100 },
  zIndex,
  width = 400,
  height = 300,
  size,
  isAnimating = false,
  clickOrigin,
  isMinimized = false,
  isMaximized = false,
  isActive = true,
  icon,
  iconStyle,
  customFooterContent,
  aspectRatio,
  onClose,
  onFocus,
  onMove,
  onResize,
  onMinimize,
  onMaximize,
  onSwipeLeft,
  onSwipeRight,
  children,
}: WindowFrameProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [isTouchDragging, setIsTouchDragging] = useState(false)
  const [touchDragOffset, setTouchDragOffset] = useState({ x: 0, y: 0 })
  const [previousWindowSize, setPreviousWindowSize] = useState<{
    width: number
    height: number
  } | null>(null)
  const [maximizedDimensions, setMaximizedDimensions] = useState<{
    width: number
    height: number
  } | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  const getInitialSize = () => {
    if (id && id.includes("notepad")) {
      return {
        width: size?.width || 200,
        height: size?.height || 230,
      }
    }
    return {
      width: size?.width || width,
      height: size?.height || height,
    }
  }

  const [currentSize, setCurrentSize] = useState(getInitialSize())

  const windowStyle =
    isMaximized || isMobile
      ? {
          left: isMobile ? "50%" : 0,
          top: isMobile ? "50%" : 0,
          width: isMobile ? "calc(100vw - 40px)" : "100vw",
          height: isMobile ? "400px" : "calc(100vh - 40px)",
          transform: isMobile ? "translate(-50%, -50%)" : "none",
          zIndex,
        }
      : {
          left: position.x,
          top: position.y,
          width: currentSize.width,
          height: isCollapsed ? 28 : currentSize.height,
          zIndex,
        }

  // Calculate maximized dimensions with aspect ratio
  useEffect(() => {
    const calculateMaximizedDimensions = () => {
      if (aspectRatio && isMaximized && !isMobile && typeof window !== "undefined") {
        const vh = window.innerHeight
        const vw = window.innerWidth
        const maxHeight = vh - 40 // Account for taskbar
        const maxWidth = vw
        
        // Calculate width and height for both constraints
        const widthFromHeight = maxHeight * aspectRatio
        const heightFromWidth = maxWidth / aspectRatio
        
        // Use the constraint that gives us smaller dimensions
        const finalWidth = Math.min(maxWidth, widthFromHeight)
        const finalHeight = Math.min(maxHeight, heightFromWidth)
        
        setMaximizedDimensions({ width: finalWidth, height: finalHeight })
      } else {
        setMaximizedDimensions(null)
      }
    }

    calculateMaximizedDimensions()
    window.addEventListener("resize", calculateMaximizedDimensions)
    return () => window.removeEventListener("resize", calculateMaximizedDimensions)
  }, [aspectRatio, isMaximized, isMobile])

  // Apply aspect ratio constraint when maximized and aspectRatio is provided
  const maximizedStyle = aspectRatio && isMaximized && !isMobile && maximizedDimensions
    ? {
        ...windowStyle,
        width: `${maximizedDimensions.width}px`,
        height: `${maximizedDimensions.height}px`,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }
    : windowStyle

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && !previousWindowSize) {
      setPreviousWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
  }, [id, previousWindowSize])

  useEffect(() => {
    const handleWindowResize = () => {
      if (!previousWindowSize) {
        setPreviousWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
        return
      }

      const newWindowWidth = window.innerWidth
      const newWindowHeight = window.innerHeight

      if (id && id.includes("notepad")) {
        const currentOffsetFromRight = previousWindowSize.width - position.x - currentSize.width
        const currentOffsetFromBottom = previousWindowSize.height - position.y - currentSize.height

        const newX = newWindowWidth - currentSize.width - currentOffsetFromRight
        const newY = newWindowHeight - currentSize.height - currentOffsetFromBottom - 40

        const constrainedPos = constrainPosition(newX, newY)

        if (Math.abs(constrainedPos.x - position.x) > 5 || Math.abs(constrainedPos.y - position.y) > 5) {
          onMove(constrainedPos)
        }
      } else {
        const relativeX = position.x / previousWindowSize.width
        const relativeY = position.y / previousWindowSize.height

        const newX = relativeX * newWindowWidth
        const newY = relativeY * newWindowHeight

        const constrainedPos = constrainPosition(newX, newY)

        if (Math.abs(constrainedPos.x - position.x) > 5 || Math.abs(constrainedPos.y - position.y) > 5) {
          onMove(constrainedPos)
        }
      }

      setPreviousWindowSize({ width: newWindowWidth, height: newWindowHeight })
    }

    window.addEventListener("resize", handleWindowResize)
    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [position.x, position.y, previousWindowSize, onMove, id, currentSize.width, currentSize.height])

  const constrainPosition = (x: number, y: number) => {
    const isMobile = window.innerWidth < 768
    const minMargin = isMobile ? 20 : 10
    const taskbarHeight = 56 // h-14 = 56px

    // Calculate bounds ensuring the entire window stays within viewport
    const minX = minMargin
    const minY = minMargin
    const maxX = window.innerWidth - currentSize.width - minMargin
    const maxY = window.innerHeight - currentSize.height - minMargin - taskbarHeight

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    }
  }

  const handleHeaderDoubleClick = () => {
    if (onMaximize) {
      onMaximize()
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const touchPos = { x: touch.clientX, y: touch.clientY }
    setTouchStart(touchPos)
    setTouchEnd(null)

    const target = e.target as HTMLElement
    if (target.closest(".window-title")) {
      setIsTouchDragging(true)
      setTouchDragOffset({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      })
      if (onFocus && typeof onFocus === "function") {
        onFocus()
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart) {
      const touch = e.touches[0]
      setTouchEnd({ x: touch.clientX, y: touch.clientY })

      if (isTouchDragging) {
        e.preventDefault()
        const newPos = {
          x: touch.clientX - touchDragOffset.x,
          y: touch.clientY - touchDragOffset.y,
        }
        const constrainedPos = constrainPosition(newPos.x, newPos.y)
        if (onMove && typeof onMove === "function") {
          onMove(constrainedPos)
        }
      }
    }
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsTouchDragging(false)
      return
    }

    const deltaX = touchEnd.x - touchStart.x
    const deltaY = touchEnd.y - touchStart.y
    const minSwipeDistance = 50

    if (!isTouchDragging && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
    setIsTouchDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".window-title")) {
      if (!isMobile) {
        setIsDragging(true)
        setDragOffset({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
      if (onFocus && typeof onFocus === "function") {
        onFocus()
      }
    }
  }

  const handleWindowClick = (e: React.MouseEvent) => {
    if (onFocus && typeof onFocus === "function") {
      onFocus()
    }
  }

  const handleContentClick = (e: React.MouseEvent) => {
    if (onFocus && typeof onFocus === "function") {
      onFocus()
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    if (onFocus && typeof onFocus === "function") {
      onFocus()
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        const newPos = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        }
        const constrainedPos = constrainPosition(newPos.x, newPos.y)
        if (onMove && typeof onMove === "function") {
          onMove(constrainedPos)
        }
      }
      if (isResizing) {
        e.preventDefault()
        const maxWidth = window.innerWidth - position.x - 20
        const maxHeight = Math.min(600, window.innerHeight - position.y - 60)

        if (aspectRatio) {
          // Lock aspect ratio during resize
          const newWidth = Math.max(200, Math.min(maxWidth, e.clientX - position.x))
          const newHeight = newWidth / aspectRatio

          // Ensure height doesn't exceed max
          const constrainedHeight = Math.min(newHeight, maxHeight)
          const constrainedWidth = constrainedHeight * aspectRatio

          setCurrentSize({ width: constrainedWidth, height: constrainedHeight })
          onResize?.({ width: constrainedWidth, height: constrainedHeight })
        } else {
          // Original resize logic without aspect ratio lock
          const newWidth = Math.max(200, Math.min(maxWidth, e.clientX - position.x))
          const newHeight = Math.max(150, Math.min(maxHeight, e.clientY - position.y))
          setCurrentSize({ width: newWidth, height: newHeight })
          onResize?.({ width: newWidth, height: newHeight })
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
  }, [isDragging, isResizing, dragOffset, position, currentSize.width, currentSize.height, onMove, onResize])

  const getTransformOrigin = () => {
    if (!clickOrigin) return "center center"

    const originX = ((clickOrigin.x - position.x) / currentSize.width) * 100
    const originY = ((clickOrigin.y - position.y) / currentSize.height) * 100

    return `${Math.max(0, Math.min(100, originX))}% ${Math.max(0, Math.min(100, originY))}%`
  }

  if (isMinimized) {
    return null
  }

  return (
    <div
      ref={windowRef}
      className={`absolute mx-0 px-0 ${isAnimating ? "animate-[windowOpen_0.2s_ease-out]" : ""} ${
        isDragging || isResizing || isTouchDragging ? "select-none" : ""
      }`}
      style={{
        ...maximizedStyle,
        backgroundColor: "#c0c0c0",
        border: "2px solid",
        borderTopColor: "#dfdfdf",
        borderLeftColor: "#dfdfdf",
        borderRightColor: "#555",
        borderBottomColor: "#555",
        boxShadow: "var(--shadow-outer-3)",
        minWidth: id && id.includes("notepad") ? "200px" : "320px",
        maxWidth: "none",
        padding: "var(--spacing-3)",
        overflow: "hidden",
        gap: "var(--spacing-3)",
        userSelect: isDragging || isResizing || isTouchDragging ? "none" : "auto",
        boxSizing: "border-box",
        ...(isAnimating && {
          transformOrigin: getTransformOrigin(),
          animation: "windowOpen 0.2s ease-out forwards",
        }),
      }}
      onMouseDown={handleMouseDown}
      onClick={handleWindowClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`window-title px-2 py-1 flex items-center justify-between cursor-move`}
        style={{
          backgroundColor: isActive ? "#000080" : "#555",
          color: "white",
        }}
        onDoubleClick={handleHeaderDoubleClick}
      >
        <div className="flex items-center gap-2">
          <img
            src={icon || "/window-icon.png"}
            alt=""
            className="w-4 h-4 pixelated"
            style={iconStyle}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = "/window-icon.png"
            }}
          />
          <span
            className="text-sm"
            style={{
              color: "white",
              fontFamily: "MS Sans Serif, Microsoft Sans Serif, sans-serif",
            }}
          >
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onMinimize && !isMobile && (
            <button
              className="w-4 h-4 text-xs hover:brightness-105 active:brightness-95 flex items-center justify-center border-2"
              style={{
                backgroundColor: "#c0c0c0",
                borderStyle: "solid",
                borderTopColor: "#ffffff",
                borderLeftColor: "#ffffff",
                borderRightColor: "#000000",
                borderBottomColor: "#000000",
                color: "#000000",
              }}
              onClick={onMinimize}
            >
              _
            </button>
          )}
          {!isMobile && onMaximize && (
            <button
              className="w-4 h-4 text-xs hover:brightness-105 active:brightness-95 flex items-center justify-center border-2"
              style={{
                backgroundColor: "#c0c0c0",
                borderStyle: "solid",
                borderTopColor: "#ffffff",
                borderLeftColor: "#ffffff",
                borderRightColor: "#000000",
                borderBottomColor: "#000000",
                color: "#000000",
              }}
              onClick={onMaximize}
            >
              □
            </button>
          )}
          <button
            className="w-4 h-4 text-xs hover:bg-red-400 flex justify-center items-center flex-row leading-7 border-2"
            style={{
              backgroundColor: "#c0c0c0",
              borderStyle: "solid",
              borderTopColor: "#ffffff",
              borderLeftColor: "#ffffff",
              borderRightColor: "#000000",
              borderBottomColor: "#000000",
              color: "#000000",
            }}
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div
            className="text-sm text-black font-normal px-2 mx-1"
            style={{
              height: isMaximized
                ? onResize
                  ? "calc(100% - 48px)"
                  : "calc(100% - 28px)"
                : onResize
                  ? `calc(100% - 48px)`
                  : `calc(100% - 28px)`,
              width: isMaximized || isMobile ? "100%" : "auto",
              backgroundColor: "#c0c0c0",
              padding: 0,
              margin: 0,
              overflow: "hidden",
            }}
            onClick={handleContentClick}
          >
            {children}
          </div>

          {onResize && (
            <div
              className="px-2 flex items-center justify-between text-xs border-t"
              style={{
                backgroundColor: "#c0c0c0",
                borderTop: "2px solid",
                borderTopColor: "#555",
                borderLeftColor: "#555",
                borderRightColor: "#ffffff",
                borderBottomColor: "#ffffff",
                minHeight: "20px",
                height: "20px",
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 20,
                overflow: "hidden",
              }}
            >
              {customFooterContent ? (
                <div className="flex-1 overflow-hidden text-black dark:text-black">{customFooterContent}</div>
              ) : (
                <></>
              )}
              <div
                className="w-3 h-3 cursor-se-resize"
                style={{
                  background: `linear-gradient(-45deg, 
                    transparent 0%, transparent 30%, 
                    #555 30%, #555 35%, 
                    transparent 35%, transparent 65%, 
                    #555 65%, #555 70%, 
                    transparent 70%)`,
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                }}
                onMouseDown={handleResizeMouseDown}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
