"use client"

import { WindowFrame } from "./window-frame"
import { AnalyticsTemplate } from "./analytics-template"
import { DataWarehouseTemplate } from "./data-warehouse-template"

interface SchemaWindowProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  isActive?: boolean
  size?: { width: number; height: number }
  item: {
    name: string
    type?: string
    githubHandle?: string
    version?: string
  }
  activeTab: string
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize?: () => void
  onMaximize?: () => void
  onResize?: (size: { width: number; height: number }) => void
}

export function SchemaWindow({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  isActive,
  size,
  item,
  activeTab,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onMaximize,
  onResize,
}: SchemaWindowProps) {
  const isAnalytics = item.name === "User Facing Analytics"
  const isDataWarehouse = item.name === "Operational Datawarehouse"

  if (isAnalytics) {
    return (
      <AnalyticsTemplate
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
        onMinimize={onMinimize || (() => {})}
        onMaximize={onMaximize || (() => {})}
        onResize={onResize || (() => {})}
      />
    )
  }

  if (isDataWarehouse) {
    return (
      <DataWarehouseTemplate
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
        onMinimize={onMinimize || (() => {})}
        onMaximize={onMaximize || (() => {})}
        onResize={onResize || (() => {})}
      />
    )
  }

  const handleCopyInstall = () => {
    const installCommand = `npm install @514labs/${item.name.toLowerCase().replace(/\s+/g, "-")}`
    navigator.clipboard.writeText(installCommand)
  }

  const handleCopySetup = () => {
    const setupCode = `import { ${item.name.replace(/\s+/g, "")} } from '@514labs/${item.name.toLowerCase().replace(/\s+/g, "-")}'

const connector = new ${item.name.replace(/\s+/g, "")}({
  apiKey: process.env.${item.name.toUpperCase().replace(/\s+/g, "_")}_API_KEY
})

await connector.connect()`
    navigator.clipboard.writeText(setupCode)
  }

  const isConnector = activeTab === "connectors"
  const isPipeline = activeTab === "pipelines"

  return (
    <WindowFrame
      id={id}
      title={`${item.name} - Schema & Lineage`}
      icon="/icons/cable_2-0.png"
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive}
      size={size || { width: 700, height: 550 }}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onResize={onResize}
      resizable
    >
      <div className="h-full flex flex-col bg-win95-window">
        <div
          className="flex-1 overflow-y-auto p-4"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080",
          }}
        >
          {/* Header Section */}
          <div className="mb-4 pb-4 border-b-2 border-gray-300">
            <h2 className="text-lg font-bold mb-2 text-black">{item.name}</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-black">
              <div>
                <span className="font-semibold">Type:</span> {item.type || "Unknown"}
              </div>
              <div>
                <span className="font-semibold">Version:</span> {item.version || "1.0.0"}
              </div>
              <div>
                <span className="font-semibold">Author:</span> {item.githubHandle || "@514-labs"}
              </div>
              <div>
                <span className="font-semibold">Category:</span>{" "}
                {isConnector ? "Connector" : isPipeline ? "Pipeline" : "Component"}
              </div>
            </div>
          </div>

          {/* Schema Visual Section */}
          <div className="mb-4">
            <h3 className="font-semibold mb-3 text-black text-base">Schema Diagram</h3>
            <div
              className="p-4"
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #808080",
                borderTopColor: "#808080",
                borderLeftColor: "#808080",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              {isConnector ? (
                <div className="flex items-center justify-between font-mono text-sm text-black">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 h-16 border-2 flex items-center justify-center mb-2"
                      style={{
                        backgroundColor: "#ffffff",
                        borderColor: "#000000",
                      }}
                    >
                      <span className="text-xs font-bold">Source</span>
                    </div>
                    <span className="text-xs">{item.type}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="border-t-2 border-black w-full relative">
                      <div className="absolute right-0 top-0 transform -translate-y-1/2">
                        <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-black"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 h-16 border-2 flex items-center justify-center mb-2"
                      style={{
                        backgroundColor: "#c0c0c0",
                        borderColor: "#000000",
                      }}
                    >
                      <span className="text-xs font-bold text-center">{item.name.split(" ")[0]}</span>
                    </div>
                    <span className="text-xs">Connector</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="border-t-2 border-black w-full relative">
                      <div className="absolute right-0 top-0 transform -translate-y-1/2">
                        <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-black"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 h-16 border-2 flex items-center justify-center mb-2"
                      style={{
                        backgroundColor: "#ffffff",
                        borderColor: "#000000",
                      }}
                    >
                      <span className="text-xs font-bold">Target</span>
                    </div>
                    <span className="text-xs">System</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between font-mono text-sm text-black">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 border-2 flex items-center justify-center mb-2"
                      style={{
                        backgroundColor: "#ffffff",
                        borderColor: "#000000",
                      }}
                    >
                      <span className="text-xs font-bold">Input</span>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="border-t-2 border-black w-full relative">
                      <div className="absolute right-0 top-0 transform -translate-y-1/2">
                        <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-black"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 h-16 border-2 flex items-center justify-center mb-2"
                      style={{
                        backgroundColor: "#c0c0c0",
                        borderColor: "#000000",
                      }}
                    >
                      <span className="text-xs font-bold">Process</span>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="border-t-2 border-black w-full relative">
                      <div className="absolute right-0 top-0 transform -translate-y-1/2">
                        <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-black"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 h-16 border-2 flex items-center justify-center mb-2"
                      style={{
                        backgroundColor: "#ffffff",
                        borderColor: "#000000",
                      }}
                    >
                      <span className="text-xs font-bold">Transform</span>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="border-t-2 border-black w-full relative">
                      <div className="absolute right-0 top-0 transform -translate-y-1/2">
                        <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-black"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 border-2 flex items-center justify-center mb-2"
                      style={{
                        backgroundColor: "#ffffff",
                        borderColor: "#000000",
                      }}
                    >
                      <span className="text-xs font-bold">Output</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Installation Section */}
          <div className="mb-4">
            <h3 className="font-semibold mb-3 text-black text-base">Installation</h3>
            <div
              className="p-3 font-mono text-sm text-black"
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #808080",
                borderTopColor: "#808080",
                borderLeftColor: "#808080",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              <div className="mb-2">
                <span className="text-gray-600">$</span> npm install @514labs/
                {item.name.toLowerCase().replace(/\s+/g, "-")}
              </div>
            </div>
          </div>

          {/* Setup Code Section */}
          <div className="mb-4">
            <h3 className="font-semibold mb-3 text-black text-base">Setup Code</h3>
            <div
              className="p-3 font-mono text-xs text-black whitespace-pre-wrap"
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #808080",
                borderTopColor: "#808080",
                borderLeftColor: "#808080",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              {`import { ${item.name.replace(/\s+/g, "")} } from '@514labs/${item.name.toLowerCase().replace(/\s+/g, "-")}'

const connector = new ${item.name.replace(/\s+/g, "")}({
  apiKey: process.env.${item.name.toUpperCase().replace(/\s+/g, "_")}_API_KEY
})

await connector.connect()`}
            </div>
          </div>

          {/* Repository Link */}
          <div className="mb-2">
            <h3 className="font-semibold mb-2 text-black text-base">Repository</h3>
            <a
              href={`https://github.com/514-labs/registry/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="win95-blue-link text-sm"
            >
              github.com/514-labs/registry/{item.name.toLowerCase().replace(/\s+/g, "-")}
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 p-2 bg-win95-window border-t-2 border-white">
          <button onClick={handleCopyInstall} className="win95-button px-4 py-1 text-sm">
            Copy Install
          </button>
          <button onClick={handleCopySetup} className="win95-button px-4 py-1 text-sm">
            Copy Setup
          </button>
          <button onClick={onClose} className="win95-button px-4 py-1 text-sm ml-auto">
            Close
          </button>
        </div>
      </div>
    </WindowFrame>
  )
}
