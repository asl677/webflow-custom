"use client"

import { WindowFrame } from "./window-frame"

interface DataWarehouseTemplateProps {
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

export function DataWarehouseTemplate({
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
}: DataWarehouseTemplateProps) {
  const handleDownloadFromGithub = () => {
    window.open("https://github.com/514-labs/area-code/tree/main/odw", "_blank")
  }

  const handlePrevious = () => {
    window.dispatchEvent(
      new CustomEvent("navigateTemplate", { detail: { direction: "previous", current: "data-warehouse" } }),
    )
  }

  const handleNext = () => {
    window.dispatchEvent(
      new CustomEvent("navigateTemplate", { detail: { direction: "next", current: "data-warehouse" } }),
    )
  }

  const handleDownloadWindow = () => {
    console.log("[v0] Opening Data Warehouse Download Window")
    window.postMessage(
      {
        type: "openODWWindow",
        title: "Operational Data Warehouse - Download",
      },
      "*",
    )
  }

  return (
    <WindowFrame
      id={id}
      title="Data Warehouse Architecture Template - README"
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive}
      width={size?.width || 700}
      height={size?.height || 500}
      icon="/icons/bar-graph.png"
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
          <div className="flex items-center gap-0">
            <button
              onClick={() => {
                console.log("[v0] Opening Data Warehouse Preview")
                window.postMessage(
                  {
                    type: "openInternetExplorer",
                    url: "data-warehouse-dashboard",
                    title: "Data Warehouse Dashboard - Live Preview",
                  },
                  "*",
                )
              }}
              className="px-3 py-1 border text-black hover:bg-gray-300 text-xs font-normal"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              Preview
            </button>
            <button
              onClick={handleDownloadFromGithub}
              className="px-3 py-1 border text-black hover:bg-gray-300 text-xs font-normal"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              Download from Github
            </button>
            <button
              onClick={handleDownloadWindow}
              className="px-3 py-1 border text-black hover:bg-gray-300 text-xs font-normal"
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
            <h1 className="text-lg font-bold mb-4 text-center">Operational Data Warehouse (ODW)</h1>

            <p className="mb-4">
              The ODW project is a starter kit for an operational data warehouse, using the Moose framework to ingest
              data from various sources (Blobs, Events, Logs) into an analytical backend (ClickHouse). This is part of
              the Area Code baseline repository for bootstrapping sophisticated applications.
            </p>

            <div className="bg-black text-green-400 p-4 font-mono text-xs mb-6 border border-gray-400">
              <div className="text-white mb-2">Quick Install Script:</div>
              <div className="space-y-1">
                <div>$ git clone https://github.com/514-labs/area-code.git</div>
                <div>$ cd area-code/odw</div>
                <div>$ pip install -r requirements.txt</div>
                <div>$ docker-compose up -d # Start ClickHouse, RedPanda</div>
                <div>$ moose init # Initialize Moose framework</div>
                <div>$ moose dev # Start development environment</div>
                <div>$ streamlit run dashboard.py # Launch analytics frontend</div>
              </div>
              <div className="text-yellow-400 mt-2 text-xs">⚠ Requires Docker, Python 3.8+, and Moose CLI</div>
            </div>

            <h2 className="text-md font-bold mb-2 mt-6">ODW Stack:</h2>

            <h3 className="text-sm font-bold mb-2 mt-4">Backend & Data:</h3>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Framework: Moose (Python)</li>
              <li>Data Platform: ClickHouse (Warehouse) | RedPanda (Streaming)</li>
              <li>Ingestion: Moose connectors for Blobs, Events, and Logs</li>
              <li>Frontend: Streamlit</li>
            </ul>

            <h2 className="text-md font-bold mb-2 mt-6">Architecture Overview:</h2>
            <p className="mb-4">
              The ODW provides a complete data warehouse solution with real-time ingestion capabilities. It leverages
              the Moose framework's Python-based processing engine to handle diverse data sources and stream them into
              ClickHouse for analytical workloads.
            </p>

            <h2 className="text-md font-bold mb-2 mt-6">Core Components:</h2>

            <h3 className="text-sm font-bold mb-2 mt-4">1. Moose Framework</h3>
            <ul className="list-disc list-inside mb-3 space-y-1 ml-4">
              <li>Python-based data processing framework</li>
              <li>Built-in connectors for various data sources</li>
              <li>Automated schema management and evolution</li>
              <li>Real-time data transformation capabilities</li>
            </ul>

            <h3 className="text-sm font-bold mb-2 mt-4">2. ClickHouse Data Warehouse</h3>
            <ul className="list-disc list-inside mb-3 space-y-1 ml-4">
              <li>Columnar storage optimized for analytics</li>
              <li>High-performance OLAP queries</li>
              <li>Real-time data ingestion support</li>
              <li>Horizontal scaling capabilities</li>
            </ul>

            <h3 className="text-sm font-bold mb-2 mt-4">3. RedPanda Streaming Platform</h3>
            <ul className="list-disc list-inside mb-3 space-y-1 ml-4">
              <li>Kafka-compatible streaming platform</li>
              <li>Low-latency event processing</li>
              <li>Built-in schema registry</li>
              <li>Cloud-native architecture</li>
            </ul>

            <h3 className="text-sm font-bold mb-2 mt-4">4. Data Source Connectors</h3>
            <ul className="list-disc list-inside mb-3 space-y-1 ml-4">
              <li>Blob Storage: S3, Azure Blob, GCS integration</li>
              <li>Event Streams: Real-time event ingestion</li>
              <li>Log Processing: Structured and unstructured log parsing</li>
              <li>API Endpoints: REST and GraphQL data sources</li>
            </ul>

            <h3 className="text-sm font-bold mb-2 mt-4">5. Streamlit Analytics Frontend</h3>
            <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
              <li>Interactive Python-based dashboards</li>
              <li>Real-time data visualizations</li>
              <li>Self-service analytics capabilities</li>
              <li>Custom widget development</li>
            </ul>

            <h2 className="text-md font-bold mb-2 mt-6">Getting Started:</h2>
            <ol className="list-decimal list-inside mb-4 space-y-1">
              <li>Clone the area-code repository</li>
              <li>Navigate to the /odw directory</li>
              <li>Follow the ODW README for setup instructions</li>
              <li>Configure your data sources</li>
              <li>Deploy the Moose framework</li>
              <li>Set up ClickHouse and RedPanda</li>
              <li>Launch the Streamlit frontend</li>
            </ol>

            <h2 className="text-md font-bold mb-2 mt-6">Data Flow Architecture:</h2>
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
                {`Data Sources → Moose Framework → RedPanda → ClickHouse → Streamlit
    ↓              ↓                 ↓           ↓            ↓
  Blobs         Python           Kafka      Columnar    Interactive
  Events        Processing       Stream     Analytics    Dashboards
  Logs          Connectors       Platform   Storage      Frontend
  APIs          Transformations  Topics     Queries      Widgets`}
              </pre>
            </div>

            <h2 className="text-md font-bold mb-2 mt-6">Use Cases:</h2>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Real-time operational analytics</li>
              <li>Log aggregation and analysis</li>
              <li>Event stream processing</li>
              <li>Business intelligence reporting</li>
              <li>Data lake modernization</li>
            </ul>

            <div className="mt-8 p-3 bg-yellow-100 border border-yellow-400">
              <p className="text-xs">
                <strong>Area Code Repository:</strong> This ODW template is part of the 514-labs/area-code baseline
                repository for sophisticated applications. Visit the GitHub repository for complete setup instructions,
                documentation, and example implementations.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t" style={{ borderColor: "#808080" }}>
            <button
              className="win95-button px-6 py-2 text-sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  "git clone https://github.com/514-labs/area-code.git && cd area-code/odw && pip install -r requirements.txt",
                )
              }}
            >
              Copy Install
            </button>
            <button
              className="win95-button px-6 py-2 text-sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  "docker-compose up -d && moose init && moose dev && streamlit run dashboard.py",
                )
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
