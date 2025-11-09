"use client"

import { useState, useEffect } from "react"
import { WindowFrame } from "./window-frame"

interface ODWDownloadWindowProps {
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
  onMaximize?: () => void
  onResize: (size: { width: number; height: number }) => void
}

export function ODWDownloadWindow({
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
}: ODWDownloadWindowProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [pipelineStatus, setPipelineStatus] = useState({
    ingestion: "Active",
    transform: "Running",
    load: "Active",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setPipelineStatus({
          ingestion: Math.random() > 0.3 ? "Active" : "Running",
          transform: Math.random() > 0.5 ? "Running" : "Active",
          load: Math.random() > 0.3 ? "Active" : "Running",
        })
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [isLoading])

  return (
    <WindowFrame
      id={id}
      title="Operational Datawarehouse"
      icon="/icons/chart1-5.png"
      position={position}
      size={size || { width: 700, height: 500 }}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onResize={onResize}
    >
      {isLoading ? (
        <div className="h-full flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="text-xl font-bold text-black mb-4">Seeding your data...</div>
            <div
              className="w-64 h-4"
              style={{
                backgroundColor: "#c0c0c0",
                boxShadow:
                  "inset -1px -1px #dfdfdf, inset 1px 1px #808080, inset -2px -2px #ffffff, inset 2px 2px #000000",
              }}
            >
              <div
                className="h-full"
                style={{
                  width: "100%",
                  backgroundColor: "#000080",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="h-full overflow-y-auto p-4 bg-white"
          style={{
            boxShadow: "inset -1px -1px #dfdfdf, inset 1px 1px #808080, inset -2px -2px #ffffff, inset 2px 2px #000000",
          }}
        >
          {/* Pipeline Monitor */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black mb-3">Pipeline Monitor</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 transition-colors duration-1000"
                    style={{ backgroundColor: pipelineStatus.ingestion === "Active" ? "#00ff00" : "#ffff00" }}
                  />
                  <span className="text-black">Ingestion Pipeline</span>
                </div>
                <span className="text-black">{pipelineStatus.ingestion}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 transition-colors duration-1000"
                    style={{ backgroundColor: pipelineStatus.transform === "Running" ? "#ffff00" : "#00ff00" }}
                  />
                  <span className="text-black">Transform Pipeline</span>
                </div>
                <span className="text-black">{pipelineStatus.transform}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 transition-colors duration-1000"
                    style={{ backgroundColor: pipelineStatus.load === "Active" ? "#00ff00" : "#ffff00" }}
                  />
                  <span className="text-black">Load Pipeline</span>
                </div>
                <span className="text-black">{pipelineStatus.load}</span>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black mb-3">Data Sources</h2>
            <div
              className="bg-white"
              style={{
                border: "2px solid",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              <table className="w-full text-black text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#c0c0c0" }}>
                    <th className="text-left p-2 border-b-2 border-r-2" style={{ borderColor: "#808080" }}>
                      Source
                    </th>
                    <th className="text-left p-2 border-b-2 border-r-2" style={{ borderColor: "#808080" }}>
                      Type
                    </th>
                    <th className="text-left p-2 border-b-2" style={{ borderColor: "#808080" }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b border-r" style={{ borderColor: "#c0c0c0" }}>
                      S3 Bucket
                    </td>
                    <td className="p-2 border-b border-r" style={{ borderColor: "#c0c0c0" }}>
                      Blob
                    </td>
                    <td className="p-2 border-b" style={{ borderColor: "#c0c0c0" }}>
                      Connected
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b border-r" style={{ borderColor: "#c0c0c0" }}>
                      Event Stream
                    </td>
                    <td className="p-2 border-b border-r" style={{ borderColor: "#c0c0c0" }}>
                      Events
                    </td>
                    <td className="p-2 border-b" style={{ borderColor: "#c0c0c0" }}>
                      Connected
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r" style={{ borderColor: "#c0c0c0" }}>
                      App Logs
                    </td>
                    <td className="p-2 border-r" style={{ borderColor: "#c0c0c0" }}>
                      Logs
                    </td>
                    <td className="p-2">Connected</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Ingestion Config */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black mb-3">Data Ingestion Config</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-black w-20">Source:</label>
                <select
                  className="flex-1 p-1 bg-white text-black"
                  style={{
                    border: "2px solid",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <option>Select Source</option>
                  <option>S3 Bucket</option>
                  <option>Event Stream</option>
                  <option>App Logs</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-black w-20">Format:</label>
                <select
                  className="flex-1 p-1 bg-white text-black"
                  style={{
                    border: "2px solid",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <option>JSON</option>
                  <option>CSV</option>
                  <option>Parquet</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              className="win95-button px-6 py-2 text-sm"
              onClick={() => {
                navigator.clipboard.writeText("npm install @moose/warehouse")
              }}
            >
              Copy Install
            </button>
            <button
              className="win95-button px-6 py-2 text-sm"
              onClick={() => {
                navigator.clipboard.writeText("Setup instructions copied")
              }}
            >
              Copy Setup
            </button>
            <button className="win95-button px-6 py-2 text-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </WindowFrame>
  )
}

export default ODWDownloadWindow
