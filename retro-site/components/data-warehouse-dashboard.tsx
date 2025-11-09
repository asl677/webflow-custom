"use client"

import { useState, useEffect } from "react"

interface DataWarehouseDashboardProps {
  className?: string
}

export function DataWarehouseDashboard({ className }: DataWarehouseDashboardProps) {
  const [metrics, setMetrics] = useState({
    totalRecords: 2847392,
    dailyIngestion: 45672,
    queryLatency: 127,
    storageUsed: 1.2,
    activeConnections: 23,
    dataFreshness: 2.3,
  })

  const [chartData, setChartData] = useState(
    Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      ingestion: Math.floor(Math.random() * 5000) + 1000,
      queries: Math.floor(Math.random() * 200) + 50,
      latency: Math.floor(Math.random() * 100) + 50,
    })),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        totalRecords: prev.totalRecords + Math.floor(Math.random() * 100),
        dailyIngestion: Math.max(30000, Math.min(60000, prev.dailyIngestion + (Math.random() - 0.5) * 2000)),
        queryLatency: Math.max(50, Math.min(300, prev.queryLatency + (Math.random() - 0.5) * 20)),
        storageUsed: Math.max(1.0, Math.min(2.0, prev.storageUsed + (Math.random() - 0.5) * 0.1)),
        activeConnections: Math.max(10, Math.min(50, prev.activeConnections + Math.floor((Math.random() - 0.5) * 4))),
        dataFreshness: Math.max(1.0, Math.min(5.0, prev.dataFreshness + (Math.random() - 0.5) * 0.5)),
      }))

      setChartData((prev) =>
        prev.map((item) => ({
          ...item,
          ingestion: Math.max(500, Math.min(8000, item.ingestion + (Math.random() - 0.5) * 500)),
          queries: Math.max(20, Math.min(400, item.queries + (Math.random() - 0.5) * 30)),
          latency: Math.max(30, Math.min(200, item.latency + (Math.random() - 0.5) * 15)),
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`bg-white dark:bg-gray-900 text-black dark:text-white p-0 md:p-4 ${className}`}>
      <div className="flex items-center justify-center mb-4 p-4 md:p-0">
        <img
          src="/icons/bar-graph.png"
          alt="Data Warehouse"
          className="w-8 h-8"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      <div className="mb-6 p-4 md:p-0">
        <h1 className="text-2xl font-bold mb-2">Operational Data Warehouse Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Real-time analytics powered by ClickHouse & Moose Framework</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 md:p-0">
        <div className="bg-blue-50 border-2 border-blue-200 p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">Total Records</h3>
          <div className="text-2xl font-bold text-blue-900">{metrics.totalRecords.toLocaleString()}</div>
          <div className="text-xs text-blue-600">+{Math.floor(Math.random() * 1000)} today</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 p-4">
          <h3 className="text-sm font-semibold text-green-800 mb-1">Daily Ingestion</h3>
          <div className="text-2xl font-bold text-green-900">{metrics.dailyIngestion.toLocaleString()}</div>
          <div className="text-xs text-green-600">records/day</div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 p-4">
          <h3 className="text-sm font-semibold text-purple-800 mb-1">Avg Query Latency</h3>
          <div className="text-2xl font-bold text-purple-900">{metrics.queryLatency}ms</div>
          <div className="text-xs text-purple-600">ClickHouse OLAP</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 md:p-0">
        <div className="bg-gray-50 border-2 border-gray-300 p-4">
          <h3 className="text-lg font-semibold mb-3">Data Ingestion Rate</h3>
          <div className="h-32 bg-black p-2 relative">
            <div className="flex items-end h-full gap-1">
              {chartData.slice(-12).map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-end">
                  <div
                    className="bg-blue-400 w-full transition-all duration-1000"
                    style={{ height: `${(item.ingestion / 8000) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="absolute bottom-1 left-2 text-green-400 text-xs font-mono">
              {metrics.dailyIngestion.toLocaleString()} records/day
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-2 border-gray-300 p-4">
          <h3 className="text-lg font-semibold mb-3">Query Performance</h3>
          <div className="h-32 bg-black p-2 relative">
            <div className="flex items-end h-full gap-1">
              {chartData.slice(-12).map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-end">
                  <div
                    className="bg-green-400 w-full transition-all duration-1000"
                    style={{ height: `${(item.queries / 400) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="absolute bottom-1 left-2 text-green-400 text-xs font-mono">
              {metrics.queryLatency}ms avg latency
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-3 gap-4 p-4 md:p-0">
        <div className="bg-yellow-50 border-2 border-yellow-200 p-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">Storage Used</h3>
          <div className="text-xl font-bold text-yellow-900">{metrics.storageUsed.toFixed(1)} TB</div>
          <div className="w-full bg-yellow-200 h-2 mt-2 overflow-hidden">
            <div
              className="bg-yellow-600 h-full transition-all duration-1000"
              style={{ width: `${(metrics.storageUsed / 2.0) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-indigo-50 border-2 border-indigo-200 p-4">
          <h3 className="text-sm font-semibold text-indigo-800 mb-1">Active Connections</h3>
          <div className="text-xl font-bold text-indigo-900">{metrics.activeConnections}</div>
          <div className="text-xs text-indigo-600">ClickHouse clients</div>
        </div>
        <div className="bg-red-50 border-2 border-red-200 p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-1">Data Freshness</h3>
          <div className="text-xl font-bold text-red-900">{metrics.dataFreshness.toFixed(1)}min</div>
          <div className="text-xs text-red-600">last update</div>
        </div>
      </div>

      {/* Live Data Stream */}
      <div className="mt-6 bg-black text-green-400 p-4 font-mono text-xs">
        <div className="mb-2 text-white">Live Data Stream (Moose Framework + RedPanda):</div>
        <div className="space-y-1">
          <div className="animate-pulse">
            → INSERT INTO events_table VALUES ({Math.floor(Date.now() / 1000)}, 'user_action', '
            {JSON.stringify({ user_id: Math.floor(Math.random() * 1000), action: "click" })}')
          </div>
          <div className="animate-pulse" style={{ animationDelay: "0.5s" }}>
            → INSERT INTO logs_table VALUES ({Math.floor(Date.now() / 1000)}, 'INFO', 'Query executed successfully in{" "}
            {metrics.queryLatency}ms')
          </div>
          <div className="animate-pulse" style={{ animationDelay: "1s" }}>
            → INSERT INTO metrics_table VALUES ({Math.floor(Date.now() / 1000)}, 'ingestion_rate',{" "}
            {metrics.dailyIngestion})
          </div>
        </div>
      </div>
    </div>
  )
}
