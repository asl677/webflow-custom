"use client"

import type React from "react"
import { useState, useRef } from "react"
import { WindowFrame } from "./window-frame"

interface VideoPlayerProps {
  onClose: () => void
  position?: { x: number; y: number }
  zIndex?: number
  onMove?: (position: { x: number; y: number }) => void
  onFocus?: () => void
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  isActive?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  onMinimize?: () => void
  onResize?: (size: { width: number; height: number }) => void
}

export function VideoPlayer({
  onClose,
  position = { x: 100, y: 100 },
  zIndex = 1,
  onMove,
  onFocus,
  isAnimating = false,
  isMinimized = false,
  isMaximized = false,
  isActive,
  onMaximize,
  size,
  onMinimize,
  onResize,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [videoError, setVideoError] = useState(false)
  const [internalSize, setInternalSize] = useState(() => {
    if (size) return size
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768
      return {
        width: isMobile ? Math.min(320, window.innerWidth - 40) : 480,
        height: isMobile ? Math.min(240, window.innerHeight - 120) : 400,
      }
    }
    return { width: 480, height: 400 }
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleResize = (newSize: { width: number; height: number }) => {
    if (onResize) {
      onResize(newSize)
    } else {
      setInternalSize(newSize)
    }
  }

  const togglePlay = () => {
    if (videoRef.current && !videoError) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    console.log("[v0] Video metadata loaded successfully")
    if (videoRef.current) {
      const video = videoRef.current
      console.log("[v0] Video duration:", video.duration)
      console.log("[v0] Video dimensions:", video.videoWidth, "x", video.videoHeight)
      setDuration(video.duration)

      if (video.videoWidth && video.videoHeight) {
        const aspectRatio = video.videoWidth / video.videoHeight
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768

        let targetWidth: number
        let targetHeight: number

        if (isMobile) {
          // On mobile, fit within viewport with margins
          const maxWidth = Math.min(window.innerWidth - 40, 350)
          const maxHeight = Math.min(window.innerHeight - 120, 250)

          if (aspectRatio > maxWidth / maxHeight) {
            // Video is wider, constrain by width
            targetWidth = maxWidth
            targetHeight = maxWidth / aspectRatio
          } else {
            // Video is taller, constrain by height
            targetHeight = maxHeight
            targetWidth = maxHeight * aspectRatio
          }
        } else {
          // On desktop, use a reasonable base size
          const baseHeight = 360 // Good base height for video content
          targetWidth = baseHeight * aspectRatio
          targetHeight = baseHeight

          // Ensure it doesn't get too wide
          const maxWidth = 640
          if (targetWidth > maxWidth) {
            targetWidth = maxWidth
            targetHeight = maxWidth / aspectRatio
          }
        }

        // Add space for window chrome (title bar + controls)
        const windowHeight = targetHeight + 28 + 32 // title bar + controls
        const newSize = {
          width: Math.round(targetWidth),
          height: Math.round(windowHeight),
        }

        console.log("[v0] Calculated window size based on video aspect ratio:", newSize)
        handleResize(newSize)
      }
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number.parseFloat(e.target.value)
    if (videoRef.current && !videoError) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number.parseFloat(e.target.value)
    setVolume(vol)
    if (videoRef.current && !videoError) {
      videoRef.current.volume = vol
    }
  }

  const handleVideoError = () => {
    console.log("[v0] Video error occurred - video file failed to load")
    console.log("[v0] Attempted video sources:", [
      "/images/get-started.mov",
      "/images/get-started.mp4",
      "/images/get-started.webm",
    ])
    setVideoError(true)
    setIsPlaying(false)
  }

  const handleCanPlay = () => {
    console.log("[v0] Video can play - file loaded successfully")
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const currentSize = size || internalSize

  return (
    <WindowFrame
      id="video-player"
      className="overflow-hidden"
      title="Getting Started - MooseStack Demo"
      position={position}
      zIndex={zIndex}
      size={currentSize}
      isMaximized={isMaximized}
      isActive={isActive}
      onMaximize={onMaximize}
      icon="/icons/video_mg-2.png"
      onClose={onClose}
      onFocus={onFocus || (() => {})}
      onMove={onMove || (() => {})}
      onResize={handleResize}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      onMinimize={onMinimize}
    >
      {/* Video Display */}
      <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
        {videoError ? (
          <div className="text-white text-center p-8">
            <div className="mb-4 text-6xl">📹</div>
            <div className="text-lg mb-2">Video Not Available</div>
            <div className="text-sm text-gray-300">
              The getting started video is currently unavailable.
              <br />
              Please check back later or contact support.
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-contain max-h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onEnded={() => setIsPlaying(false)}
            onError={handleVideoError}
            autoPlay
            muted
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            crossOrigin="anonymous"
          >
            <source src="/images/get-started.mp4" type="video/mp4" />
            <source src="/images/get-started.mov" type="video/quicktime" />
            <source src="/images/get-started.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Controls */}
      <div className="bg-win95-window border-t-2 border-win95-border-inset">
        {/* Single Row Controls */}
        <div className="flex items-center">
          {/* Control Buttons */}
          <button
            onClick={togglePlay}
            className={`win95-button w-8 h-6 text-xs flex items-center justify-center ${videoError ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={videoError}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button
            onClick={() => {
              if (videoRef.current && !videoError) {
                videoRef.current.currentTime = 0
                setCurrentTime(0)
              }
            }}
            className={`win95-button w-8 h-6 text-xs flex items-center justify-center ${videoError ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={videoError}
          >
            ⏹
          </button>

          <button
            className={`win95-button w-8 h-6 text-xs flex items-center justify-center ${videoError ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={videoError}
          >
            ⏮
          </button>

          <button
            className={`win95-button w-8 h-6 text-xs flex items-center justify-center ${videoError ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={videoError}
          >
            ⏭
          </button>

          <div className="w-px h-6 bg-win95-border-inset mx-1"></div>

          {/* Progress Bar */}
          <div className="flex-1 overflow-hidden">
            <div className="relative w-full h-4 flex items-center">
              {/* Track */}
              <div
                className="w-full h-2 border"
                style={{
                  background: "#c0c0c0",
                  borderTop: "1px solid #808080",
                  borderLeft: "1px solid #808080",
                  borderRight: "1px solid #ffffff",
                  borderBottom: "1px solid #ffffff",
                }}
              />
              {/* Progress Fill */}
              <div
                className="absolute h-2 border-r"
                style={{
                  left: "1px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: `${Math.max(0, (currentTime / duration) * 100 - 0.5)}%`,
                  background: "#000080",
                  borderRight: duration > 0 && currentTime > 0 ? "1px solid #000080" : "none",
                }}
              />
              {/* Play Head Handle */}
              <div
                className="absolute w-3 h-4 cursor-pointer"
                style={{
                  left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  transform: "translateX(-50%)",
                  background: "#c0c0c0",
                  borderTop: "1px solid #ffffff",
                  borderLeft: "1px solid #ffffff",
                  borderRight: "1px solid #808080",
                  borderBottom: "1px solid #808080",
                }}
              />
              {/* Invisible input for interaction */}
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={videoError}
              />
            </div>
          </div>

          <div className="w-px h-6 bg-win95-border-inset mx-1"></div>

          {/* Volume Control */}
          <div className="flex items-center">
            <span className="text-xs mr-1">🔊</span>
            <div className="relative w-16 h-4 flex items-center">
              {/* Track */}
              <div
                className="w-full h-2 border"
                style={{
                  background: "#c0c0c0",
                  borderTop: "1px solid #808080",
                  borderLeft: "1px solid #808080",
                  borderRight: "1px solid #ffffff",
                  borderBottom: "1px solid #ffffff",
                }}
              />
              {/* Slider Handle */}
              <div
                className="absolute w-3 h-4 cursor-pointer"
                style={{
                  left: `${volume * 100 * 0.13}px`,
                  background: "#c0c0c0",
                  borderTop: "1px solid #ffffff",
                  borderLeft: "1px solid #ffffff",
                  borderRight: "1px solid #808080",
                  borderBottom: "1px solid #808080",
                }}
              />
              {/* Invisible input for interaction */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={videoError}
              />
            </div>
          </div>

          <div className="w-px h-6 bg-win95-border-inset mx-1"></div>

          {/* Time Display */}
          <span className="text-xs font-mono whitespace-nowrap">
            {formatTime(currentTime)}/{formatTime(duration)}
          </span>
        </div>
      </div>
    </WindowFrame>
  )
}
