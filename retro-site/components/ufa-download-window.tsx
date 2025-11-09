"use client"

import { useState, useEffect } from "react"
import { WindowFrame } from "./window-frame"

interface UFADownloadWindowProps {
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

export function UFADownloadWindow({
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
}: UFADownloadWindowProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [conversion, setConversion] = useState(0)
  const [chartData, setChartData] = useState(Array.from({ length: 15 }, () => 0))

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const targetUsers = 12458
      const targetRevenue = 89.2
      const targetConversion = 3.4
      const duration = 1500 // 1.5 seconds
      const steps = 60
      const interval = duration / steps

      let step = 0
      const countUpInterval = setInterval(() => {
        step++
        const progress = step / steps
        setTotalUsers(Math.floor(targetUsers * progress))
        setRevenue(targetRevenue * progress)
        setConversion(targetConversion * progress)

        if (step >= steps) {
          clearInterval(countUpInterval)
          setTotalUsers(targetUsers)
          setRevenue(targetRevenue)
          setConversion(targetConversion)
        }
      }, interval)

      const targetHeights = Array.from({ length: 15 }, () => Math.floor(Math.random() * 60) + 20)
      let chartStep = 0
      const chartInterval = setInterval(() => {
        chartStep++
        const chartProgress = chartStep / steps
        setChartData(targetHeights.map((h) => Math.floor(h * chartProgress)))

        if (chartStep >= steps) {
          clearInterval(chartInterval)
          setChartData(targetHeights)
        }
      }, interval)

      const liveUpdateTimer = setTimeout(() => {
        const liveInterval = setInterval(() => {
          setTotalUsers((prev) => prev + Math.floor(Math.random() * 10) - 5)
          setRevenue((prev) => Math.max(80, Math.min(100, prev + (Math.random() - 0.5) * 2)))
          setConversion((prev) => Math.max(2.5, Math.min(4.5, prev + (Math.random() - 0.5) * 0.2)))
          setChartData((prev) =>
            prev.map((val) => Math.max(10, Math.min(80, val + Math.floor(Math.random() * 10) - 5))),
          )
        }, 3000)

        return () => clearInterval(liveInterval)
      }, duration)

      return () => {
        clearInterval(countUpInterval)
        clearInterval(chartInterval)
        clearTimeout(liveUpdateTimer)
      }
    }
  }, [isLoading])

  return (
    <WindowFrame
      id={id}
      title="User Facing Analytics"
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
          {/* Metric Cards */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black mb-3">Metric Cards</h2>
            <div className="grid grid-cols-3 gap-4">
              <div
                className="p-4 bg-white"
                style={{
                  border: "2px solid",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                <div className="text-sm text-black mb-1">Total Users</div>
                <div className="text-2xl font-bold text-black">{totalUsers.toLocaleString()}</div>
              </div>
              <div
                className="p-4 bg-white"
                style={{
                  border: "2px solid",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                <div className="text-sm text-black mb-1">Revenue</div>
                <div className="text-2xl font-bold text-black">${revenue.toFixed(1)}K</div>
              </div>
              <div
                className="p-4 bg-white"
                style={{
                  border: "2px solid",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                <div className="text-sm text-black mb-1">Conversion</div>
                <div className="text-2xl font-bold text-black">{conversion.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Time Series Chart */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black mb-3">Time Series Chart</h2>
            <div
              className="p-4 bg-white"
              style={{
                border: "2px solid",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              <div className="h-40 flex items-end gap-1">
                {chartData.map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 transition-all duration-[1500ms] ease-out"
                    style={{
                      height: `${height}%`,
                      backgroundColor: "#000080",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black mb-3">Data Table</h2>
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
                      User
                    </th>
                    <th className="text-left p-2 border-b-2 border-r-2" style={{ borderColor: "#808080" }}>
                      Value
                    </th>
                    <th className="text-left p-2 border-b-2" style={{ borderColor: "#808080" }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b border-r" style={{ borderColor: "#c0c0c0" }}>
                      User 1
                    </td>
                    <td className="p-2 border-b border-r" style={{ borderColor: "#c0c0c0" }}>
                      $###
                    </td>
                    <td className="p-2 border-b" style={{ borderColor: "#c0c0c0" }}>
                      Active
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b border-r" style={{ borderColor: "#c0c0c0" }}>
                      User 2
                    </td>
                    <td className="p-2 border-b border-r" style={{ borderColor: "#c0c0c0" }}>
                      $###
                    </td>
                    <td className="p-2 border-b" style={{ borderColor: "#c0c0c0" }}>
                      Active
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r" style={{ borderColor: "#c0c0c0" }}>
                      User 3
                    </td>
                    <td className="p-2 border-r" style={{ borderColor: "#c0c0c0" }}>
                      $###
                    </td>
                    <td className="p-2">Active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              className="win95-button px-6 py-2 text-sm"
              onClick={() => {
                navigator.clipboard.writeText("npm install @moose/analytics")
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

export default UFADownloadWindow
