"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { WindowFrame } from "./window-frame"
import { Win95MenuBar } from "./win95-menubar"

interface CursorEditorProps {
  id: string
  templateName: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  isActive?: boolean
  isDarkMode?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
}

const TEMPLATE_CODE = {
  "cursor-editor": `// Welcome to Cursor Editor
import React from 'react'

function App() {
  return (
    <div className="app">
      <h1>Hello World</h1>
      <p>Start coding here...</p>
    </div>
  )
}

export default App`,
  analytics: `// Analytics Dashboard Template
import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AnalyticsDashboard = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch analytics data
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/analytics')
      const result = await response.json()
      setData(result)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="dashboard">
      <h1>Analytics Dashboard</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#8884d8" />
          <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalyticsDashboard`,
  "data-warehouse": `// Data Warehouse Template - Moose Framework
import { Moose } from '@moose-framework/core'
import { ClickHouse } from '@moose-framework/clickhouse'
import { RedPanda } from '@moose-framework/redpanda'

const moose = new Moose({
  name: 'operational-data-warehouse',
  version: '1.0.0'
})

// Configure ClickHouse warehouse
const warehouse = new ClickHouse({
  host: 'YOUR_CLICKHOUSE_HOST',
  port: 8123,
  database: 'odw'
})

// Configure RedPanda streaming
const streaming = new RedPanda({
  brokers: ['YOUR_REDPANDA_BROKER'],
  topics: ['events', 'logs', 'blobs']
})

// Data ingestion connectors
moose.connector('blob-storage', {
  type: 'blob',
  source: 'YOUR_BLOB_STORAGE_URL',
  destination: warehouse.table('blob_data')
})

moose.connector('event-stream', {
  type: 'stream',
  source: streaming.topic('events'),
  destination: warehouse.table('events')
})

moose.connector('log-aggregator', {
  type: 'logs',
  source: '/var/log/application.log',
  destination: warehouse.table('logs')
})

// Start the ODW pipeline
moose.start()

export default moose`,
  "data-json": `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00Z",
      "metadata": {
        "source": "web_signup",
        "campaign": "winter_2024"
      }
    },
    {
      "id": 2,
      "name": "Jane Smith", 
      "email": "jane@example.com",
      "created_at": "2024-01-16T14:22:00Z",
      "metadata": {
        "source": "mobile_app",
        "campaign": "mobile_launch"
      }
    }
  ],
  "events": [
    {
      "event_id": "evt_001",
      "user_id": 1,
      "event_type": "page_view",
      "timestamp": "2024-01-15T10:35:00Z",
      "properties": {
        "page": "/dashboard",
        "referrer": "google.com"
      }
    },
    {
      "event_id": "evt_002", 
      "user_id": 2,
      "event_type": "button_click",
      "timestamp": "2024-01-16T14:25:00Z",
      "properties": {
        "button_id": "signup_cta",
        "page": "/landing"
      }
    }
  ],
  "metrics": {
    "total_users": 2,
    "active_sessions": 1,
    "conversion_rate": 0.85,
    "last_updated": "2024-01-16T15:00:00Z"
  }
}`,
}

const FILE_TREE = {
  "cursor-editor": [
    {
      type: "folder",
      name: "src",
      path: "src",
      children: [
        {
          type: "folder",
          name: "components",
          path: "src/components",
          children: [
            { type: "file", name: "App.tsx", path: "src/components/App.tsx" },
            { type: "file", name: "Header.tsx", path: "src/components/Header.tsx" },
          ],
        },
        { type: "file", name: "index.tsx", path: "src/index.tsx" },
      ],
    },
    { type: "file", name: "package.json", path: "package.json" },
    { type: "file", name: "tsconfig.json", path: "tsconfig.json" },
  ],
  analytics: [
    {
      type: "folder",
      name: "src",
      path: "src",
      children: [
        {
          type: "folder",
          name: "components",
          path: "src/components",
          children: [
            { type: "file", name: "Dashboard.tsx", path: "src/components/Dashboard.tsx" },
            { type: "file", name: "Chart.tsx", path: "src/components/Chart.tsx" },
            { type: "file", name: "Metrics.tsx", path: "src/components/Metrics.tsx" },
          ],
        },
        {
          type: "folder",
          name: "pages",
          path: "src/pages",
          children: [
            { type: "file", name: "index.tsx", path: "src/pages/index.tsx" },
            { type: "file", name: "analytics.tsx", path: "src/pages/analytics.tsx" },
          ],
        },
        {
          type: "folder",
          name: "api",
          path: "src/api",
          children: [{ type: "file", name: "analytics.ts", path: "src/api/analytics.ts" }],
        },
      ],
    },
    { type: "file", name: "package.json", path: "package.json" },
    { type: "file", name: "next.config.js", path: "next.config.js" },
    { type: "file", name: "tailwind.config.js", path: "tailwind.config.js" },
  ],
  "data-warehouse": [
    {
      type: "folder",
      name: "src",
      path: "src",
      children: [
        {
          type: "folder",
          name: "connectors",
          path: "src/connectors",
          children: [
            { type: "file", name: "blob-connector.py", path: "src/connectors/blob-connector.py" },
            { type: "file", name: "event-connector.py", path: "src/connectors/event-connector.py" },
            { type: "file", name: "log-connector.py", path: "src/connectors/log-connector.py" },
          ],
        },
        {
          type: "folder",
          name: "warehouse",
          path: "src/warehouse",
          children: [
            { type: "file", name: "clickhouse.py", path: "src/warehouse/clickhouse.py" },
            { type: "file", name: "schemas.py", path: "src/warehouse/schemas.py" },
          ],
        },
        {
          type: "folder",
          name: "streaming",
          path: "src/streaming",
          children: [{ type: "file", name: "redpanda.py", path: "src/streaming/redpanda.py" }],
        },
      ],
    },
    { type: "file", name: "moose.config.py", path: "moose.config.py" },
    { type: "file", name: "requirements.txt", path: "requirements.txt" },
    { type: "file", name: "docker-compose.yml", path: "docker-compose.yml" },
  ],
  "data-json": [
    { type: "file", name: "data.json", path: "data.json" },
    { type: "file", name: "schema.json", path: "schema.json" },
    { type: "file", name: "README.md", path: "README.md" },
  ],
}

export function CursorEditor({
  id,
  templateName,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  isActive,
  isDarkMode = false,
  onMaximize,
  size,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
}: CursorEditorProps) {
  console.log("[v0] CursorEditor component rendering")

  const [code, setCode] = useState(
    TEMPLATE_CODE[templateName as keyof typeof TEMPLATE_CODE] || "// Template code loading...",
  )
  const [terminalOutput, setTerminalOutput] = useState("")
  const [selectedFile, setSelectedFile] = useState(
    templateName === "data-json" ? "data.json" : templateName === "cursor-editor" ? "App.tsx" : "main.tsx",
  )
  const [showBrowser, setShowBrowser] = useState(false)
  const [installationComplete, setInstallationComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [activeChatTab, setActiveChatTab] = useState("Chat")
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showFileTree, setShowFileTree] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [fileTreeWidth, setFileTreeWidth] = useState(320) // increased from 240px to 290px to make files pane 50px wider
  const [chatWidth, setChatWidth] = useState(220) // 80 * 4 = 320px (w-80)
  const [isResizingFileTree, setIsResizingFileTree] = useState(false)
  const [isResizingChat, setIsResizingChat] = useState(false)

  useEffect(() => {
    const startTime = Date.now()
    const minLoadTime = 1500 // minimum 1.5 second load time

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        const elapsed = Date.now() - startTime

        if (prev >= 100 && elapsed >= minLoadTime) {
          clearInterval(progressInterval)
          setTimeout(() => setIsLoading(false), 200)
          return 100
        }

        // Slow down progress near the end if we haven't hit minimum time
        const progressIncrement = elapsed < minLoadTime && prev > 80 ? Math.random() * 3 + 1 : Math.random() * 15 + 5

        return Math.min(prev + progressIncrement, 100)
      })
    }, 100)

    return () => {
      clearInterval(progressInterval)
    }
  }, [])

  const checkMobile = () => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    if (mobile) {
      setShowFileTree(false)
      setShowChat(false)
    }
  }

  useEffect(() => {
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleGitCommand = (command: string) => {
    if (command === "git commit -m 'Update template' && git push origin main && npm run dev" && installationComplete) {
      setTerminalOutput(
        (prev) =>
          prev +
          "\n$ git add .\n$ git commit -m 'Update template'\n$ git push origin main\n$ Changes committed successfully!\n$ npm run dev\n$ Starting Moose development server...\n$ Server running on http://localhost:3000\n$ Opening browser...\n$ ",
      )
      setTimeout(() => {
        setShowBrowser(true)
      }, 2000)
    }
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    setChatMessages((prev) => [...prev, { role: "user", content: chatInput }])
    setChatInput("")

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I can help you with your code! What would you like me to build or modify?",
        },
      ])
    }, 1000)
  }

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item, index) => (
      <div key={index} style={{ paddingLeft: `${level * 8}px` }}>
        <div
          className={`cursor-pointer hover:bg-gray-200 py-0.5 px-1 text-xs text-black flex items-center ${
            item.type === "file" && item.name.includes(selectedFile.split("/").pop() || "") ? "bg-blue-100" : ""
          }`}
          onClick={() => {
            if (item.type === "file") {
              setSelectedFile(item.name)
            }
          }}
        >
          <span>{item.name}</span>
        </div>
        {item.children && renderFileTree(item.children, level + 1)}
      </div>
    ))
  }

  const renderBrowser = () => (
    <div
      className="absolute inset-0 bg-white border border-gray-400 z-50"
      style={{
        borderTopColor: "#808080",
        borderLeftColor: "#808080",
        borderRightColor: "#dfdfdf",
        borderBottomColor: "#dfdfdf",
      }}
    >
      <div className="flex items-center justify-between bg-gray-100 border-b border-gray-300 px-2 py-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
          <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white border border-gray-400 px-2 py-1 text-xs">http://localhost:3000</div>
        </div>
        <button
          onClick={() => setShowBrowser(false)}
          className="px-2 py-1 text-xs border text-black hover:bg-gray-300"
          style={{
            backgroundColor: "#c0c0c0",
            borderTopColor: "#dfdfdf",
            borderLeftColor: "#dfdfdf",
            borderRightColor: "#808080",
            borderBottomColor: "#808080",
          }}
        >
          ✕
        </button>
      </div>
      <div className="p-4 bg-white h-full overflow-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">🎉 App Running Successfully!</h1>
          <div className="bg-gray-100 border border-gray-300 p-4 rounded text-left text-sm text-black">
            <div className="font-mono">
              <div>✅ Template: {templateName}</div>
              <div>✅ Server: localhost:3000</div>
              <div>✅ Status: Running</div>
              <div>✅ Build: Successful</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const handleFileTreeResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingFileTree(true)
  }

  const handleChatResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingChat(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingFileTree) {
        const newWidth = Math.max(150, Math.min(400, e.clientX - position.x))
        setFileTreeWidth(newWidth)
      }
      if (isResizingChat) {
        const windowWidth = size?.width || 1200
        const newWidth = Math.max(200, Math.min(500, position.x + windowWidth - e.clientX))
        setChatWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizingFileTree(false)
      setIsResizingChat(false)
    }

    if (isResizingFileTree || isResizingChat) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizingFileTree, isResizingChat, position.x, size?.width])

  if (isLoading) {
    return (
      <WindowFrame
        id={id}
        title="Cursor - Loading"
        position={position}
        zIndex={zIndex}
        isAnimating={isAnimating}
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        isActive={isActive}
        onMaximize={onMaximize}
        width={size?.width || 500}
        height={size?.height || 400}
        icon="/icons/mouse_speed.png"
        onClose={onClose}
        onFocus={onFocus}
        onMove={onMove}
        onMinimize={onMinimize}
        onResize={onResize}
      >
        <div className="h-full flex flex-col items-center justify-center" style={{ backgroundColor: "#c0c0c0" }}>
          <div className="mb-8">
            <img src="/icons/mouse_speed.png" alt="Mouse Speed" className="w-16 h-16" />
          </div>
          <div className="text-center">
            <div className="text-black text-sm mb-4 font-sans">Loading Cursor...</div>
            <div
              className="w-64 h-4 border-2 border-gray-400"
              style={{ borderStyle: "inset", backgroundColor: "#c0c0c0" }}
            >
              <div
                className="h-full transition-all duration-100 bg-win95-titlebar dark:bg-white"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-black text-xs mt-2 font-sans">{Math.round(loadingProgress)}%</div>
          </div>
        </div>
      </WindowFrame>
    )
  }

  return (
    <WindowFrame
      id={id}
      title="Cursor - Editor"
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive}
      onMaximize={onMaximize}
      width={size?.width || (isMobile ? window.innerWidth - 40 : 1200)}
      height={size?.height || (isMobile ? window.innerHeight - 120 : 600)}
      icon="/icons/mouse_speed.png"
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
    >
      <div className="h-full flex flex-col bg-win95-window">
        {showBrowser && renderBrowser()}

        <Win95MenuBar
          items={[
            {
              label: "File",
              items: [
                { label: "New File", onClick: () => {}, shortcut: "Ctrl+N" },
                { label: "Open File", onClick: () => {}, shortcut: "Ctrl+O" },
                { label: "Open Folder", onClick: () => {} },
                { type: "separator" },
                { label: "Save", onClick: () => {}, shortcut: "Ctrl+S" },
                { label: "Save As...", onClick: () => {}, shortcut: "Ctrl+Shift+S" },
                { type: "separator" },
                { label: "Close Editor", onClick: onClose },
              ],
            },
            {
              label: "Edit",
              items: [
                { label: "Undo", onClick: () => {}, shortcut: "Ctrl+Z" },
                { label: "Redo", onClick: () => {}, shortcut: "Ctrl+Y" },
                { type: "separator" },
                { label: "Cut", onClick: () => {}, shortcut: "Ctrl+X" },
                { label: "Copy", onClick: () => {}, shortcut: "Ctrl+C" },
                { label: "Paste", onClick: () => {}, shortcut: "Ctrl+V" },
                { type: "separator" },
                { label: "Select All", onClick: () => {}, shortcut: "Ctrl+A" },
                { label: "Find", onClick: () => {}, shortcut: "Ctrl+F" },
                { label: "Replace", onClick: () => {}, shortcut: "Ctrl+H" },
              ],
            },
            {
              label: "View",
              items: [
                { label: "Toggle File Tree", onClick: () => setShowFileTree(!showFileTree) },
                { label: "Toggle Chat", onClick: () => setShowChat(!showChat) },
                { type: "separator" },
                { label: "Zoom In", onClick: () => {}, shortcut: "Ctrl++" },
                { label: "Zoom Out", onClick: () => {}, shortcut: "Ctrl+-" },
                { label: "Reset Zoom", onClick: () => {}, shortcut: "Ctrl+0" },
                { type: "separator" },
                { label: "Toggle Terminal", onClick: () => {} },
                { label: "Toggle Browser", onClick: () => setShowBrowser(!showBrowser) },
              ],
            },
            {
              label: "Run",
              items: [
                { label: "Run Code", onClick: () => {}, shortcut: "F5" },
                { label: "Debug", onClick: () => {}, shortcut: "F9" },
                { type: "separator" },
                { label: "Install Dependencies", onClick: () => {} },
                { label: "Build Project", onClick: () => {} },
              ],
            },
            {
              label: "Help",
              items: [
                { label: "Documentation", onClick: () => {} },
                { label: "Keyboard Shortcuts", onClick: () => {} },
                { type: "separator" },
                { label: "About Cursor", onClick: () => {} },
              ],
            },
          ]}
        />

        {isMobile && (
          <div className="flex border-b border-gray-400 bg-win95-window p-1 gap-1">
            <button
              onClick={() => {
                setShowFileTree(!showFileTree)
                setShowChat(false)
              }}
              className={`px-2 py-1 text-xs border ${showFileTree ? "bg-blue-100" : "bg-gray-200"} hover:bg-gray-300`}
              style={{
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              Files
            </button>
            <button
              onClick={() => {
                setShowChat(!showChat)
                setShowFileTree(false)
              }}
              className={`px-2 py-1 text-xs border ${showChat ? "bg-blue-100" : "bg-gray-200"} hover:bg-gray-300`}
              style={{
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              Chat
            </button>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden p-1 border-none shadow-none py-0 px-0 mx-2">
          {(!isMobile || showFileTree) && (
            <>
              <div
                className={`${isMobile ? "absolute inset-0 z-10 bg-white" : ""} flex flex-col h-full win95-inner-content`}
                style={{
                  width: isMobile ? "100%" : `${fileTreeWidth}px`,
                  backgroundColor: "white",
                  boxShadow: "var(--shadow-inner-4)",
                }}
              >
                <div className="flex-1 overflow-auto p-1">
                  {renderFileTree(FILE_TREE[templateName as keyof typeof FILE_TREE] || [])}
                </div>
              </div>
              {!isMobile && (
                <div
                  className="w-1 bg-gray-400 cursor-col-resize hover:bg-gray-500 flex-shrink-0"
                  onMouseDown={handleFileTreeResize}
                  style={{
                    borderLeft: "1px solid #808080",
                    borderRight: "1px solid #dfdfdf",
                    zIndex: 10,
                    position: "relative",
                  }}
                />
              )}
            </>
          )}

          {/* Code Editor */}
          <div className="flex-1 flex flex-col" style={{ minWidth: "50%" }}>
            <div
              className="flex-1 flex flex-col win95-inner-content"
              style={{
                backgroundColor: "white",
                boxShadow: "var(--shadow-inner-4)",
              }}
            >
              <div className="flex h-full">
                <div className="flex-1 overflow-hidden px-0 py-0 mx-1.5 my-1.5">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`w-full h-full resize-none border-none outline-none bg-transparent font-mono ${isMobile ? "text-sm" : "text-xs"} leading-4`}
                    style={{
                      overflow: "hidden",
                      color: isDarkMode ? "#ffffff !important" : "#000000 !important",
                    }}
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            {!isMobile && (
              <div
                className="h-24 flex flex-col mt-1 win95-inner-content"
                style={{
                  backgroundColor: "white",
                  boxShadow: "var(--shadow-inner-4)",
                }}
              >
                <div className="flex-1 p-2 overflow-auto">
                  <pre 
                    className="text-xs whitespace-pre-wrap font-mono leading-4"
                    style={{ color: isDarkMode ? "#ffffff !important" : "#000000 !important" }}
                  >
                    {terminalOutput}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {(!isMobile || showChat) && (
            <>
              {!isMobile && (
                <div
                  className="w-1 bg-gray-400 cursor-col-resize hover:bg-gray-500 flex-shrink-0"
                  onMouseDown={handleChatResize}
                  style={{
                    borderLeft: "1px solid #808080",
                    borderRight: "1px solid #dfdfdf",
                    zIndex: 10,
                    position: "relative",
                  }}
                />
              )}
              <div
                className={`${isMobile ? "absolute inset-0 z-10 bg-white" : ""} flex flex-col h-full win95-inner-content`}
                style={{
                  width: isMobile ? "100%" : `${chatWidth}px`,
                  backgroundColor: "white",
                  boxShadow: "var(--shadow-inner-4)",
                }}
              >
                {/* Chat Content */}
                {activeChatTab === "Chat" && (
                  <>
                    <div className="flex-1 overflow-auto p-3 space-y-3">
                      {chatMessages.length === 0 ? (
                        <div className="text-xs text-gray-600 text-center mt-8">
                          Start a chat to help with your code
                        </div>
                      ) : (
                        chatMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`text-xs ${message.role === "user" ? "text-right" : "text-left"}`}
                          >
                            <div
                              className={`inline-block p-2 rounded max-w-[90%] ${
                                message.role === "user"
                                  ? "bg-blue-100 text-black"
                                  : "bg-gray-100 text-black border border-gray-300"
                              }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder="Ask anything"
                          className="flex-1 px-2 py-1 text-xs text-black bg-white !shadow-none border-none"
                         
                        />
                        <button
                          onClick={handleSendMessage}
                          className="px-3 py-1 text-xs border text-black hover:bg-gray-300"
                          style={{
                            backgroundColor: "#c0c0c0",
                            borderTopColor: "#dfdfdf",
                            borderLeftColor: "#dfdfdf",
                            borderRightColor: "#808080",
                            borderBottomColor: "#808080",
                          }}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {activeChatTab === "Tasks" && (
                  <div className="flex-1 p-3">
                    <div className="text-xs text-gray-600">No active tasks</div>
                  </div>
                )}

                {activeChatTab === "Goals" && (
                  <div className="flex-1 p-3">
                    <div className="text-xs text-gray-600">No goals set</div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </WindowFrame>
  )
}

export default CursorEditor
