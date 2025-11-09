"use client"

import { WindowFrame } from "./window-frame"

interface AnalyticsTemplateProps {
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

export function AnalyticsTemplate({
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
}: AnalyticsTemplateProps) {
  const handleDownloadFromGithub = () => {
    window.open("https://github.com/514-labs/area-code/tree/main/ufa", "_blank")
  }

  const handlePrevious = () => {
    window.dispatchEvent(
      new CustomEvent("navigateTemplate", { detail: { direction: "previous", current: "analytics" } }),
    )
  }

  const handleNext = () => {
    window.dispatchEvent(new CustomEvent("navigateTemplate", { detail: { direction: "next", current: "analytics" } }))
  }

  const handleDownloadWindow = () => {
    console.log("[v0] Opening Analytics Download Window")
    window.postMessage(
      {
        type: "openUFAWindow",
        title: "User Facing Analytics - Download",
      },
      "*",
    )
  }

  return (
    <WindowFrame
      id={id}
      title="User Facing Analytics Template - README"
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive}
      width={size?.width || 700}
      height={size?.height || 500}
      icon="/icons/analytics.png"
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onResize={onResize}
    >
      <div className="flex flex-col h-full" style={{ backgroundColor: "white" }}>
        {/* Document toolbar */}
        <div
          className="flex items-center justify-between border-b border-gray-400 px-2 py-1"
          style={{ backgroundColor: "#c0c0c0" }}
        >
          <div className="flex items-center gap-0">
            <button
              className="px-2 py-1 text-xs border text-black hover:bg-gray-300"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              File
            </button>
            <button
              className="px-2 py-1 text-xs border text-black hover:bg-gray-300"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              Edit
            </button>
            <button
              className="px-2 py-1 text-xs border text-black hover:bg-gray-300"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              View
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDownloadWindow}
              className="px-2 py-1 border text-black hover:bg-gray-300 text-xs"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              Download
            </button>
          </div>
        </div>

        {/* Document content */}
        <div
          className="flex-1 overflow-auto"
          style={{
            backgroundColor: "white",
            border: "2px solid",
            borderTopColor: "#808080",
            borderLeftColor: "#808080",
            borderRightColor: "#dfdfdf",
            borderBottomColor: "#dfdfdf",
            boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <div className="max-w-none text-black font-mono text-sm leading-relaxed p-4">
            <h1 className="text-lg font-bold mb-4 text-center">User Facing Analytics (UFA)</h1>

            <p className="mb-4">
              The UFA monorepo is a starter kit for building applications with a multi-modal backend that combines
              transactional (PostgreSQL), analytical (ClickHouse), and search (Elasticsearch) capabilities. The stack is
              configured for real-time data synchronization across services.
            </p>

            <div className="bg-black text-green-400 p-4 font-mono text-xs mb-6 border border-gray-400">
              <div className="text-white mb-2">Quick Install Script:</div>
              <div className="space-y-1">
                <div>$ git clone https://github.com/514-labs/area-code.git</div>
                <div>$ cd area-code/ufa</div>
                <div>$ npm install</div>
                <div>$ docker-compose up -d # Start PostgreSQL, ClickHouse, Elasticsearch</div>
                <div>$ npm run setup # Initialize databases and schemas</div>
                <div>$ npm run dev # Start development servers</div>
              </div>
              <div className="text-yellow-400 mt-2 text-xs">⚠ Requires Docker and Node.js 18+</div>
            </div>

            <h2 className="text-md font-bold mb-2 mt-6">UFA Stack:</h2>

            <h3 className="text-sm font-bold mb-2 mt-4">Backend & Data:</h3>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Transactional: PostgreSQL | Fastify | Drizzle ORM</li>
              <li>Analytical: ClickHouse | Moose (API & Ingest)</li>
              <li>Search: Elasticsearch</li>
            </ul>

            <h3 className="text-sm font-bold mb-2 mt-4">Sync & Streaming:</h3>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Moose Workflows (with Temporal)</li>
              <li>Moose Stream (with Redpanda)</li>
              <li>Supabase Realtime</li>
            </ul>

            <h3 className="text-sm font-bold mb-2 mt-4">Frontend:</h3>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Vite | React 19 | TypeScript</li>
              <li>TanStack (Router, Query, Form)</li>
              <li>Tailwind CSS</li>
            </ul>

            <h2 className="text-md font-bold mb-2 mt-6">Architecture Overview:</h2>
            <p className="mb-4">
              UFA provides a sophisticated multi-modal architecture that handles both transactional and analytical
              workloads. The system uses real-time synchronization to keep data consistent across PostgreSQL,
              ClickHouse, and Elasticsearch, enabling both operational and analytical use cases.
            </p>

            <h2 className="text-md font-bold mb-2 mt-6">Core Components:</h2>

            <h3 className="text-sm font-bold mb-2 mt-4">1. Multi-Modal Data Layer</h3>
            <ul className="list-disc list-inside mb-3 space-y-1 ml-4">
              <li>PostgreSQL for transactional operations</li>
              <li>ClickHouse for analytical queries</li>
              <li>Elasticsearch for full-text search</li>
              <li>Real-time synchronization between systems</li>
            </ul>

            <h3 className="text-sm font-bold mb-2 mt-4">2. Backend Services</h3>
            <ul className="list-disc list-inside mb-3 space-y-1 ml-4">
              <li>Fastify web framework for high performance</li>
              <li>Drizzle ORM for type-safe database operations</li>
              <li>Moose framework for data processing</li>
              <li>RESTful and GraphQL API endpoints</li>
            </ul>

            <h3 className="text-sm font-bold mb-2 mt-4">3. Real-time Infrastructure</h3>
            <ul className="list-disc list-inside mb-3 space-y-1 ml-4">
              <li>Temporal for workflow orchestration</li>
              <li>Redpanda for event streaming</li>
              <li>Supabase Realtime for live updates</li>
              <li>WebSocket connections for instant notifications</li>
            </ul>

            <h3 className="text-sm font-bold mb-2 mt-4">4. Modern Frontend Stack</h3>
            <ul className="list-disc list-inside mb-3 space-y-1 ml-4">
              <li>React 19 with latest features</li>
              <li>TanStack Router for type-safe routing</li>
              <li>TanStack Query for server state management</li>
              <li>TanStack Form for form handling</li>
              <li>Tailwind CSS for styling</li>
            </ul>

            <h3 className="text-sm font-bold mb-2 mt-4">5. Analytics & Search</h3>
            <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
              <li>Real-time analytics dashboards</li>
              <li>Full-text search capabilities</li>
              <li>Interactive data visualizations</li>
              <li>Custom reporting tools</li>
            </ul>

            <h2 className="text-md font-bold mb-2 mt-6">Getting Started:</h2>
            <ol className="list-decimal list-inside mb-4 space-y-1">
              <li>Clone the area-code repository</li>
              <li>Navigate to the /ufa directory</li>
              <li>Follow the UFA README for setup instructions</li>
              <li>Configure PostgreSQL, ClickHouse, and Elasticsearch</li>
              <li>Set up Moose workflows and streaming</li>
              <li>Deploy the Fastify backend services</li>
              <li>Launch the React frontend application</li>
            </ol>

            <h2 className="text-md font-bold mb-2 mt-6">System Architecture:</h2>
            <div
              className="bg-gray-100 p-3 border border-gray-400 mb-4"
              style={{
                borderTopColor: "#808080",
                borderLeftColor: "#808080",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              <pre className="text-xs font-mono">
                {`Frontend (React 19 + TanStack) → Fastify API → Multi-Modal Backend
                    ↓                           ↓              ↓
                 Vite Build                  Drizzle ORM    PostgreSQL
                 Tailwind CSS               Moose API      ClickHouse
                 TypeScript                 REST/GraphQL   Elasticsearch
                    ↑                           ↑              ↑
                Real-time Updates ← Supabase Realtime ← Redpanda Stream`}
              </pre>
            </div>

            <h2 className="text-md font-bold mb-2 mt-6">Key Features:</h2>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Multi-modal data architecture</li>
              <li>Real-time synchronization</li>
              <li>Type-safe development experience</li>
              <li>Scalable microservices architecture</li>
              <li>Modern React 19 frontend</li>
              <li>Full-text search capabilities</li>
              <li>Analytics and reporting tools</li>
            </ul>

            <h2 className="text-md font-bold mb-2 mt-6">Use Cases:</h2>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Customer-facing analytics dashboards</li>
              <li>Real-time operational monitoring</li>
              <li>Search-driven applications</li>
              <li>Multi-tenant SaaS platforms</li>
              <li>Data-intensive web applications</li>
            </ul>

            <div className="mt-8 p-3 bg-yellow-100 border border-yellow-400">
              <p className="text-xs">
                <strong>Area Code Repository:</strong> This UFA template is part of the 514-labs/area-code baseline
                repository for sophisticated applications. The multi-modal architecture provides a robust foundation for
                building feature-rich, enterprise-ready applications with real-time capabilities.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t" style={{ borderColor: "#808080" }}>
            <button
              className="win95-button px-6 py-2 text-sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  "git clone https://github.com/514-labs/area-code.git && cd area-code/ufa && npm install",
                )
              }}
            >
              Copy Install
            </button>
            <button
              className="win95-button px-6 py-2 text-sm"
              onClick={() => {
                navigator.clipboard.writeText("docker-compose up -d && npm run setup && npm run dev")
              }}
            >
              Copy Setup
            </button>
            <button className="win95-button px-6 py-2 text-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {/* Status bar */}
      </div>
    </WindowFrame>
  )
}
