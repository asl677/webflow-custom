"use client"

import { useState, useEffect } from "react"

interface OpenWindow {
  id: string
  type:
    | "folder"
    | "editor"
    | "code-editor"
    | "hosting-dashboard"
    | "registry"
    | "factory"
    | "figma"
    | "internet-explorer"
    | "moosestack"
    | "template-viewer"
    | "demo-request"
    | "cursor-editor"
    | "signup-form"
    | "blog-post-viewer"
    | "sloan-ai"
    | "enterprise"
    | "video-player"
    | "notepad"
    | "aol-aim"
    | "docs"
    | "terminal"
    | "schema-window"
    | "case-study-viewer"
    | "testimonial-viewer"
    | "dataman-game"
    | "white-paper-viewer"
    | "napster"
    | "gta-game"
    | "simcity-game"
    | "ufa-download-window"
    | "odw-download-window"
    | "word-editor"
    | "add-project"
  title: string
  zIndex: number
  icon?: string
}

interface TaskbarProps {
  openWindows: OpenWindow[]
  onWindowClick: (id: string) => void
  onStartMenuClick: (item: string) => void
  isDarkMode?: boolean
  setIsDarkMode: (isDarkMode: boolean) => void
  activeWindowId: string | null
  isStartMenuOpen?: boolean
  setIsStartMenuOpen?: (open: boolean) => void
}

export function Taskbar({
  openWindows,
  onWindowClick,
  onStartMenuClick,
  isDarkMode,
  setIsDarkMode,
  activeWindowId,
  isStartMenuOpen: externalStartMenuOpen,
  setIsStartMenuOpen: setExternalStartMenuOpen,
}: TaskbarProps) {
  const [internalStartMenuOpen, setInternalStartMenuOpen] = useState(false)
  const startMenuOpen = externalStartMenuOpen !== undefined ? externalStartMenuOpen : internalStartMenuOpen
  const setStartMenuOpen = externalStartMenuOpen !== undefined ? setExternalStartMenuOpen! : setInternalStartMenuOpen
  const [productsHovered, setProductsHovered] = useState(false)
  const [volumeBarOpen, setVolumeBarOpen] = useState(false)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)

  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false

  // Close volume bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeBarOpen) {
        const target = event.target as Element
        if (!target.closest('[data-volume-bar]')) {
          setVolumeBarOpen(false)
        }
      }
    }

    if (volumeBarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [volumeBarOpen])

  const handleMenuItemClick = (e: React.MouseEvent, item: string) => {
    e.preventDefault()
    e.stopPropagation()
    setStartMenuOpen(false)
    onStartMenuClick(item)
  }

  const getMenuItemStyle = (isHovered = false) => ({
    color: isHovered ? "white" : "black",
    backgroundColor: isHovered ? "#000080" : "transparent",
  })

  return (
    <>
      {startMenuOpen && (
        <div className="fixed bottom-14 left-0 w-64 shadow-lg z-[9999] flex bg-win95-window win95-raised">
          <div
            className="w-8 flex items-end justify-bottom pb-4"
            style={{
              background: "#808080",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            <span
              className="text-white font-bold tracking-wider text-xl py-1 px-1.5 !font-sans"
              style={{ fontFamily: "Arial, sans-serif !important" }}
            >
              Windows 95
            </span>
          </div>
          <div className="flex-1">
            <div className="space-y-0">
              <div
                className="relative flex items-center gap-2 px-3 py-3 hover:bg-win95-highlight cursor-pointer"
                style={getMenuItemStyle()}
                onMouseEnter={(e) => {
                  setProductsHovered(true)
                  e.currentTarget.style.backgroundColor = "#000080"
                  e.currentTarget.style.color = "white"
                }}
                onMouseLeave={(e) => {
                  setProductsHovered(false)
                  const style = getMenuItemStyle()
                  e.currentTarget.style.backgroundColor = style.backgroundColor
                  e.currentTarget.style.color = style.color
                }}
              >
                <img
                  src="/icons/accessibility_two_windows.png"
                  alt=""
                  width="32"
                  height="32"
                  loading="eager"
                  fetchPriority="high"
                  className="w-8 h-8"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-sm flex-1">Products</span>
                <span className="text-xs">▶</span>
                {productsHovered && (
                  <div className="absolute left-full top-0 w-48 ml-0 -mt-1 shadow-lg z-[10000] bg-win95-window win95-raised">
                    <div className="space-y-0">
                      <div
                        className="flex items-center gap-2 px-3 py-3 hover:bg-win95-highlight cursor-pointer"
                        style={getMenuItemStyle()}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#000080"
                          e.currentTarget.style.color = "white"
                        }}
                        onMouseLeave={(e) => {
                          const style = getMenuItemStyle()
                          e.currentTarget.style.backgroundColor = style.backgroundColor
                          e.currentTarget.style.color = style.color
                        }}
                        onClick={(e) => handleMenuItemClick(e, "MooseStack")}
                      >
                        <img
                          src="/icons/diskettes-icon.png"
                          alt=""
                          width="32"
                          height="32"
                          loading="eager"
                          fetchPriority="high"
                          className="w-8 h-8"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <span className="text-sm">MooseStack</span>
                      </div>
                      <div
                        className="flex items-center gap-2 px-3 py-3 hover:bg-win95-highlight cursor-pointer"
                        style={getMenuItemStyle()}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#000080"
                          e.currentTarget.style.color = "white"
                        }}
                        onMouseLeave={(e) => {
                          const style = getMenuItemStyle()
                          e.currentTarget.style.backgroundColor = style.backgroundColor
                          e.currentTarget.style.color = style.color
                        }}
                        onClick={(e) => handleMenuItemClick(e, "Factory")}
                      >
                        <img
                          src="/icons/factory-icon.png"
                          alt=""
                          width="32"
                          height="32"
                          loading="eager"
                          fetchPriority="high"
                          className="w-8 h-8"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <span className="text-sm">Factory</span>
                      </div>
                      <div
                        className="flex items-center gap-2 px-3 py-3 hover:bg-win95-highlight cursor-pointer"
                        style={getMenuItemStyle()}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#000080"
                          e.currentTarget.style.color = "white"
                        }}
                        onMouseLeave={(e) => {
                          const style = getMenuItemStyle()
                          e.currentTarget.style.backgroundColor = style.backgroundColor
                          e.currentTarget.style.color = style.color
                        }}
                        onClick={(e) => handleMenuItemClick(e, "Registry")}
                      >
                        <img
                          src="/icons/cable_2-0.png"
                          alt=""
                          width="32"
                          height="32"
                          loading="eager"
                          fetchPriority="high"
                          className="w-8 h-8"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <span className="text-sm">Registry</span>
                      </div>
                      <div
                        className="flex items-center gap-2 px-3 py-3 hover:bg-win95-highlight cursor-pointer"
                        style={getMenuItemStyle()}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#000080"
                          e.currentTarget.style.color = "white"
                        }}
                        onMouseLeave={(e) => {
                          const style = getMenuItemStyle()
                          e.currentTarget.style.backgroundColor = style.backgroundColor
                          e.currentTarget.style.color = style.color
                        }}
                        onClick={(e) => handleMenuItemClick(e, "Hosting")}
                      >
                        <img
                          src="/icons/hosting-icon.png"
                          alt=""
                          width="32"
                          height="32"
                          loading="eager"
                          fetchPriority="high"
                          className="w-8 h-8"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <span className="text-sm">Hosting</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="flex items-center gap-2 px-3 py-3 hover:bg-win95-highlight cursor-pointer"
                style={getMenuItemStyle()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#000080"
                  e.currentTarget.style.color = "white"
                }}
                onMouseLeave={(e) => {
                  const style = getMenuItemStyle()
                  e.currentTarget.style.backgroundColor = style.backgroundColor
                  e.currentTarget.style.color = style.color
                }}
                onClick={(e) => handleMenuItemClick(e, "My Computer")}
              >
                <img
                  src="/icons/computer_explorer-5.png"
                  alt=""
                  width="32"
                  height="32"
                  loading="eager"
                  fetchPriority="high"
                  className="w-8 h-8"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-sm">My Computer</span>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-3 hover:bg-win95-highlight cursor-pointer"
                style={getMenuItemStyle()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#000080"
                  e.currentTarget.style.color = "white"
                }}
                onMouseLeave={(e) => {
                  const style = getMenuItemStyle()
                  e.currentTarget.style.backgroundColor = style.backgroundColor
                  e.currentTarget.style.color = style.color
                }}
                onClick={(e) => handleMenuItemClick(e, "Internet Explorer")}
              >
                <img
                  src="/icons/msie1-2.png"
                  alt=""
                  width="32"
                  height="32"
                  loading="eager"
                  fetchPriority="high"
                  className="w-8 h-8"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-sm">Internet Explorer</span>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-3 hover:bg-win95-highlight cursor-pointer"
                style={getMenuItemStyle()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#000080"
                  e.currentTarget.style.color = "white"
                }}
                onMouseLeave={(e) => {
                  const style = getMenuItemStyle()
                  e.currentTarget.style.backgroundColor = style.backgroundColor
                  e.currentTarget.style.color = style.color
                }}
                onClick={(e) => handleMenuItemClick(e, "Recycle Bin")}
              >
                <img
                  src="/icons/recycle_bin_full-4.png"
                  alt=""
                  width="32"
                  height="32"
                  loading="eager"
                  fetchPriority="high"
                  className="w-8 h-8"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-sm">Recycle Bin</span>
              </div>

              <div
                className="flex items-center gap-2 px-3 py-3 hover:bg-win95-highlight cursor-pointer"
                style={getMenuItemStyle()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#000080"
                  e.currentTarget.style.color = "white"
                }}
                onMouseLeave={(e) => {
                  const style = getMenuItemStyle()
                  e.currentTarget.style.backgroundColor = style.backgroundColor
                  e.currentTarget.style.color = style.color
                }}
                onClick={(e) => handleMenuItemClick(e, "Dark Mode")}
              >
                <img
                  src="/icons/monitor_moon-1.png"
                  alt=""
                  width="32"
                  height="32"
                  loading="eager"
                  fetchPriority="high"
                  className="w-8 h-8"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-sm">{isDarkMode ? "Classic Mode" : "Dark Mode"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed bottom-0 left-0 right-0 flex items-center z-[9998] px-1 h-14 py-1"
        style={{
          backgroundColor: "#c0c0c0",
          borderTop: "2px solid #ffffff",
          borderLeft: "1px solid #ffffff",
          borderRight: "1px solid #808080",
          borderBottom: "1px solid #808080",
        }}
      >
        <button
          id="start-button"
          className={`win95-button px-3 py-1 text-sm mr-2 flex items-center gap-1 ${startMenuOpen ? "active" : ""}`}
          onClick={() => setStartMenuOpen(!startMenuOpen)}
        >
          <img
            src="/icons/windows-logo.png"
            alt="Windows"
            width="32"
            height="32"
            loading="eager"
            fetchPriority="high"
            className="w-8 h-8"
            style={{ imageRendering: "pixelated" }}
          />
          Start
        </button>

        <div className="flex-1 flex items-center gap-1">
          {openWindows.map((window) => (
            <button
              key={window.id}
              id={`taskbar-button-${window.id}`}
              className={`win95-button max-w-48 h-[30px] truncate py-0 flex items-center gap-1 px-2 ${window.id === activeWindowId ? "active" : ""}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '4px',
                padding: '2px 6px',
                height: '30px',
                minHeight: '30px',
                maxHeight: '30px',
              }}
              onClick={() => onWindowClick(window.id)}
            >
              <img
                src={window.icon || "/placeholder.svg"}
                alt=""
                width="16"
                height="16"
                className="w-4 h-4 flex-shrink-0"
                style={{ imageRendering: "pixelated" }}
              />
              <span className="truncate">{window.title}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm mx-1 text-black">
          <div
            className="border-l-2 border-r-2 px-0 h-[30px]"
            style={{
              backgroundColor: "#c0c0c0",
              borderLeftColor: "#555",
              borderRightColor: "#ffffff",
              borderTopColor: "#555",
              borderBottomColor: "#ffffff",
              borderTop: "2px solid #555",
              borderBottom: "2px solid #ffffff",
              paddingRight: "10px",
              padding: "0px 4px 0px 4px",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  id="volume-button"
                  onClick={() => setVolumeBarOpen(!volumeBarOpen)}
                  className={`volume p-1 ${volumeBarOpen ? "active" : ""}`}
                  data-volume-bar
                  style={{
                    background: "none !important",
                    border: "none !important",
                    padding: "0px",
                    boxShadow: "none !important",
                    outline: "none",
                  }}
                >
                  <img
                    src="/icons/volume.ico"
                    alt="Volume"
                    width="32"
                    height="32"
                    loading="eager"
                    fetchPriority="high"
                    className="w-6 h-6"
                    style={{ imageRendering: "pixelated" }}
                  />
                </button>
                {volumeBarOpen && (
                  <div className={`absolute bottom-full mb-2 right-0 w-32 shadow-lg z-50 win95-raised ${isDarkMode ? "bg-gray-800" : "bg-win95-window"}`} data-volume-bar>
                    <div className={`p-2 text-center text-sm font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Volume</div>

                    <div className="p-3">
                      <div className="flex flex-col items-center h-20 mb-3">
                        <div className="relative w-6 h-16 mx-auto">
                          <div
                            className="absolute left-1/2 transform -translate-x-1/2 w-4 h-16"
                            style={{
                              background: isDarkMode ? "#888" : "#c0c0c0",
                              borderTop: `2px solid ${isDarkMode ? "#666" : "#808080"} !important`,
                              borderLeft: `2px solid ${isDarkMode ? "#666" : "#808080"} !important`,
                              borderRight: `2px solid ${isDarkMode ? "#aaa" : "#ffffff"} !important`,
                              borderBottom: `2px solid ${isDarkMode ? "#aaa" : "#ffffff"} !important`,
                            }}
                          />
                          <div
                            className="absolute left-1/2 transform -translate-x-1/2 w-6 h-3"
                            style={{
                              top: `${64 - (volume / 100) * 52}px`,
                              background: isDarkMode ? "#999" : "#c0c0c0",
                              borderTop: `1px solid ${isDarkMode ? "#bbb" : "#ffffff"} !important`,
                              borderLeft: `1px solid ${isDarkMode ? "#bbb" : "#ffffff"} !important`,
                              borderRight: `1px solid ${isDarkMode ? "#666" : "#555"} !important`,
                              borderBottom: `1px solid ${isDarkMode ? "#666" : "#555"} !important`,
                              pointerEvents: "none",
                            }}
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => setVolume(Number.parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            style={{ transform: "rotate(-90deg)", transformOrigin: "center", zIndex: 10 }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <label className={`flex items-center gap-1 cursor-pointer text-sm ${isDarkMode ? "text-white" : "text-black"}`}>
                          <input
                            type="checkbox"
                            checked={isMuted}
                            onChange={(e) => setIsMuted(e.target.checked)}
                            className="w-3 h-3"
                            style={{
                              accentColor: "#000000",
                            }}
                          />
                          <span>
                            <u>M</u>ute
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <span
                className="font-mono text-sm text-black"
                style={{ fontFamily: '"w95fa", "MS Sans Serif", "Microsoft Sans Serif", sans-serif !important' }}
              >
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {volumeBarOpen && <div className="fixed inset-0 z-[9997] !bg-transparent" onClick={() => setVolumeBarOpen(false)} />}
      {startMenuOpen && (
        <div className="fixed inset-0 z-[9996] !bg-transparent" onClick={() => setStartMenuOpen(false)} />
      )}
    </>
  )
}
