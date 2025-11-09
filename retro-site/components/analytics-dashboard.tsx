"use client"

import { useState, useEffect } from "react"

interface AnalyticsDashboardProps {
  className?: string
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState({
    activeUsers: 12847,
    totalSessions: 45672,
    avgSessionDuration: 4.2,
    bounceRate: 23.5,
    conversionRate: 3.8,
    revenue: 89420,
  })

  const [userActivity, setUserActivity] = useState(
    Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      users: Math.floor(Math.random() * 2000) + 500,
      sessions: Math.floor(Math.random() * 3000) + 800,
      pageViews: Math.floor(Math.random() * 8000) + 2000,
    })),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        activeUsers: Math.max(8000, Math.min(20000, prev.activeUsers + Math.floor((Math.random() - 0.5) * 200))),
        totalSessions: Math.max(30000, Math.min(60000, prev.totalSessions + Math.floor((Math.random() - 0.5) * 100))),
        avgSessionDuration: Math.max(2.0, Math.min(8.0, prev.avgSessionDuration + (Math.random() - 0.5) * 0.2)),
        bounceRate: Math.max(15.0, Math.min(35.0, prev.bounceRate + (Math.random() - 0.5) * 1.0)),
        conversionRate: Math.max(2.0, Math.min(6.0, prev.conversionRate + (Math.random() - 0.5) * 0.1)),
        revenue: Math.max(70000, Math.min(120000, prev.revenue + Math.floor((Math.random() - 0.5) * 1000))),
      }))

      setUserActivity((prev) =>
        prev.map((item) => ({
          ...item,
          users: Math.max(200, Math.min(3000, item.users + Math.floor((Math.random() - 0.5) * 100))),
          sessions: Math.max(400, Math.min(4000, item.sessions + Math.floor((Math.random() - 0.5) * 150))),
          pageViews: Math.max(1000, Math.min(10000, item.pageViews + Math.floor((Math.random() - 0.5) * 300))),
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`text-black dark:text-white win95-inner-content ${className}`}>
      <div className="flex items-center justify-center mb-4">
        <img src="/icons/analytics.png" alt="Analytics" className="w-8 h-8" style={{ imageRendering: "pixelated" }} />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">User Facing Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Multi-modal architecture: PostgreSQL + ClickHouse + Elasticsearch
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border-2 border-blue-200 p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">Active Users</h3>
          <div className="text-2xl font-bold text-blue-900">{metrics.activeUsers.toLocaleString()}</div>
          <div className="text-xs text-blue-600">+{Math.floor(Math.random() * 100)} in last hour</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 p-4">
          <h3 className="text-sm font-semibold text-green-800 mb-1">Total Sessions</h3>
          <div className="text-2xl font-bold text-green-900">{metrics.totalSessions.toLocaleString()}</div>
          <div className="text-xs text-green-600">today</div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 p-4">
          <h3 className="text-sm font-semibold text-purple-800 mb-1">Avg Session Duration</h3>
          <div className="text-2xl font-bold text-purple-900">{metrics.avgSessionDuration.toFixed(1)}min</div>
          <div className="text-xs text-purple-600">engagement time</div>
        </div>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 border-2 border-gray-300 p-4">
          <h3 className="text-lg font-semibold mb-3">User Activity (Real-time)</h3>
          <div className="h-32 bg-black p-2 relative">
            <div className="flex items-end h-full gap-1">
              {userActivity.slice(-12).map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-end">
                  <div
                    className="bg-cyan-400 w-full transition-all duration-1000"
                    style={{ height: `${(item.users / 3000) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="absolute bottom-1 left-2 text-cyan-400 text-xs font-mono">
              {metrics.activeUsers.toLocaleString()} active users
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-2 border-gray-300 p-4">
          <h3 className="text-lg font-semibold mb-3">Page Views</h3>
          <div className="h-32 bg-black p-2 relative">
            <div className="flex items-end h-full gap-1">
              {userActivity.slice(-12).map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-end">
                  <div
                    className="bg-orange-400 w-full transition-all duration-1000"
                    style={{ height: `${(item.pageViews / 10000) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="absolute bottom-1 left-2 text-orange-400 text-xs font-mono">
              {userActivity.slice(-1)[0]?.pageViews.toLocaleString()} views/hour
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 border-2 border-yellow-200 p-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">Bounce Rate</h3>
          <div className="text-xl font-bold text-yellow-900">{metrics.bounceRate.toFixed(1)}%</div>
          <div className="w-full bg-yellow-200 h-2 mt-2 overflow-hidden">
            <div
              className="bg-yellow-600 h-full transition-all duration-1000"
              style={{ width: `${metrics.bounceRate}%` }}
            />
          </div>
        </div>
        <div className="bg-indigo-50 border-2 border-indigo-200 p-4">
          <h3 className="text-sm font-semibold text-indigo-800 mb-1">Conversion Rate</h3>
          <div className="text-xl font-bold text-indigo-900">{metrics.conversionRate.toFixed(1)}%</div>
          <div className="text-xs text-indigo-600">goal completions</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 p-4">
          <h3 className="text-sm font-semibold text-green-800 mb-1">Revenue</h3>
          <div className="text-xl font-bold text-green-900">${metrics.revenue.toLocaleString()}</div>
          <div className="text-xs text-green-600">today</div>
        </div>
      </div>

      {/* Multi-Modal Data Sources */}
      <div className="bg-gray-100 border-2 border-gray-300 p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Multi-Modal Data Architecture</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-100 p-3 border border-blue-300">
            <div className="font-semibold text-blue-800">PostgreSQL</div>
            <div className="text-blue-600">Transactional Data</div>
            <div className="text-xs text-blue-500 mt-1">User profiles, orders, sessions</div>
          </div>
          <div className="bg-green-100 p-3 border border-green-300">
            <div className="font-semibold text-green-800">ClickHouse</div>
            <div className="text-green-600">Analytics Engine</div>
            <div className="text-xs text-green-500 mt-1">Event aggregations, metrics</div>
          </div>
          <div className="bg-purple-100 p-3 border border-purple-300">
            <div className="font-semibold text-purple-800">Elasticsearch</div>
            <div className="text-purple-600">Search & Logs</div>
            <div className="text-xs text-purple-500 mt-1">Full-text search, log analysis</div>
          </div>
        </div>
      </div>

      {/* Live Event Stream */}
      <div className="bg-black text-green-400 p-4 font-mono text-xs">
        <div className="mb-2 text-white">Live Event Stream (React 19 + TanStack + Supabase Realtime):</div>
        <div className="space-y-1">
          <div className="animate-pulse">
            → USER_LOGIN: user_id={Math.floor(Math.random() * 10000)}, session_start={new Date().toISOString()}
          </div>
          <div className="animate-pulse" style={{ animationDelay: "0.5s" }}>
            → PAGE_VIEW: /dashboard, user_id={Math.floor(Math.random() * 10000)}, duration=
            {Math.floor(Math.random() * 300)}s
          </div>
          <div className="animate-pulse" style={{ animationDelay: "1s" }}>
            → CONVERSION: goal_id=signup, user_id={Math.floor(Math.random() * 10000)}, value=$
            {Math.floor(Math.random() * 100)}
          </div>
        </div>
      </div>
    </div>
  )
}
