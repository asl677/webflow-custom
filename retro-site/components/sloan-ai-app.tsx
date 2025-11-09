"use client"

import { WindowFrame } from "./window-frame"

interface SloanAIAppProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  onMaximize?: () => void
  isActive?: boolean
  size?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
}

export function SloanAIApp({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  onMaximize,
  isActive,
  size,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
}: SloanAIAppProps) {
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false
  const defaultSize = isMobile
    ? { width: window.innerWidth - 20, height: window.innerHeight - 60 }
    : { width: Math.min(800, window.innerWidth - 20), height: Math.min(600, window.innerHeight - 60) }

  return (
    <WindowFrame
      id={id}
      title="Sloan AI"
      icon="/icons/color-profile-icon.png"
      position={position}
      size={size || defaultSize}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
    >
      <div className="h-full bg-win95-window p-2 sm:p-4 md:p-6 overflow-auto">
        <div className="max-w-none">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <div className="flex justify-center mb-2 sm:mb-3">
              <img
                src="/icons/color-profile-icon.png"
                alt="Sloan AI"
                className="w-8 h-8 sm:w-10 sm:h-10"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-black mb-2 sm:mb-3 md:mb-4 leading-tight px-2">
              Turn your favorite co-pilot into a world class data engineer
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center px-2">
              <button
                className="w-full sm:w-auto px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-black border-2 hover:bg-gray-400 transition-colors"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
                onClick={() => window.open("https://docs.fiveonefour.com", "_blank")}
              >
                Docs
              </button>
              <button
                className="w-full sm:w-auto px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-black border-2 hover:bg-gray-400 transition-colors"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
                onClick={() => window.open("https://docs.fiveonefour.com/quickstart", "_blank")}
              >
                Quickstart
              </button>
              <button
                className="w-full sm:w-auto px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-black border-2 hover:bg-gray-400 transition-colors"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
                onClick={() => window.open("https://github.com/fiveonefour/sloan-mcp", "_blank")}
              >
                Sloan MCP ↗
              </button>
            </div>
          </div>

          <div
            className="bg-win95-window border-2 border-gray-400 p-2 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 bg-card"
            style={{
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
            }}
          >
            

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
              <div>
                <h3 className="font-semibold text-black mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
                  Local Dev Experience
                </h3>
                <div
                  className="bg-black   text-white p-2 sm:p-3 md:p-4 border-2 border-gray-400 font-mono text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 rounded-none overflow-x-auto select-text"
                  style={{
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                    fontFamily: "Courier New, monospace",
                  }}
                >
                  <div className="  select-text">$ moose git: (main)</div>
                  <div className="text-white select-text">moose dev</div>
                  <div className="  text-white mt-1 select-text">✓ Successfully started containers</div>
                </div>
                <p className="text-black text-xs sm:text-sm leading-relaxed">
                  Spin up a realistic local environment. Run agents against local services with full fidelity.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
                  Seamless Chat, Enterprise Context
                </h3>
                <p className="text-black text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                  Bring chat into your enterprise stack. Your agents know your metrics, policies, and docs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
                  Self-Testing Data Primitives
                </h3>
                <p className="text-black text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                  Every new primitive tests itself. No more silent failures—confidence is built in.
                </p>
                <div className="text-xs sm:text-sm  space-y-1">
                  <div>✓ Data ingested from source</div>
                  <div>✓ Schema matches source definition</div>
                  <div>✓ Minimal transformations needed</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
                  CI/CD to Production
                </h3>
                <p className="text-black text-xs sm:text-sm leading-relaxed">
                  Local to prod, without the guesswork. Code locally, test in PRs, ship to prod.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-base sm:text-lg md:text-2xl font-bold text-black mb-3 sm:mb-4 md:mb-6">
              Chat in seconds, build in minutes
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
              <div
                className="bg-win95-window border-2 border-gray-400 p-2 sm:p-4 md:p-6"
                style={{
                  borderTopColor: "#808080",
                  borderLeftColor: "#808080",
                  borderRightColor: "#dfdfdf",
                  borderBottomColor: "#dfdfdf",
                }}
              >
                <h3 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-black text-sm sm:text-base md:text-lg">
                  Get started with remote MCP
                </h3>
                <p className="text-black text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                  Set up remote MCP environment in seconds.
                </p>
                <div
                  className="bg-black   text-white p-2 sm:p-3 md:p-4 border-2 border-gray-400 font-mono text-xs sm:text-sm rounded-none overflow-x-auto select-text"
                  style={{
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                    fontFamily: "Courier New, monospace",
                  }}
                >
                  <div className="text-blue-400 select-text">URL:</div>
                  <div className="text-white break-all select-text">https://mcp.fiveonefour.com/sse</div>
                </div>
              </div>

              <div
                className="bg-win95-window border-2 border-gray-400 p-2 sm:p-4 md:p-6"
                style={{
                  borderTopColor: "#808080",
                  borderLeftColor: "#808080",
                  borderRightColor: "#dfdfdf",
                  borderBottomColor: "#dfdfdf",
                }}
              >
                <h3 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-black text-sm sm:text-base md:text-lg">
                  Get started locally in two commands
                </h3>
                <p className="text-black text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                  Set up your local MCP environment in seconds.
                </p>
                <div
                  className="bg-black   text-white p-2 sm:p-3 md:p-4 border-2 border-gray-400 font-mono text-xs sm:text-sm mb-1.5 sm:mb-2 md:mb-3 rounded-none overflow-x-auto select-text"
                  style={{
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                    fontFamily: "Courier New, monospace",
                    userSelect: "text",
                    WebkitUserSelect: "text",
                    MozUserSelect: "text",
                    msUserSelect: "text",
                  }}
                >
                  <div className="  select-text">$</div>
                  <div className="text-white break-all select-text">
                    curl -SfsL https://fiveonefour.com/install.sh | bash -s -- moose,sloan
                  </div>
                </div>
                <div
                  className="bg-black   text-white p-2 sm:p-3 md:p-4 border-2 border-gray-400 font-mono text-xs sm:text-sm rounded-none overflow-x-auto select-text"
                  style={{
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                    fontFamily: "Courier New, monospace",
                    userSelect: "text",
                    WebkitUserSelect: "text",
                    MozUserSelect: "text",
                    msUserSelect: "text",
                  }}
                >
                  <div className="  select-text">$</div>
                  <div className="text-white select-text">sloan init</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
