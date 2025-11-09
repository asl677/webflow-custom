"use client"

import { useState, useEffect, useRef } from "react" // Import useRef
import type React from "react"

import { WindowFrame } from "./window-frame"
import { Win95MenuBar } from "./win95-menubar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FactoryAppProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  isActive?: boolean
  size?: { width: number; height: number }
  sampleData?: any
  selectedConnector?: string
  connectorName?: string // Add connectorName prop
  autoStartChat?: boolean // Add auto-start chat prop
  onPublishToTemplates?: (item: {
    name: string
    type: string
    githubHandle: string
    version: string
  }) => void
  onOpenHostingDashboard?: () => void
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onMaximize: () => void
  onResize: (size: { width: number; height: number }) => void
  isDarkMode?: boolean // Add isDarkMode prop
}

// Define Message type for clarity
interface Message {
  role: string
  content: string
  showHostingLink?: boolean
  isConnecting?: boolean
  isGenerating?: boolean
}

const FactoryApp = ({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  isActive,
  size,
  sampleData,
  selectedConnector: initialSelectedConnector,
  connectorName, // Destructure connectorName prop
  autoStartChat = false, // Destructure auto-start prop with default value
  onPublishToTemplates,
  onOpenHostingDashboard,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onMaximize,
  onResize,
  isDarkMode, // Destructure isDarkMode prop
}: FactoryAppProps) => {
  console.log("[v0] FactoryApp rendering with props:", {
    id,
    position,
    zIndex,
    isAnimating,
    isMinimized,
    isActive,
    size,
    selectedConnector: initialSelectedConnector,
    connectorName, // Log connectorName
    autoStartChat, // Log autoStartChat
    isDarkMode, // Log isDarkMode
  })

  const [activeTab, setActiveTab] = useState("Files")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  const [leftPaneWidth, setLeftPaneWidth] = useState(152) // reduced from 192px to 152px (40px narrower)
  const [rightPaneWidth, setRightPaneWidth] = useState(288) // w-72 = 288px
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)

  /*
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 200) // Small delay after completion
          return 100
        }
        return prev + Math.random() * 15 + 5 // Random progress increments
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])
  */

  const handleLeftPaneResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingLeft(true)
  }

  const handleRightPaneResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingRight(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.max(150, Math.min(400, e.clientX - position.x))
        setLeftPaneWidth(newWidth)
      }
      if (isResizingRight) {
        const windowWidth = size?.width || 1200
        const newWidth = Math.max(200, Math.min(500, position.x + windowWidth - e.clientX))
        setRightPaneWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizingLeft(false)
      setIsResizingRight(false)
    }

    if (isResizingLeft || isResizingRight) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizingLeft, isResizingRight, position.x, size?.width])

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>(
    autoStartChat
      ? [
          {
            role: "assistant",
            content:
              "Hi! I'm Sloan, your AI assistant. I can help you build connectors, pipelines, and applications. What would you like to create today?",
          },
        ]
      : [],
  )

  const [selectedFile, setSelectedFile] = useState("app/page.tsx")
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["app", "components", "templates"])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownButtonRef = useRef<HTMLButtonElement>(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeChatTab, setActiveChatTab] = useState("chat") // Changed variable name from activeTab to activeChatTab
  const [activeLeftTab, setActiveLeftTab] = useState("code")
  const [showPreview, setShowPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [simulatedFiles, setSimulatedFiles] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [isPipelineConnecting, setIsPipelineConnecting] = useState(false)
  const [pipelineProgress, setPipelineProgress] = useState(0)
  const [showHostingLink, setShowHostingLink] = useState(false)

  const [newConnector, setNewConnector] = useState({
    name: "",
    type: "",
    description: "",
    endpoint: "",
    version: "",
  })

  const [isPublishing, setIsPublishing] = useState(false)
  const [publishProgress, setPublishProgress] = useState(0)

  const [selectedConnector, setSelectedConnector] = useState<string>(
    initialSelectedConnector || connectorName || "Next.js Pipeline",
  ) // Use connectorName if provided

  useEffect(() => {
    if (initialSelectedConnector) {
      setSelectedConnector(initialSelectedConnector)
      console.log("[v0] Factory opened with connector:", initialSelectedConnector)
      setActiveTab("Files") // Ensure Files tab is active
    } else if (connectorName) {
      // Handle connectorName prop
      setSelectedConnector(connectorName)
      console.log("[v0] Factory opened with connectorName:", connectorName)
      setActiveTab("Files") // Ensure Files tab is active
    }
  }, [initialSelectedConnector, connectorName]) // Add connectorName to dependency array

  const sampleJsonData = {
    users: [
      { id: 1, name: "John Doe", email: "john@example.com", created_at: "2024-01-15" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", created_at: "2024-01-16" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", created_at: "2024-01-17" },
    ],
    events: [
      { event_id: "evt_001", user_id: 1, action: "login", timestamp: "2024-01-15T10:30:00Z" },
      { event_id: "evt_002", user_id: 2, action: "purchase", timestamp: "2024-01-16T14:22:00Z" },
      { event_id: "evt_003", user_id: 1, action: "logout", timestamp: "2024-01-15T16:45:00Z" },
    ],
  }

  const fileToConnector: Record<string, string> = {
    "templates/user-facing-analytics.doc": "Supabase Connector",
    "templates/data-warehouse-architecture.doc": "PostgreSQL Connector",
    "app/page.tsx": "Next.js Pipeline",
    "app/layout.tsx": "Next.js Pipeline",
    "app/globals.css": "Next.js Pipeline",
    "components/desktop.tsx": "React Processor",
    "components/taskbar.tsx": "React Processor",
    "components/window-frame.tsx": "React Processor",
    "package.json": "Next.js Pipeline",
    "README.md": "Next.js Pipeline",
    "Data.json": "JSON Data Connector", // Added Data.json file mapping
  }

  const connectors = [
    "Salesforce Connector",
    "PostgreSQL Connector",
    "Redis Connector",
    "Supabase Connector",
    "MongoDB Connector",
    "MySQL Connector",
    "HubSpot Connector",
    "Stripe Connector",
    "AWS S3 Connector",
    "Elasticsearch Connector",
    "Kafka Connector",
    "Snowflake Connector",
  ]

  const userPipelines = [
    {
      id: "user-analytics-pipeline",
      name: "User Analytics Pipeline",
      type: "pipeline",
      description: "Real-time user behavior analytics with ClickHouse",
      version: "2.1.0",
      lastModified: "2024-01-15",
      status: "active",
    },
    {
      id: "payment-processor",
      name: "Stripe Payment Processor",
      type: "connector",
      description: "Secure payment processing with webhook handling",
      version: "1.8.3",
      lastModified: "2024-01-12",
      status: "active",
    },
    {
      id: "email-connector",
      name: "SendGrid Email Connector",
      type: "connector",
      description: "Automated email campaigns and notifications",
      version: "1.5.2",
      lastModified: "2024-01-10",
      status: "draft",
    },
  ]

  const communityImplementations = [
    {
      id: "community-warehouse",
      name: "Advanced Data Warehouse",
      author: "DataEngineering Co.",
      type: "pipeline",
      description: "Multi-source data warehouse with automated ETL processes",
      version: "3.2.1",
      downloads: 1247,
      rating: 4.8,
      tags: ["ETL", "ClickHouse", "Kafka"],
    },
    {
      id: "community-auth",
      name: "OAuth2 Authentication Hub",
      author: "SecureApps Inc.",
      type: "connector",
      description: "Universal OAuth2 connector supporting 15+ providers",
      version: "2.0.4",
      downloads: 892,
      rating: 4.6,
      tags: ["Auth", "OAuth2", "Security"],
    },
    {
      id: "community-ml",
      name: "ML Model Pipeline",
      author: "AIDevs",
      type: "pipeline",
      description: "End-to-end ML pipeline with model versioning and deployment",
      version: "1.9.7",
      downloads: 634,
      rating: 4.9,
      tags: ["ML", "Python", "TensorFlow"],
    },
  ]

  const envVars = [
    { name: "DB_CONNECTION_STRING", value: "postgresql://...", type: "secret" },
    { name: "PUBLIC_API_ENDPOINT", value: "https://api.example.com", type: "public" },
    { name: "PAYMENT_API_KEY", value: "sk_test_...", type: "secret" },
    { name: "CACHE_CONNECTION_URL", value: "redis://localhost:6379", type: "secret" },
  ]

  const embeds = [
    { name: "Analytics Dashboard", type: "iframe", url: "https://analytics.example.com", status: "active" },
    { name: "Stripe Dashboard", type: "widget", url: "https://dashboard.stripe.com", status: "active" },
    { name: "Database Console", type: "iframe", url: "https://console.neon.tech", status: "active" },
  ]

  const tasks = [
    { id: 1, title: "Implement user authentication", status: "in-progress", priority: "high" },
    { id: 2, title: "Add payment processing", status: "todo", priority: "medium" },
    { id: 3, title: "Setup email notifications", status: "completed", priority: "low" },
  ]

  const goals = [
    { id: 1, title: "Launch MVP by Q2", progress: 75, deadline: "2024-06-30" },
    { id: 2, title: "Reach 1000 users", progress: 45, deadline: "2024-08-15" },
    { id: 3, title: "Implement advanced analytics", progress: 20, deadline: "2024-09-30" },
  ]

  const handleSend = () => {
    if (!message.trim()) return

    setMessages((prev) => [
      ...prev,
      { role: "user", content: message },
      {
        role: "assistant",
        content: "generating_connectors", // New step for generating connectors
        isGenerating: true,
      },
    ])
    setMessage("")

    setIsPipelineConnecting(true)
    setPipelineProgress(0)
    setShowHostingLink(false)

    const generationInterval = setInterval(() => {
      setPipelineProgress((prev) => {
        if (prev >= 100) {
          clearInterval(generationInterval)

          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            {
              role: "assistant",
              content: "pipeline_connecting",
              isConnecting: true,
            },
          ])

          setPipelineProgress(0)

          const connectionInterval = setInterval(() => {
            setPipelineProgress((prev) => {
              if (prev >= 100) {
                clearInterval(connectionInterval)
                setIsPipelineConnecting(false)
                setMessages((prevMessages) => [
                  ...prevMessages.slice(0, -1),
                  {
                    role: "assistant",
                    content: "Pipeline connected successfully! Your data has been synced from your source.",
                  },
                  {
                    role: "assistant",
                    content:
                      "Do you need help with the next step? You can import this to hosting to deploy your application.",
                    showHostingLink: true,
                  },
                ])
                setShowHostingLink(true)
                return 100
              }
              return prev + Math.random() * 8 + 3 // Slower progress for connection
            })
          }, 200) // Slower interval for connection phase

          return 100
        }
        return prev + Math.random() * 12 + 4 // Slower progress for generation
      })
    }, 180) // Slower interval for generation phase
  }

  const simulateCodeGeneration = () => {
    setIsGenerating(true)
    setGeneratedCode("")
    setSimulatedFiles([])
    setCurrentLine(0)

    const codeSnippets = [
      "import React from 'react'",
      "import { useState, useEffect } from 'react'",
      "",
      "export default function Component() {",
      "  const [data, setData] = useState(null)",
      "  const [loading, setLoading] = useState(true)",
      "",
      "  useEffect(() => {",
      "    fetchData()",
      "  }, [])",
      "",
      "  const fetchData = async () => {",
      "    try {",
      "      const response = await fetch('/api/data')",
      "      const result = await response.json()",
      "      setData(result)",
      "    } catch (error) {",
      "      console.error('Error:', error)",
      "    } finally {",
      "      setLoading(false)",
      "    }",
      "  }",
      "",
      "  if (loading) return <div>Loading...</div>",
      "",
      "  return (",
      '    <div className="container">',
      "      <h1>Generated Component</h1>",
      "      {data && (",
      '        <div className="data-display">',
      "          {JSON.stringify(data, null, 2)}",
      "        </div>",
      "      )}",
      "    </div>",
      "  )",
      "}",
    ]

    const filesToCreate = [
      "components/generated-component.tsx",
      "api/data.ts",
      "types/index.ts",
      "utils/helpers.ts",
      "styles/component.css",
      "tests/component.test.tsx",
    ]

    let lineIndex = 0
    let fileIndex = 0

    const typeCode = () => {
      if (lineIndex < codeSnippets.length) {
        setGeneratedCode((prev) => prev + codeSnippets[lineIndex] + "\n")
        setCurrentLine(lineIndex + 1)
        lineIndex++

        if (lineIndex % 6 === 0 && fileIndex < filesToCreate.length) {
          setSimulatedFiles((prev) => [...prev, filesToCreate[fileIndex]])
          fileIndex++
        }

        setTimeout(typeCode, Math.random() * 150 + 50)
      } else {
        // Add any remaining files
        while (fileIndex < filesToCreate.length) {
          setSimulatedFiles((prev) => [...prev, filesToCreate[fileIndex]])
          fileIndex++
        }
        setIsGenerating(false)

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Code generation complete! I've created your component with proper TypeScript types and API integration.",
            },
          ])
        }, 500)
      }
    }

    setTimeout(typeCode, 1000)
  }

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => (prev.includes(folder) ? prev.filter((f) => f !== folder) : [...prev, folder]))
  }

  const copyToClipboard = (text: string, buttonId?: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (buttonId) {
          setCopiedStates((prev) => ({ ...prev, [buttonId]: true }))
          setTimeout(() => {
            setCopiedStates((prev) => ({ ...prev, [buttonId]: false }))
          }, 2000)
        }
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  const handleCreateConnector = () => {
    console.log("Creating new connector:", newConnector)
    setNewConnector({
      name: "",
      type: "",
      description: "",
      endpoint: "",
      version: "",
    })
    setShowCreateModal(false)
  }

  const handleFileClick = (filePath: string) => {
    setSelectedFile(filePath)
    const connector = fileToConnector[filePath]
    if (connector) {
      setSelectedConnector(connector)
    }

    if (filePath === "templates/user-facing-analytics.doc") {
      // This would need to be passed up to desktop to open the analytics template
      console.log("Opening analytics template document")
    }
  }

  const fileTree = [
    {
      type: "folder",
      name: "app",
      path: "app",
      children: [
        { type: "file", name: "page.tsx", path: "app/page.tsx" },
        { type: "file", name: "layout.tsx", path: "app/layout.tsx" },
        { type: "file", name: "globals.css", path: "app/globals.css" },
      ],
    },
    {
      type: "folder",
      name: "components",
      path: "components",
      children: [
        { type: "file", name: "desktop.tsx", path: "components/desktop.tsx" },
        { type: "file", name: "taskbar.tsx", path: "components/taskbar.tsx" },
        { type: "file", name: "window-frame.tsx", path: "components/window-frame.tsx" },
      ],
    },
    {
      type: "folder",
      name: "templates",
      path: "templates",
      children: [
        {
          type: "file",
          name: "User Facing Analytics.doc",
          path: "templates/user-facing-analytics.doc",
          icon: "/icons/analytics.png",
        },
        {
          type: "file",
          name: "Data Warehouse Architecture.doc",
          path: "templates/data-warehouse-architecture.doc",
          icon: "/icons/bar-graph.png",
        },
      ],
    },
    { type: "file", name: "package.json", path: "package.json" },
    { type: "file", name: "README.md", path: "README.md" },
  ]

  const getFileContent = (filePath: string) => {
    const contents: Record<string, string> = {
      "app/page.tsx": `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-neutral-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-neutral-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
      </div>
    </main>
  )
}`,
      "components/desktop.tsx": `"use client"

import { useState } from "react"
import { DesktopIcon } from "./desktop-icon"

export function Desktop() {
  const [icons] = useState([
    { id: "my-computer", name: "My Computer", x: 20, y: 20 },
    { id: "recycle-bin", name: "Recycle Bin", x: 20, y: 120 },
  ])

  return (
    <div className="absolute inset-0 bg-teal-500">
      {icons.map((icon) => (
        <DesktopIcon key={icon.id} {...icon} />
      ))}
    </div>
  )
}`,
      "templates/user-facing-analytics.doc": `User Facing Analytics Template

This document outlines the framework for implementing user-facing analytics dashboards that provide actionable insights to end users.

Key Components:
- Real-time data visualization
- Interactive filtering and drill-down capabilities
- Customizable dashboard layouts
- Export functionality for reports
- Mobile-responsive design

Implementation Guidelines:
1. Define key performance indicators (KPIs)
2. Design intuitive user interfaces
3. Implement efficient data queries
4. Ensure data accuracy and freshness
5. Provide contextual help and documentation

Best Practices:
- Use clear, meaningful visualizations
- Minimize cognitive load
- Provide progressive disclosure
- Implement proper access controls
- Monitor usage patterns and optimize accordingly`,
      "templates/data-warehouse-architecture.doc": `Operational Data Warehouse

The odw project is a starter kit for an operational data warehouse, using the Moose framework to ingest data from various sources (Blobs, Events, Logs) into an analytical backend (ClickHouse).

ODW Stack:

Backend & Data:
Framework: Moose (Python)
Data Platform: ClickHouse (Warehouse) | RedPanda (Streaming)
Ingestion: Moose connectors for Blobs, Events, and Logs
Frontend: Streamlit

Architecture Overview:
- Data ingestion layer using Moose framework
- Real-time streaming with RedPanda
- Analytical storage with ClickHouse
- Analytical storage with ClickHouse
- Interactive frontend with Streamlit

Core Components:
1. Moose Framework Integration
   - Python-based data processing
   - Built-in connectors for various data sources
   - Automated schema management

2. ClickHouse Warehouse
   - Columnar storage for analytics
   - High-performance queries
   - Real-time data ingestion

3. RedPanda Streaming
   - Kafka-compatible streaming platform
   - Low-latency data processing
   - Scalable event streaming

4. Data Source Connectors
   - Blob storage integration
   - Event stream processing
   - Log aggregation and parsing

5. Streamlit Frontend
   - Interactive dashboards
   - Real-time visualizations
   - Self-service analytics

Implementation Guide:
1. Set up Moose framework environment
2. Configure ClickHouse warehouse
3. Deploy RedPanda streaming layer
4. Connect data sources (Blobs, Events, Logs)
5. Build Streamlit analytics interface
6. Monitor and optimize performance`,
    }
    return contents[filePath] || "// File content not available"
  }

  const handleOpenInFactory = (item: any) => {
    console.log("[v0] Opening in Factory:", item.name)
    console.log("[v0] Current activeTab before switch:", activeTab)
    setActiveTab("Files")
    console.log("[v0] Switched to Files tab")
    // Load the item's code into the editor (this would be the implementation)
    // For now, we'll just switch to the Files tab where users can see the code editor
  }

  const handleCopyImplementation = (item: any) => {
    console.log("Copying implementation:", item.name)
    // This would copy the implementation to user's library
  }

  const renderCodeBlock = (code: string, title: string) => (
    <div
      className="border border-neutral-400 relative flex flex-col h-full"
      style={{
        backgroundColor: "#c0c0c0",
        borderTopColor: "#808080",
        borderLeftColor: "#808080",
        borderRightColor: "#dfdfdf",
        borderBottomColor: "#dfdfdf",
      }}
    >
      <div className="flex items-center justify-between bg-neutral-100 border-b border-neutral-300 px-3 py-1 flex-shrink-0">
        <span className="text-xs font-semibold text-black">{title}</span>
        <button
          onClick={() => copyToClipboard(code, `code-${title}`)}
          className="px-2 py-1 text-xs border text-black hover:bg-neutral-300"
          style={{
            backgroundColor: "#c0c0c0",
            borderTopColor: "#dfdfdf",
            borderLeftColor: "#dfdfdf",
            borderRightColor: "#808080",
            borderBottomColor: "#808080",
          }}
          title="Copy to clipboard"
        >
          {copiedStates[`code-${title}`] ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre
        className="text-black p-0 font-mono text-xs overflow-auto whitespace-pre-wrap break-words relative flex-1"
        style={{ backgroundColor: "#c0c0c0" }}
      >
        <div className="flex h-full">
          <div className="bg-neutral-100 border-r border-neutral-300 px-2 py-3 text-neutral-600 select-none min-w-[2rem] text-right">
            {code.split("\n").map((_, i) => (
              <div key={i} className="leading-4">
                {i + 1}
              </div>
            ))}
          </div>
          <div className="flex-1 px-3 py-3">
            <code className="text-black leading-4">
              {code.split("\n").map((line, i) => (
                <div key={i} className="leading-4">
                  {line.replace(/\t/g, "    ") || " "}
                </div>
              ))}
            </code>
          </div>
        </div>
      </pre>
    </div>
  )

  const renderLibraryContent = () => (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-black mb-3">My Pipelines & Connectors</h3>
      {userPipelines.map((item) => (
        <div
          key={item.id}
          className="border border-neutral-400 p-3 hover:bg-neutral-50"
          style={{
            backgroundColor: "#c0c0c0",
            borderTopColor: "#808080",
            borderLeftColor: "#808080",
            borderRightColor: "#dfdfdf",
            borderBottomColor: "#dfdfdf",
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-xs font-semibold text-black">{item.name}</h4>
              <p className="text-xs text-neutral-600 capitalize">
                {item.type} • v{item.version}
              </p>
            </div>
            <div className="flex gap-1">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  item.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
          <p className="text-xs text-black mb-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">Modified: {item.lastModified}</span>
            <div className="flex gap-1">
              <button
                onClick={() => handleOpenInFactory(item)}
                className="px-3 py-1 text-xs border text-black hover:bg-neutral-300 font-semibold whitespace-nowrap"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                Open in Factory
              </button>
              <button
                className="px-3 py-1 text-xs border text-black hover:bg-neutral-300 whitespace-nowrap"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                Deploy
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderCommunityContent = () => (
    <div className="p-4 space-y-4 bg-win95-window">
      <h3 className="text-sm font-semibold text-black mb-3">Community Implementations</h3>
      {communityImplementations.map((item) => (
        <div
          key={item.id}
          className="border border-neutral-400 p-3 hover:bg-neutral-50"
          style={{
            backgroundColor: "#c0c0c0",
            borderTopColor: "#808080",
            borderLeftColor: "#808080",
            borderRightColor: "#dfdfdf",
            borderBottomColor: "#dfdfdf",
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-xs font-semibold text-black">{item.name}</h4>
              <p className="text-xs text-neutral-600">
                by {item.author} • v{item.version}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">★ {item.rating}</span>
              <span className="text-xs text-neutral-500">{item.downloads} downloads</span>
            </div>
          </div>
          <p className="text-xs text-black mb-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {item.tags.map((tag) => (
                <span key={tag} className="text-xs px-1 py-0.5 bg-neutral-200 text-neutral-700 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleOpenInFactory(item)}
                className="px-3 py-1 text-xs border text-black hover:bg-neutral-300 font-semibold whitespace-nowrap"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                Open in Factory
              </button>
              <button
                onClick={() => handleCopyImplementation(item)}
                className="px-3 py-1 text-xs border text-black hover:bg-neutral-300 whitespace-nowrap"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                {copiedStates[`community-${item.id}`] ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderEnvVars = () => (
    <div className="p-2 space-y-2 bg-neutral-200 h-full">
      <h4 className="text-xs font-semibold text-black mb-2">Environment Variables</h4>
      <div className="border border-neutral-400 shadow-inner p-2 space-y-2" style={{ backgroundColor: "#c0c0c0" }}>
        {envVars.map((env, index) => (
          <div key={index} className="border border-neutral-300 p-2 bg-neutral-50 text-xs">
            <div className="flex items-center justify-between mb-1 gap-2">
              <span className="font-semibold text-black truncate flex-1 min-w-0">{env.name}</span>
              <span
                className={`px-1 py-0.5 rounded text-xs flex-shrink-0 ${
                  env.type === "secret" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}
              >
                {env.type}
              </span>
            </div>
            <div className="text-neutral-600 break-all text-xs">{env.value}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderEmbeds = () => (
    <div className="p-2 bg-neutral-200 h-full">
      <h4 className="text-xs font-semibold text-black mb-2">Embedded Components</h4>
      <div className="border border-neutral-400 shadow-inner" style={{ backgroundColor: "#c0c0c0" }}>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-neutral-300">
              <TableHead className="text-xs font-semibold text-black px-3 py-2">Component</TableHead>
              <TableHead className="text-xs font-semibold text-black px-3 py-2">Type</TableHead>
              <TableHead className="text-xs font-semibold text-black px-3 py-2">Status</TableHead>
              <TableHead className="text-xs font-semibold text-black px-3 py-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {embeds.map((embed, index) => (
              <TableRow key={index} className="border-b border-neutral-200 hover:bg-neutral-50">
                <TableCell className="px-3 py-2 text-xs text-black font-mono">{embed.name}</TableCell>
                <TableCell className="px-3 py-2 text-xs text-neutral-600">{embed.type}</TableCell>
                <TableCell className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      embed.status === "active" ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {embed.status}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-2 text-right">
                  <div className="flex gap-1 justify-end">
                    <button
                      className="px-2 py-1 text-xs border text-black hover:bg-neutral-300 whitespace-nowrap"
                      style={{
                        backgroundColor: "#c0c0c0",
                        borderTopColor: "#dfdfdf",
                        borderLeftColor: "#dfdfdf",
                        borderRightColor: "#808080",
                        borderBottomColor: "#808080",
                      }}
                    >
                      Configure
                    </button>
                    <button
                      className="px-2 py-1 text-xs border text-black hover:bg-neutral-300 whitespace-nowrap"
                      style={{
                        backgroundColor: "#c0c0c0",
                        borderTopColor: "#dfdfdf",
                        borderLeftColor: "#dfdfdf",
                        borderRightColor: "#808080",
                        borderBottomColor: "#808080",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  const renderChat = () => (
    <div className="space-y-0">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
          <div className={`max-w-sm px-3 py-2 text-xs ${msg.role === "user" ? "text-black" : "text-black"}`}>
            {msg.content === "pipeline_connecting" && msg.isConnecting && (
              <div className="bg-gray-200 border border-gray-400 p-3 rounded mb-2">
                <div className="text-sm mb-2">Connecting to your data source...</div>
                <div
                  className="w-full border border-gray-400 h-4 overflow-hidden"
                  style={{ backgroundColor: "#c0c0c0" }}
                >
                  <div
                    className="bg-win95-titlebar h-full transition-all duration-200"
                    style={{ width: `${pipelineProgress}%` }}
                  />
                </div>
              </div>
            )}
            {msg.content === "generating_connectors" && msg.isGenerating && (
              <div className="bg-gray-200 border border-gray-400 p-3 rounded mb-2">
                <div className="text-sm mb-2">Generating connectors and code...</div>
                <div
                  className="w-full border border-gray-400 h-4 overflow-hidden"
                  style={{ backgroundColor: "#c0c0c0" }}
                >
                  <div
                    className="bg-win95-titlebar h-full transition-all duration-200"
                    style={{ width: `${pipelineProgress}%` }}
                  />
                </div>
              </div>
            )}
            {msg.content !== "pipeline_connecting" && msg.content !== "generating_connectors" && (
              <>
                {msg.content}
                {msg.showHostingLink && (
                  <div className="mt-2">
                    <button
                      onClick={onOpenHostingDashboard}
                      className="win95-blue-link text-xs hover:text-blue-800"
                    >
                      {"Deploy"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const renderTasks = () => (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-black mb-2">Active Tasks</h4>
      {tasks.map((task) => (
        <div key={task.id} className="border border-neutral-400 p-2 text-xs" style={{ backgroundColor: "#c0c0c0" }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-black">{task.title}</span>
            <span
              className={`px-1 py-0.5 rounded text-xs ${
                task.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : task.status === "in-progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-neutral-100 text-neutral-800"
              }`}
            >
              {task.status}
            </span>
          </div>
          <span
            className={`text-xs ${
              task.priority === "high"
                ? "text-red-600"
                : task.priority === "medium"
                  ? "text-yellow-600"
                  : "text-green-600"
            }`}
          >
            {task.priority} priority
          </span>
        </div>
      ))}
    </div>
  )

  const renderGoals = () => (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-black mb-2">Project Goals</h4>
      {goals.map((goal) => (
        <div key={goal.id} className="border border-neutral-400 p-2 text-xs" style={{ backgroundColor: "#c0c0c0" }}>
          <div className="font-semibold text-black mb-1">{goal.title}</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ backgroundColor: "#c0c0c0" }}>
              <div className="bg-win95-titlebar h-2 rounded-full" style={{ width: `${goal.progress}%` }} />
            </div>
            <span className="text-neutral-600">{goal.progress}%</span>
          </div>
          <div className="text-neutral-600">Due: {goal.deadline}</div>
        </div>
      ))}
    </div>
  )

  const renderLibraryTable = () => {
    const myPipelines = [
      { name: "Customer Analytics Pipeline", type: "Analytics", status: "Active", lastModified: "2 hours ago" },
      { name: "Sales Data ETL", type: "ETL", status: "Active", lastModified: "1 day ago" },
      { name: "Real-time Events Stream", type: "Streaming", status: "Active", lastModified: "3 days ago" },
      { name: "ML Feature Pipeline", type: "ML", status: "Draft", lastModified: "1 week ago" },
    ]

    const myConnectors = [
      { name: "Custom Salesforce Connector", type: "CRM", status: "Active", lastModified: "5 hours ago" },
      { name: "Internal API Connector", type: "API", status: "Active", lastModified: "2 days ago" },
      { name: "Legacy Database Connector", type: "Database", status: "Active", lastModified: "1 week ago" },
    ]

    return (
      <div className="space-y-6 bg-win95-window">
        <div className="bg-win95-window">
          <h3 className="text-sm font-bold text-black ml-1.5 mb-2 mt-0 py-1.5">My Pipelines</h3>
          <div
            className="bg-white border border-neutral-400 px-0 mx-1.5"
            style={{
              backgroundColor: "white",
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
              boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-neutral-400">
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-2/5">
                    Name
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Type
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Status
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Modified
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myPipelines.map((item, index) => (
                  <tr key={index} className="border-b border-neutral-300 hover:bg-neutral-50">
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.name}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.type}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.status}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.lastModified}</td>
                    <td className="px-3 py-2 text-black text-sm">
                      <div className="flex gap-1 whitespace-nowrap min-w-[140px]">
                        <button
                          className="px-3 py-1 text-xs border text-black hover:bg-neutral-300 whitespace-nowrap"
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
                          className="px-3 py-1 text-xs border text-black hover:bg-neutral-300 whitespace-nowrap"
                          style={{
                            backgroundColor: "#c0c0c0",
                            borderTopColor: "#dfdfdf",
                            borderLeftColor: "#dfdfdf",
                            borderRightColor: "#808080",
                            borderBottomColor: "#808080",
                          }}
                        >
                          Deploy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-black ml-1.5 mb-1.5">My Connectors</h3>
          <div
            className="bg-white border border-neutral-400 mx-1.5"
            style={{
              backgroundColor: "white",
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
              boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-neutral-400">
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-2/5">
                    Name
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Type
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Status
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Modified
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myConnectors.map((item, index) => (
                  <tr key={index} className="border-b border-neutral-300 hover:bg-neutral-50">
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.name}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.type}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.status}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.lastModified}</td>
                    <td className="px-3 py-2 text-black text-sm">
                      <div className="flex gap-1 whitespace-nowrap min-w-[140px]">
                        <button
                          className="px-3 py-1 text-xs border text-black hover:bg-neutral-300 whitespace-nowrap"
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
                          className="px-3 py-1 text-xs border text-black hover:bg-neutral-300 whitespace-nowrap"
                          style={{
                            backgroundColor: "#c0c0c0",
                            borderTopColor: "#dfdfdf",
                            borderLeftColor: "#dfdfdf",
                            borderRightColor: "#808080",
                            borderBottomColor: "#808080",
                          }}
                        >
                          Deploy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderCommunityTable = () => {
    const communityPipelines = [
      { name: "E-commerce Analytics", author: "DataTeam", type: "Analytics", downloads: "1.2k", rating: "4.8" },
      { name: "Social Media ETL", author: "DevCorp", type: "ETL", downloads: "856", rating: "4.6" },
      { name: "IoT Data Stream", author: "TechLabs", type: "Streaming", downloads: "2.1k", rating: "4.9" },
      { name: "Financial ML Pipeline", author: "FinTech", type: "ML", downloads: "743", rating: "4.7" },
    ]

    const communityConnectors = [
      { name: "Advanced Shopify Connector", author: "EcomDev", type: "E-commerce", downloads: "3.2k", rating: "4.9" },
      { name: "Twitter API v2 Connector", author: "SocialData", type: "Social", downloads: "1.8k", rating: "4.5" },
      { name: "Stripe Webhooks Connector", author: "PaymentPro", type: "Payment", downloads: "2.7k", rating: "4.8" },
    ]

    return (
      <div className="space-y-6 bg-win95-window">
        <div className="bg-win95-window">
          <h3 className="text-sm font-bold text-black ml-1.5 mb-2 mt-0 py-1.5">Community Pipelines</h3>
          <div
            className="bg-white border border-neutral-400 px-0 mx-1.5"
            style={{
              backgroundColor: "white",
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
              boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-neutral-400">
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-2/5">
                    Name
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Author
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Type
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Downloads
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {communityPipelines.map((item, index) => (
                  <tr key={index} className="border-b border-neutral-300 hover:bg-neutral-50">
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.name}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.author}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.type}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.downloads}</td>
                    <td className="px-3 py-2 text-black text-sm">
                      <div className="flex gap-1">
                        <button
                          className="px-2 py-1 text-xs border text-black hover:bg-neutral-300"
                          style={{
                            backgroundColor: "#c0c0c0",
                            borderTopColor: "#dfdfdf",
                            borderLeftColor: "#dfdfdf",
                            borderRightColor: "#808080",
                            borderBottomColor: "#808080",
                          }}
                        >
                          Open
                        </button>
                        <button
                          className="px-2 py-1 text-xs border text-black hover:bg-neutral-300"
                          style={{
                            backgroundColor: "#c0c0c0",
                            borderTopColor: "#dfdfdf",
                            borderLeftColor: "#dfdfdf",
                            borderRightColor: "#808080",
                            borderBottomColor: "#808080",
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-win95-window">
          <h3 className="text-sm font-bold text-black ml-1.5 mb-2 mt-0 py-1.5">Community Connectors</h3>
          <div
            className="bg-white border border-neutral-400 px-0 mx-1.5"
            style={{
              backgroundColor: "white",
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
              boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-neutral-400">
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-2/5">
                    Name
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Author
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Type
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm border-r border-neutral-400 w-1/5">
                    Downloads
                  </th>
                  <th className="text-left px-3 py-2 text-black font-bold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {communityConnectors.map((item, index) => (
                  <tr key={index} className="border-b border-neutral-300 hover:bg-neutral-50">
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.name}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.author}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.type}</td>
                    <td className="px-3 py-2 text-black text-sm border-r border-neutral-300">{item.downloads}</td>
                    <td className="px-3 py-2 text-black text-sm">
                      <div className="flex gap-1">
                        <button
                          className="px-2 py-1 text-xs border text-black hover:bg-neutral-300"
                          style={{
                            backgroundColor: "#c0c0c0",
                            borderTopColor: "#dfdfdf",
                            borderLeftColor: "#dfdfdf",
                            borderRightColor: "#808080",
                            borderBottomColor: "#808080",
                          }}
                        >
                          Open
                        </button>
                        <button
                          className="px-2 py-1 text-xs border text-black hover:bg-neutral-300"
                          style={{
                            backgroundColor: "#c0c0c0",
                            borderTopColor: "#dfdfdf",
                            borderLeftColor: "#dfdfdf",
                            borderRightColor: "#808080",
                            borderBottomColor: "#808080",
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const codeFiles = [
    { name: "Button.tsx", path: "src/components/Button.tsx" },
    { name: "Modal.tsx", path: "src/components/Modal.tsx" },
    { name: "index.tsx", path: "src/pages/index.tsx" },
    { name: "package.json", path: "package.json" },
  ]

  const renderCodeFiles = () => (
    <div className="h-full">
      <div className="space-y-1">
        {codeFiles.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-1 hover:bg-neutral-100 cursor-pointer text-xs"
            onClick={() => setSelectedFile(file.path)}
          >
            <span className="font-mono text-black">{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCodePanel = () => {
    const currentCode = isGenerating
      ? generatedCode
      : codeFiles.find((f) => f.path === selectedFile)?.content || "// File content not available"

    return (
      <div className="h-full flex flex-col">
        <div className="border-b border-neutral-400 px-2 py-1 bg-win95-window flex items-center justify-between">
          <span className="text-xs font-semibold text-black">
            {isGenerating ? "🔄 Generating..." : selectedFile || "No file selected"}
          </span>
          {isGenerating && <span className="text-xs text-green-600">Line {currentLine}</span>}
        </div>
        <div
          className="flex-1 p-2 font-mono text-xs overflow-auto text-black"
          style={{
            backgroundColor: "#c0c0c0",
            whiteSpace: "pre-wrap",
            fontFamily: "Courier New, monospace",
          }}
        >
          {currentCode}
          {isGenerating && <span className="animate-pulse">|</span>}
        </div>
      </div>
    )
  }

  const renderFileTree = () => {
    const enhancedFileTree = [...fileTree]

    // Add simulated files during generation
    if (simulatedFiles.length > 0) {
      simulatedFiles.forEach((filePath) => {
        const pathParts = filePath.split("/")
        const fileName = pathParts[pathParts.length - 1]
        const folderPath = pathParts.slice(0, -1).join("/")

        // Find or create the folder structure
        let targetFolder = enhancedFileTree.find((item) => item.path === folderPath)
        if (!targetFolder && folderPath) {
          targetFolder = {
            type: "folder",
            name: folderPath,
            path: folderPath,
            children: [],
          }
          enhancedFileTree.push(targetFolder)
        }

        const newFile = {
          type: "file" as const,
          name: fileName,
          path: filePath,
          isNew: true,
        }

        if (targetFolder && targetFolder.children) {
          const exists = targetFolder.children.some((child) => child.path === filePath)
          if (!exists) {
            targetFolder.children.push(newFile)
          }
        } else if (!folderPath) {
          const exists = enhancedFileTree.some((item) => item.path === filePath)
          if (!exists) {
            enhancedFileTree.push(newFile)
          }
        }
      })
    }

    const renderTreeItem = (item: any, depth = 0) => (
      <div key={item.path}>
        <div
          className={`flex items-center gap-1 p-1 hover:bg-neutral-100 cursor-pointer text-xs ${
            selectedFile === item.path ? "bg-blue-100" : ""
          }`}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
          onClick={() => {
            if (item.type === "folder") {
              setExpandedFolders((prev) =>
                prev.includes(item.path) ? prev.filter((p) => p !== item.path) : [...prev, item.path],
              )
            } else {
              handleFileClick(item.path)
            }
          }}
        >
          {item.type === "folder" ? (
            <>
              <span>{expandedFolders.includes(item.path) ? "[+]" : "[-]"}</span>
              <span className="text-black">{item.name}</span>
            </>
          ) : (
            <>
              <span className="text-blue-600">•</span>
              <span
                className={`font-mono text-black ${item.isNew ? "text-green-600 font-semibold animate-pulse" : ""}`}
              >
                {item.name}
                {item.isNew && <span className="ml-1 text-xs bg-green-200 px-1 rounded">[NEW]</span>}
              </span>
            </>
          )}
        </div>
        {item.type === "folder" &&
          expandedFolders.includes(item.path) &&
          item.children?.map((child: any) => renderTreeItem(child, depth + 1))}
      </div>
    )

    return <div className="h-full overflow-auto">{enhancedFileTree.map((item) => renderTreeItem(item))}</div>
  }

  // const handlePrevious = () => {
  //   console.log("Previous")
  // }

  const handleNext = () => {
    console.log("Next")
  }

  const handleOpenInCursor = () => {
    console.log("Open in Cursor")
  }

  const handleDownloadFromGithub = () => {
    console.log("Download from Github")
  }

  const handleOpenHostingDashboard = () => {
    if (onOpenHostingDashboard) {
      onOpenHostingDashboard()
    }
  }

  const handlePublish = async () => {
    if (!selectedConnector || !onPublishToTemplates) return

    setIsPublishing(true)
    setPublishProgress(0)

    // Simulate publishing progress
    const progressInterval = setInterval(() => {
      setPublishProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            if (onPublishToTemplates) {
              onPublishToTemplates({
                name: selectedConnector,
                type: "connector",
                githubHandle: "user",
                version: "1.0.0",
              })
            }
            setIsPublishing(false)

            window.dispatchEvent(new CustomEvent("openTemplates"))
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <>
      <WindowFrame
        id={id}
        title="Factory - AI Connectors & Pipelines"
        icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/joystick-5-H1wCm7w4c5UZkbxLPs6lyLl7H22IzO.png"
        position={position}
        size={size}
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
        resizable={true}
      >
        {/* {isLoading && (
          <SplashScreen
            title="Factory"
            version="2.0"
            description="Initializing Factory environment..."
            copyright="© 514 all rights reserved 2025"
            company="Industrial Systems Division"
            progress={loadingProgress}
          />
        )} */}

        {!isLoading && (
          <div className="flex flex-col h-full p-4 pt-0 bg-transparent-foreground pl-1 pr-1 pb-0">
            {/* Menu Bar */}
            <Win95MenuBar
              items={[
                {
                  label: "File",
                  items: [
                    { label: "New Project", onClick: () => {} },
                    { label: "Open Project", onClick: () => {}, shortcut: "Ctrl+O" },
                    { type: "separator" },
                    { label: "Save", onClick: () => {}, shortcut: "Ctrl+S" },
                    { label: "Save As...", onClick: () => {} },
                    { type: "separator" },
                    { label: "Export", onClick: () => {} },
                    { type: "separator" },
                    { label: "Exit", onClick: () => {} },
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
                    { label: "Find...", onClick: () => {}, shortcut: "Ctrl+F" },
                  ],
                },
                {
                  label: "View",
                  items: [
                    { label: "Editor", onClick: () => setActiveTab("Files") },
                    { label: "Library", onClick: () => setActiveTab("Library") },
                    { label: "Community", onClick: () => setActiveTab("Community") },
                    { label: "Create", onClick: () => setActiveTab("Create") },
                    { type: "separator" },
                    { label: "Refresh", onClick: () => {}, shortcut: "F5" },
                  ],
                },
                {
                  label: "Tools",
                  items: [
                    { label: "Clear Pipeline", onClick: () => {} },
                    { label: "Settings", onClick: () => {} },
                    { type: "separator" },
                    { label: "Publish", onClick: handlePublish },
                    { label: "Validate", onClick: () => {} },
                  ],
                },
                {
                  label: "Help",
                  items: [
                    { label: "Factory Help", onClick: () => {} },
                    { label: "Keyboard Shortcuts", onClick: () => {} },
                    { type: "separator" },
                    { label: "About Factory", onClick: () => {} },
                  ],
                },
              ]}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden px-1">
              <div
                className="flex h-full overflow-hidden"
                style={{
                  border: "2px solid",
                  borderTopColor: "#555",
                  borderLeftColor: "#555",
                  borderRightColor: "#dfdfdf",
                  borderBottomColor: "#dfdfdf",
                  boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)",
                  backgroundColor: "white",
                }}
              >
                <div className="flex flex-1 overflow-hidden">
                  {activeTab === "Files" && (
                    <>
                      <div
                        className="border-r border-neutral-400 flex flex-col h-full"
                        style={{
                          width: `${leftPaneWidth}px`,
                          backgroundColor: "white",
                          boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.3)",
                          borderTopColor: "#808080",
                          borderLeftColor: "#808080",
                          borderRightColor: "#dfdfdf",
                          borderBottomColor: "#dfdfdf",
                        }}
                      >
                        <div className="p-2 border-b bg-transparent border-transparent px-0 py-0">
                          <div className="flex">
                            <button
                              onClick={() => setActiveLeftTab("code")}
                              className="px-2 py-1 text-xs hover:bg-neutral-300 text-black whitespace-nowrap w-full border-0"
                              style={{
                                backgroundColor: activeLeftTab === "code" ? "#a0a0a0" : "#c0c0c0",
                                minWidth: "60px",
                                border: "none",
                                outline: "none",
                                boxShadow: "none",
                              }}
                            >
                              Code
                            </button>
                            <button
                              onClick={() => setActiveLeftTab("env vars")}
                              className="px-2 py-1 text-xs hover:bg-neutral-300 text-black whitespace-nowrap w-full border-0"
                              style={{
                                backgroundColor: activeLeftTab === "env vars" ? "#a0a0a0" : "#c0c0c0",
                                minWidth: "70px",
                                border: "none",
                                outline: "none",
                                boxShadow: "none",
                              }}
                            >
                              EnvVars
                            </button>
                          </div>
                          <div className="flex-1 overflow-auto p-1">
                            {activeLeftTab === "code"
                              ? renderCodeFiles()
                              : activeLeftTab === "env vars"
                                ? renderEnvVars()
                                : renderEmbeds()}
                          </div>
                        </div>
                      </div>

                      <div
                        className="w-1 bg-gray-400 cursor-col-resize hover:bg-gray-500 flex-shrink-0"
                        onMouseDown={handleLeftPaneResize}
                        style={{
                          borderLeft: "1px solid #808080",
                          borderRight: "1px solid #dfdfdf",
                        }}
                      />

                      <div
                        className="flex-1 border-r border-neutral-400 flex flex-col"
                        style={{
                          backgroundColor: "white",
                          boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.3)",
                          borderTopColor: "#808080",
                          borderLeftColor: "#808080",
                          borderRightColor: "#dfdfdf",
                          borderBottomColor: "#dfdfdf",
                        }}
                      >
                        {showPreview && selectedFile === "app/page.tsx" ? (
                          <div className="flex-1 p-4 overflow-auto bg-black text-green-400 font-mono text-xs">
                            <div className="whitespace-pre-wrap">
                              {`Factory Console Output - Connector Pipeline Logs
================================================

[2024-12-19 14:32:15] Initializing connector pipeline...
[2024-12-19 14:32:16] Loading configuration from app/page.tsx
[2024-12-19 14:32:16] Detected connector type: Data Warehouse Pipeline
[2024-12-19 14:32:17] Establishing connection to ClickHouse warehouse...
[2024-12-19 14:32:18] ✓ Connection established (latency: 23ms)

Pipeline Configuration:
-----------------------
Name: ${newConnector.name || "Untitled Connector"}
Type: ${newConnector.type || "Data Pipeline"}
Endpoint: ${newConnector.endpoint || "localhost:8123"}
Description: ${newConnector.description || "Factory-generated connector"}

Data Flow Analysis:
------------------
[2024-12-19 14:32:19] Analyzing data sources...
[2024-12-19 14:32:20] • Blob storage: CONFIGURED
[2024-12-19 14:32:20] • Event streams: CONFIGURED
[2024-12-19 14:32:21] • Log ingestion: CONFIGURED
[2024-12-19 14:32:22] Schema validation: PASSED
[2024-12-19 14:32:23] Access controls: ENABLED

Moose Framework Status:
----------------------
[2024-12-19 14:32:24] Framework version: 2.1.4
[2024-12-19 14:32:24] Python runtime: 3.11.7
[2024-12-19 14:32:25] RedPanda streaming: ACTIVE
[2024-12-19 14:32:26] ClickHouse warehouse: READY
[2024-12-19 14:32:27] Streamlit frontend: DEPLOYED

Performance Metrics:
-------------------
Ingestion rate: 1,247 events/sec
Query latency: avg 45ms, p95 120ms
Storage utilization: 23.4GB (12% of allocated)
Active connections: 8/100

[2024-12-19 14:32:28] ✓ Pipeline initialization complete
[2024-12-19 14:32:29] Ready for data ingestion
[2024-12-19 14:32:30] Monitoring dashboard available at /analytics

System Status: OPERATIONAL
Last updated: ${new Date().toLocaleTimeString()}`}
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-full">
                            <div className="border-neutral-300 px-2 py-3 text-neutral-600 select-none min-w-[2rem] text-right bg-transparent border-r-0">
                              {getFileContent(selectedFile)
                                .split("\n")
                                .map((_, i) => (
                                  <div key={i} className="leading-4 text-xs font-mono">
                                    {i + 1}
                                  </div>
                                ))}
                            </div>
                            <div className="flex-1 px-3 py-3">
                              <pre className="text-black text-xs font-mono leading-4 whitespace-pre-wrap">
                                {getFileContent(selectedFile)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className="w-1 bg-gray-400 cursor-col-resize hover:bg-gray-500 flex-shrink-0"
                        onMouseDown={handleRightPaneResize}
                        style={{
                          borderLeft: "1px solid #808080",
                          borderRight: "1px solid #dfdfdf",
                        }}
                      />

                      <div
                        className="flex flex-col h-full"
                        style={{
                          width: `${rightPaneWidth}px`,
                          backgroundColor: "white",
                          boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.3)",
                          borderTopColor: "#808080",
                          borderLeftColor: "#808080",
                          borderRightColor: "#dfdfdf",
                          borderBottomColor: "#dfdfdf",
                        }}
                      >
                        <div className="flex">
                          <button
                            onClick={() => setActiveChatTab("chat")}
                            className="flex-1 px-2 py-1 text-xs hover:bg-neutral-300 text-black border-0"
                            style={{
                              backgroundColor: activeChatTab === "chat" ? "#a0a0a0" : "#c0c0c0",
                              border: "none",
                              outline: "none",
                              boxShadow: "none",
                            }}
                          >
                            Chat
                          </button>
                          <button
                            onClick={() => setActiveChatTab("tasks")}
                            className="flex-1 px-2 py-1 text-xs hover:bg-neutral-300 text-black border-0"
                            style={{
                              backgroundColor: activeChatTab === "tasks" ? "#a0a0a0" : "#c0c0c0",
                              border: "none",
                              outline: "none",
                              boxShadow: "none",
                            }}
                          >
                            Tasks
                          </button>
                          <button
                            onClick={() => setActiveChatTab("goals")}
                            className="flex-1 px-2 py-1 text-xs hover:bg-neutral-300 text-black border-0"
                            style={{
                              backgroundColor: activeChatTab === "goals" ? "#a0a0a0" : "#c0c0c0",
                              border: "none",
                              outline: "none",
                              boxShadow: "none",
                            }}
                          >
                            Goals
                          </button>
                        </div>

                        {/* Reverting to p-2 for compact chat/tasks/goals spacing */}
                        <div className="flex-1 p-2 overflow-auto">
                          {activeChatTab === "chat" && renderChat()}
                          {activeChatTab === "tasks" && renderTasks()}
                          {activeChatTab === "goals" && renderGoals()}
                        </div>

                        {activeChatTab === "chat" && (
                          <div className="p-2">
                            <div className="flex gap-1">
                              <Input
                                placeholder="Ask me to build something..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1 text-xs border-0 !shadow-none ring-0 focus:ring-0 focus:border-0 focus:outline-none"
                                style={{
                                  backgroundColor: "white",
                                  color: "black",
                                  border: "none !important",
                                  boxShadow: "none !important",
                                }}
                              />
                              <button
                                onClick={handleSend}
                                disabled={isLoading}
                                className={`px-2 py-1 text-xs border text-black ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-300"}`}
                                style={{
                                  backgroundColor: "#c0c0c0",
                                  borderTopColor: "#dfdfdf",
                                  borderLeftColor: "#dfdfdf",
                                  borderRightColor: "#808080",
                                  borderBottomColor: "#808080",
                                }}
                              >
                                {isLoading ? "..." : "Send"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === "Library" && (
                    <div
                      className="flex-1"
                      style={{
                        backgroundColor: "white",
                        boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.3)",
                        borderTopColor: "#808080",
                        borderLeftColor: "#808080",
                        borderRightColor: "#dfdfdf",
                        borderBottomColor: "#dfdfdf",
                      }}
                    >
                      <ScrollArea className="h-full">{renderLibraryTable()}</ScrollArea>
                    </div>
                  )}

                  {activeTab === "Community" && (
                    <div
                      className="flex-1"
                      style={{
                        backgroundColor: "white",
                        boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.3)",
                        borderTopColor: "#808080",
                        borderLeftColor: "#808080",
                        borderRightColor: "#dfdfdf",
                        borderBottomColor: "#dfdfdf",
                      }}
                    >
                      <ScrollArea className="h-full">{renderCommunityTable()}</ScrollArea>
                    </div>
                  )}

                  {activeTab === "Create" && (
                    <div
                      className="flex-1 flex items-center justify-center"
                      style={{
                        backgroundColor: "white",
                        boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.3)",
                        borderTopColor: "#808080",
                        borderLeftColor: "#808080",
                        borderRightColor: "#dfdfdf",
                        borderBottomColor: "#dfdfdf",
                      }}
                    >
                      <div className="flex flex-col items-center gap-4 max-w-lg w-full px-4">
                        <div className="flex gap-4 mb-2">
                          <button
                            onClick={() => {
                              setActiveTab("Files")
                              setActiveChatTab("chat")
                            }}
                            className="win95-blue-link hover:text-blue-800 text-sm"
                          >
                            Connector
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab("Files")
                              setActiveChatTab("chat")
                            }}
                            className="win95-blue-link hover:text-blue-800 text-sm"
                          >
                            Pipeline
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab("Files")
                              setActiveChatTab("chat")
                            }}
                            className="win95-blue-link hover:text-blue-800 text-sm"
                          >
                            App
                          </button>
                        </div>

                        <div className="flex gap-2 w-full">
                          <Input
                            placeholder="Ask me to build something..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSend()
                                setActiveTab("Files")
                              }
                            }}
                            className="flex-1 text-sm py-2 px-2"
                            style={{
                              backgroundColor: "white",
                              color: "black",
                              border: "none",
                            }}
                          />
                          <button
                            onClick={() => {
                              handleSend()
                              setActiveTab("Files")
                            }}
                            disabled={isLoading}
                            className={`px-4 text-sm border-2 text-black ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-300"}`}
                            style={{
                              backgroundColor: "#c0c0c0",
                              borderTopColor: "#dfdfdf",
                              borderLeftColor: "#dfdfdf",
                              borderRightColor: "#dfdfdf",
                              borderBottomColor: "#dfdfdf",
                            }}
                          >
                            {isLoading ? "..." : "Send"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </WindowFrame>

      {showCreateModal && (
        <WindowFrame
          id={`${id}-create`}
          title="Create New Connector"
          position={{ x: position.x, y: position.y }}
          zIndex={zIndex + 1}
          width={450}
          height={400}
          icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/joystick-5-H1wCm7w4c5UZkbxLPs6lyLl7H22IzO.png"
          onClose={() => setShowCreateModal(false)}
          onFocus={onFocus}
          onMove={() => {}}
          onMinimize={() => {}}
          onResize={() => {}}
        >
          <div className="flex flex-col h-full p-4" style={{ backgroundColor: "#c0c0c0" }}>
            <div className="space-y-3 flex-1">
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Connector Name:</label>
                <input
                  type="text"
                  value={newConnector.name}
                  onChange={(e) => setNewConnector((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full text-xs border border-neutral-400 p-1 bg-white text-black"
                  placeholder="e.g., Stripe Payment Connector"
                  style={{
                    border: "1px inset #c0c0c0",
                    backgroundColor: "white",
                    color: "black",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1">Type:</label>
                <select
                  value={newConnector.type}
                  onChange={(e) => setNewConnector((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full text-xs border border-neutral-400 p-1 bg-white text-black"
                  style={{
                    border: "1px inset #c0c0c0",
                    backgroundColor: "white",
                    color: "black",
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="database">Database Connector</option>
                  <option value="api">API Connector</option>
                  <option value="pipeline">Data Pipeline</option>
                  <option value="processor">Data Processor</option>
                  <option value="webhook">Webhook Handler</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1">Description:</label>
                <textarea
                  value={newConnector.description}
                  onChange={(e) => setNewConnector((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full text-xs border border-neutral-400 p-1 h-16 resize-none bg-white text-black"
                  placeholder="Brief description of the connector functionality..."
                  style={{
                    border: "1px inset #c0c0c0",
                    backgroundColor: "white",
                    color: "black",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1">Endpoint URL:</label>
                <input
                  type="text"
                  value={newConnector.endpoint}
                  onChange={(e) => setNewConnector((prev) => ({ ...prev, endpoint: e.target.value }))}
                  className="w-full text-xs border border-neutral-400 p-1 bg-white text-black"
                  placeholder="https://api.example.com/v1"
                  style={{
                    border: "1px inset #c0c0c0",
                    backgroundColor: "white",
                    color: "black",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1">Version:</label>
                <input
                  type="text"
                  value={newConnector.version}
                  onChange={(e) => setNewConnector((prev) => ({ ...prev, version: e.target.value }))}
                  className="w-full text-xs border border-neutral-400 p-1 bg-white text-black"
                  placeholder="1.0.0"
                  style={{
                    border: "1px inset #c0c0c0",
                    backgroundColor: "white",
                    color: "black",
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-neutral-400">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1 text-xs border border-neutral-400 bg-win95-button hover:bg-neutral-300"
                style={{
                  border: "1px outset #c0c0c0",
                  backgroundColor: "#c0c0c0",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateConnector}
                className="px-3 py-1 text-xs border border-neutral-400 bg-win95-button hover:bg-neutral-300"
                style={{
                  border: "1px outset #c0c0c0",
                  backgroundColor: "#c0c0c0",
                }}
              >
                Create
              </button>
            </div>
          </div>
        </WindowFrame>
      )}
    </>
  )
}

export default FactoryApp
