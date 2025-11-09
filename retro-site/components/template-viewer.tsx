"use client"

import { useState } from "react"
import { WindowFrame } from "./window-frame"

interface TemplateViewerProps {
  id: string
  initialTemplate?: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  size?: { width: number; height: number }
  isActive?: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onMaximize: () => void
  onResize: (size: { width: number; height: number }) => void
}

export function TemplateViewer({
  id,
  initialTemplate = "analytics",
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  size,
  isActive,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onMaximize,
  onResize,
}: TemplateViewerProps) {
  const [currentTemplate, setCurrentTemplate] = useState(initialTemplate)

  const templates = [
    { id: "analytics", title: "User Facing Analytics (UFA)" },
    { id: "data-warehouse", title: "Operational Data Warehouse (ODW)" },
  ]

  const currentTemplateData = templates.find((t) => t.id === currentTemplate)

  const handlePrevious = () => {
    const currentIndex = templates.findIndex((t) => t.id === currentTemplate)
    const prevIndex = (currentIndex - 1 + templates.length) % templates.length
    setCurrentTemplate(templates[prevIndex].id)
  }

  const handleNext = () => {
    const currentIndex = templates.findIndex((t) => t.id === currentTemplate)
    const nextIndex = (currentIndex + 1) % templates.length
    setCurrentTemplate(templates[nextIndex].id)
  }

  const handleDownloadFromGithub = () => {
    const githubUrls = {
      analytics: "https://github.com/514-labs/area-code/tree/main/ufa",
      "data-warehouse": "https://github.com/514-labs/area-code/tree/main/odw",
    }
    window.open(
      githubUrls[currentTemplate] || `https://github.com/514-labs/area-code/tree/main/${currentTemplate}`,
      "_blank",
    )
  }

  const handleDownload = () => {
    console.log(`[v0] Opening ${currentTemplate} Download Window`)
    if (currentTemplate === "analytics") {
      window.postMessage(
        {
          type: "openUFAWindow",
          title: "User Facing Analytics - Download",
        },
        "*",
      )
    } else if (currentTemplate === "data-warehouse") {
      window.postMessage(
        {
          type: "openODWWindow",
          title: "Operational Data Warehouse - Download",
        },
        "*",
      )
    }
  }

  const handleOpenInCursor = () => {
    window.dispatchEvent(new CustomEvent("openCursor", { detail: { templateName: currentTemplate } }))
  }

  const renderTemplateContent = () => {
    if (currentTemplate === "analytics") {
      return (
        <div className="max-w-none text-black dark:text-white font-mono leading-relaxed win95-inner-content">
          <h1 className="text-xl font-bold mb-6 text-center border-b-2 border-gray-400 pb-3">
            User Facing Analytics (UFA)
          </h1>

          <p className="mb-4 text-sm leading-relaxed">
            The UFA monorepo is a starter kit for building applications with a multi-modal backend that combines
            transactional (PostgreSQL), analytical (ClickHouse), and search (Elasticsearch) capabilities. The stack is
            configured for real-time data synchronization across services.
          </p>

          <h2 className="text-lg font-bold mb-3 mt-8 text-gray-800 dark:text-white">UFA Stack:</h2>

          <h3 className="text-md font-bold mb-2 mt-4 text-gray-700 dark:text-white">Backend & Data:</h3>
          <ul className="list-disc list-inside mb-4 space-y-1 text-sm">
            <li>Transactional: PostgreSQL | Fastify | Drizzle ORM</li>
            <li>Analytical: ClickHouse | Moose (API & Ingest)</li>
            <li>Search: Elasticsearch</li>
          </ul>

          <h3 className="text-md font-bold mb-2 mt-4 text-gray-700 dark:text-white">Sync & Streaming:</h3>
          <ul className="list-disc list-inside mb-4 space-y-1 text-sm">
            <li>Moose Workflows (with Temporal)</li>
            <li>Moose Stream (with Redpanda)</li>
            <li>Supabase Realtime</li>
          </ul>

          <h3 className="text-md font-bold mb-2 mt-4 text-gray-700 dark:text-white">Frontend:</h3>
          <ul className="list-disc list-inside mb-6 space-y-1 text-sm">
            <li>Vite | React 19 | TypeScript</li>
            <li>TanStack (Router, Query, Form)</li>
            <li>Tailwind CSS</li>
          </ul>

          <div className="mt-8 p-4 bg-yellow-100 dark:bg-gray-800 border-2 border-yellow-400 dark:border-gray-600 rounded">
            <p className="text-sm font-medium">
              <strong>GitHub Repository:</strong> This UFA template is available at{" "}
              <a href="https://github.com/514-labs/area-code/tree/main/ufa" className="win95-blue-link">
                github.com/514-labs/area-code/tree/main/ufa
              </a>
            </p>
          </div>
        </div>
      )
    } else if (currentTemplate === "data-warehouse") {
      return (
        <div className="max-w-none text-black dark:text-white font-mono leading-relaxed win95-inner-content">
          <h1 className="text-xl font-bold mb-6 text-center border-b-2 border-gray-400 pb-3">
            Operational Data Warehouse (ODW)
          </h1>

          <p className="mb-4 text-sm leading-relaxed">
            The ODW project is a starter kit for an operational data warehouse, using the Moose framework to ingest data
            from various sources (Blobs, Events, Logs) into an analytical backend (ClickHouse).
          </p>

          <h2 className="text-lg font-bold mb-3 mt-8 text-gray-800 dark:text-white">ODW Stack:</h2>

          <h3 className="text-md font-bold mb-2 mt-4 text-gray-700 dark:text-white">Backend & Data:</h3>
          <ul className="list-disc list-inside mb-4 space-y-1 text-sm">
            <li>Framework: Moose (Python)</li>
            <li>Data Platform: ClickHouse (Warehouse) | RedPanda (Streaming)</li>
            <li>Ingestion: Moose connectors for Blobs, Events, and Logs</li>
          </ul>

          <h3 className="text-md font-bold mb-2 mt-4 text-gray-700 dark:text-white">Frontend:</h3>
          <ul className="list-disc list-inside mb-6 space-y-1 text-sm">
            <li>Streamlit</li>
          </ul>

          <div className="mt-8 p-4 bg-blue-100 dark:bg-gray-800 border-2 border-blue-400 dark:border-gray-600 rounded">
            <p className="text-sm font-medium">
              <strong>GitHub Repository:</strong> This ODW template is available at{" "}
              <a href="https://github.com/514-labs/area-code/tree/main/odw" className="win95-blue-link">
                github.com/514-labs/area-code/tree/main/odw
              </a>
            </p>
          </div>
        </div>
      )
    }
  }

  return (
    <WindowFrame
      id={id}
      title={`${currentTemplateData?.title} - Document`}
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      width={size?.width || 700}
      height={size?.height || 600} // updated height to match moosestack
      icon={currentTemplate === "analytics" ? "/icons/analytics.png" : "/icons/bar-graph.png"}
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onResize={onResize}
    >
      <div className="flex flex-col h-full bg-white dark:bg-black">
        {/* Document toolbar */}
        <div
          className="flex items-center justify-between border-gray-400 border-b-0 px-[0] py-[0]"
          style={{ backgroundColor: "#c0c0c0" }}
        >
          <div className="flex items-center gap-0">
            <button className="px-2 py-1  text-black hover:bg-gray-300 text-sm">File</button>
            <button className="px-2 py-1 text-black hover:bg-gray-300 text-sm">Edit</button>
            <button className="px-2 py-1 text-black hover:bg-gray-300 text-sm">View</button>
          </div>
          <div className="flex items-center gap-0">
            <button onClick={handlePrevious} className="px-2 py-1 text-black hover:bg-gray-300 text-sm">
              Previous
            </button>
            <button onClick={handleNext} className="px-2 py-1 text-black hover:bg-gray-300 text-sm">
              Next
            </button>
            <button onClick={handleDownload} className="px-3 py-1 text-black hover:bg-gray-300 font-normal text-sm">
              Download
            </button>
            <button onClick={handleOpenInCursor} className="px-3 py-1 text-black hover:bg-gray-300 font-normal text-sm">
              {"Add to code base"}
            </button>

            <button
              onClick={handleDownloadFromGithub}
              className="px-3 py-1 text-sm font-normal text-black hover:bg-gray-300"
            >
              Github
            </button>
          </div>
        </div>

        {/* Document content */}
        <div
          className="flex-1 overflow-y-auto bg-white p-4"
          style={{
            border: "2px solid",
            borderTopColor: "#555",
            borderLeftColor: "#555",
            borderRightColor: "#dfdfdf",
            borderBottomColor: "#dfdfdf",
            boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #808080, inset -2px -2px #dfdfdf, inset 2px 2px #000000",
          }}
        >
          {renderTemplateContent()}
        </div>

        {/* Status bar */}
        <div
          className="border-t border-gray-400 px-2 py-1 !pb-0 text-xs text-black dark:text-white"
          style={{ backgroundColor: "#c0c0c0" }}
        >
          <span className="flex items-center gap-1">
            <span>Ready</span>
            <span>| Page 1 of 1 | {currentTemplateData?.title} v2.1</span>
          </span>
        </div>
      </div>
    </WindowFrame>
  )
}

export default TemplateViewer
