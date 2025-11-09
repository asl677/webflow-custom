"use client"
import { WindowFrame } from "./window-frame"
import { Win95MenuBar } from "./win95-menubar"
import { useState, useEffect } from "react"

interface FolderWindowProps {
  id: string
  title: string
  iconType: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  isActive?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onOpenDocument: (title: string, content: string) => void
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
  icon?: string
  isDarkMode?: boolean
}

const folderContents = {
  resources: [
    {
      name: "Clients",
      icon: "/icons/folder-icon.png",
      content: "testimonials",
      type: "folder",
    },
    {
      name: "Case Studies",
      icon: "/icons/folder-icon.png",
      content: "case-studies",
      type: "folder",
    },
    {
      name: "White Papers",
      icon: "/icons/folder-icon.png",
      content: "white-papers",
      type: "folder",
    },
    {
      name: "Getting Started",
      icon: "/icons/video_mg-2.png",
      content: "getting-started-video",
      type: "video",
    },
  ],
  "case-studies": [
    {
      name: "Saving F45 50% Cos Savings with Moose.doc",
      icon: "/icons/notepad-icon.png",
      content: "Case Study: How a tech startup increased revenue by 300% using our platform...",
    },
    {
      name: "10x Dev speeds for Loyalsnap.doc",
      icon: "/icons/notepad-icon.png",
      content: "Case Study: E-commerce site optimization resulting in 45% conversion increase...",
    },
  ],
  testimonials: [
    {
      name: "Nike 40% Engagement Increase.doc",
      icon: "/icons/notepad-icon.png",
      content:
        'Client Testimonial: Nike\n\n"Working with 514 has been transformative for our data operations. Their analytics platform helped us increase customer engagement by 40% and reduce operational costs by 25%. The real-time insights have revolutionized how we make business decisions."\n\n- Sarah Johnson, VP of Digital Strategy\n- Nike Inc.\n- Project: Customer Analytics Platform\n- Duration: 8 months\n- Results: 40% engagement increase, 25% cost reduction',
    },
    {
      name: "F45 50% Cost Savings Success.doc",
      icon: "/icons/notepad-icon.png",
      content:
        'Client Testimonial: F45 Training\n\n"514\'s solution delivered exactly what we needed - a 50% reduction in operational costs while improving our member experience. Their team understood our fitness industry challenges and built a platform that scales with our rapid growth."\n\n- Michael Chen, CTO\n- F45 Training\n- Project: Member Management System\n- Duration: 6 months\n- Results: 50% cost savings, improved member retention',
    },
    {
      name: "Loyal Snap 10x Dev Speed.doc",
      icon: "/icons/notepad-icon.png",
      content:
        'Client Testimonial: Loyal Snap\n\n"The development speed improvements we achieved with 514 were incredible - 10x faster deployment cycles and significantly reduced time-to-market. Their expertise in modern development practices transformed our entire engineering workflow."\n\n- David Kim, Lead Developer\n- Loyal Snap\n- Project: Development Platform Optimization\n- Duration: 4 months\n- Results: 10x faster development, reduced time-to-market',
    },
  ],
  "white-papers": [
    {
      name: "AIOps Network Operations.pdf",
      icon: "/icons/notepad-icon.png",
      content: "aiops-whitepaper",
    },
  ],
  "blog-posts": [
    {
      name: "User-facing Analytics Best Practices.doc",
      icon: "/icons/notepad-icon.png",
      content:
        "Blog Post: User-facing Analytics Best Practices\n\nLearn how to build effective user-facing analytics that provide real value to your customers. This comprehensive guide covers dashboard design, performance optimization, and user experience considerations for analytical backends.",
    },
    {
      name: "ClickHouse for Product Teams.doc",
      icon: "/icons/notepad-icon.png",
      content:
        "Blog Post: ClickHouse for Product Teams\n\nDiscover how product teams can leverage ClickHouse for fast, scalable analytics. From data modeling to query optimization, this post covers everything you need to know about implementing ClickHouse in your product stack.",
    },
    {
      name: "Building Data-Intensive Features.doc",
      icon: "/icons/notepad-icon.png",
      content:
        "Blog Post: Building Data-Intensive Features\n\nA deep dive into architecting and implementing data-intensive features that scale. Learn about data pipeline design, real-time processing, and how to handle high-volume analytical workloads in production.",
    },
    {
      name: "AI Integration Patterns.doc",
      icon: "/icons/notepad-icon.png",
      content:
        "Blog Post: AI Integration Patterns\n\nExplore modern patterns for integrating AI capabilities into your applications. This post covers API design, model deployment strategies, and best practices for building AI-powered features that users love.",
    },
    {
      name: "Next.js for Analytics Dashboards.doc",
      icon: "/icons/notepad-icon.png",
      content:
        "Blog Post: Next.js for Analytics Dashboards\n\nLearn how to build high-performance analytics dashboards using Next.js. This tutorial covers server-side rendering, data fetching strategies, and optimization techniques for data-heavy applications.",
    },
    {
      name: "Developer Tools and Observability.doc",
      icon: "/icons/notepad-icon.png",
      content:
        "Blog Post: Developer Tools and Observability\n\nA comprehensive guide to building better developer tools with proper observability. Learn about monitoring, logging, and debugging strategies that help teams ship faster and more reliably.",
    },
  ],
  "cursor-ide": [
    {
      name: "Cursor IDE",
      icon: "⚡",
      content: "cursor-ide",
      type: "app",
    },
    {
      name: "Project Setup.md",
      icon: "⚙️",
      content: "Cursor IDE Setup: Configuration and best practices for development workflow...",
    },
    {
      name: "Extensions Guide.md",
      icon: "🧩",
      content: "Essential extensions and plugins for enhanced productivity in Cursor IDE...",
    },
  ],
  "neon-db": [
    {
      name: "Database Schema.sql",
      icon: "🗃️",
      content: "Neon Database Schema: Table structures and relationships for the application...",
    },
    {
      name: "Query Examples.sql",
      icon: "🔍",
      content: "Common database queries and optimization techniques for Neon...",
    },
  ],
  docker: [
    { name: "Dockerfile", icon: "🐳", content: "Docker configuration for containerized application deployment..." },
    {
      name: "Docker Compose.yml",
      icon: "📦",
      content: "Docker Compose setup for multi-container application stack...",
    },
    {
      name: "Docker Desktop",
      icon: "🐳",
      content: "docker-desktop",
      type: "app",
    },
  ],
  docs: [
    {
      name: "README.txt",
      icon: "/icons/notepad-icon.png",
      content: "Welcome to the documentation folder. This contains important project notes and documentation.",
    },
    {
      name: "Meeting Notes.txt",
      icon: "/icons/notepad-icon.png",
      content:
        "Meeting Notes from Q4 2024:\n\n- Discussed project roadmap\n- Reviewed budget allocations\n- Planned next quarter initiatives",
    },
    {
      name: "Project Specs.txt",
      icon: "/icons/notepad-icon.png",
      content:
        "Project Specifications:\n\nObjective: Build comprehensive Windows 95 interface\nFeatures: Draggable icons, authentic styling, document editing\nTimeline: Q1 2025",
    },
  ],
  moosestack: [
    {
      name: "Overview",
      icon: "🦌",
      content: "moosestack-overview",
      type: "app",
    },
  ],
  sloan: [
    {
      name: "Sloan Dashboard",
      icon: "🏢",
      content: "sloan-dashboard",
      type: "app",
    },
  ],
  registry: [
    {
      name: "User Facing Analytics.doc",
      icon: "/icons/analytics.png",
      content:
        "Template: User-facing analytics dashboard with real-time metrics, KPI tracking, and interactive visualizations for business intelligence...",
    },
    {
      name: "Data Warehouse Architecture.doc",
      icon: "/icons/bar-graph.png",
      content:
        "Operational Data Warehouse\n\nThe odw project is a starter kit for an operational data warehouse, using the Moose framework to ingest data from various sources (Blobs, Events, Logs) into an analytical backend (ClickHouse).\n\nODW Stack:\n\nBackend & Data:\nFramework: Moose (Python)\nData Platform: ClickHouse (Warehouse) | RedPanda (Streaming)\nIngestion: Moose connectors for Blobs, Events, and Logs\nFrontend: Streamlit",
    },
  ],
  "recycle-bin": [
    {
      name: "old-data.json",
      icon: "/icons/notepad-icon.png",
      content:
        '{\n  "legacy": true,\n  "data": "This is old data from previous system",\n  "timestamp": "2024-01-15"\n}',
    },
    {
      name: "secret-codes.txt",
      icon: "/icons/notepad-icon.png",
      content:
        "Secret Codes:\n\nCODE-001: ALPHA-BRAVO-CHARLIE\nCODE-002: DELTA-ECHO-FOXTROT\nCODE-003: GOLF-HOTEL-INDIA\n\n[CLASSIFIED]",
    },
    {
      name: "playlist.mp3",
      icon: "/icons/notepad-icon.png",
      content:
        "Audio file: playlist.mp3\n\nThis is a music playlist file that was deleted.\nContains 15 tracks from various artists.",
    },
    {
      name: "index.tsx",
      icon: "/icons/notepad-icon.png",
      content:
        'import React from "react"\n\nexport default function Index() {\n  return (\n    <div>\n      <h1>Old Index Page</h1>\n      <p>This component was removed from the project.</p>\n    </div>\n  )\n}',
    },
  ],
  "my-computer": [],
  apps: [
    {
      name: "Data Warehouse.doc",
      icon: "/icons/bar-graph.png",
      content:
        "Operational Data Warehouse\n\nThe odw project is a starter kit for an operational data warehouse, using the Moose framework to ingest data from various sources (Blobs, Events, Logs) into an analytical backend (ClickHouse).\n\nODW Stack:\n\nBackend & Data:\nFramework: Moose (Python)\nData Platform: ClickHouse (Warehouse) | RedPanda (Streaming)\nIngestion: Moose connectors for Blobs, Events, and Logs\nFrontend: Streamlit",
    },
    {
      name: "User Analytics.doc",
      icon: "/icons/analytics.png",
      content:
        "Template: User-facing analytics dashboard with real-time metrics, KPI tracking, and interactive visualizations for business intelligence...",
    },
  ],
}

export function FolderWindow({
  id,
  title,
  iconType,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  isActive,
  onMaximize,
  size,
  onClose,
  onFocus,
  onMove,
  onOpenDocument,
  onMinimize,
  onResize,
  icon,
  isDarkMode = false,
}: FolderWindowProps) {
  const files = folderContents[iconType as keyof typeof folderContents] || []
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleFileDoubleClick = (file: any) => {
    console.log("[v0] File double-clicked:", file.name, "type:", file.type, "content:", file.content)

    if (file.type === "folder") {
      onOpenDocument("open-folder", file.content)
    } else if (file.type === "video") {
      console.log("[v0] Opening video with docTitle: getting-started-video")
      onOpenDocument("getting-started-video", "getting-started-video")
    } else if (file.type === "app") {
      onOpenDocument(file.content, file.content)
    } else {
      if (iconType === "blog-posts") {
        const blogPostMap: { [key: string]: string } = {
          "User-facing Analytics Best Practices.doc": "user-analytics",
          "ClickHouse for Product Teams.doc": "clickhouse-product",
          "Building Data-Intensive Features.doc": "data-intensive",
          "AI Integration Patterns.doc": "ai-integration",
          "Next.js for Analytics Dashboards.doc": "nextjs-analytics",
          "Developer Tools and Observability.doc": "dev-tools",
        }
        const blogPostId = blogPostMap[file.name] || "user-analytics"
        onOpenDocument("blog-post-viewer", blogPostId)
      } else if (iconType === "case-studies") {
        const caseStudyMap: { [key: string]: string } = {
          "Saving F45 50% Cos Savings with Moose.doc": "f45-case-study",
          "10x Dev speeds for Loyalsnap.doc": "loyalsnap-case-study",
        }
        const caseStudyId = caseStudyMap[file.name] || "f45-case-study"
        onOpenDocument("case-study-viewer", caseStudyId)
      } else if (iconType === "testimonials") {
        const testimonialMap: { [key: string]: string } = {
          "Nike 40% Engagement Increase.doc": "nike-testimonial",
          "F45 50% Cost Savings Success.doc": "f45-testimonial",
          "Loyal Snap 10x Dev Speed.doc": "loyalsnap-testimonial",
        }
        const testimonialId = testimonialMap[file.name] || "nike-testimonial"
        onOpenDocument("testimonial-viewer", testimonialId)
      } else if (iconType === "white-papers") {
        onOpenDocument("white-paper-viewer", file.content)
      } else if (iconType === "registry") {
        onOpenDocument("registry-viewer", file.content)
      } else if (iconType === "apps") {
        const appMap: { [key: string]: string } = {
          "Data Warehouse.doc": "data-warehouse",
          "User Analytics.doc": "user-analytics",
        }
        const appId = appMap[file.name] || "data-warehouse"
        onOpenDocument("app-viewer", appId)
      } else {
        onOpenDocument(file.name, file.content)
      }
    }
  }

  const handleFileClick = (file: any) => {
    if (isMobile) {
      handleFileDoubleClick(file)
    }
  }

  const customFooterContent = (
    <div className="flex justify-between items-center w-full">
      <span className={isDarkMode ? "text-white" : "text-black"}>
        {files.length} object{files.length !== 1 ? "s" : ""}
      </span>
      <span className={isDarkMode ? "text-white" : "text-black"}>Ready</span>
      {!isMobile && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 cursor-nw-resize bg-gray-200"
          style={{
            background: `linear-gradient(-45deg, 
            transparent 0%, transparent 30%, 
            #808080 30%, #808080 35%, 
            transparent 35%, transparent 65%, 
            #808080 65%, #808080 70%, 
            transparent 70%)`,
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            const startX = e.clientX
            const startY = e.clientY
            const startWidth = size?.width || 320
            const startHeight = size?.height || 240

            const handleMouseMove = (e: MouseEvent) => {
              const newWidth = Math.max(300, startWidth + (e.clientX - startX))
              const newHeight = Math.max(200, startHeight + (e.clientY - startY))
              onResize({ width: newWidth, height: newHeight })
            }

            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleMouseMove)
              document.removeEventListener("mouseup", handleMouseUp)
            }

            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
          }}
        />
      )}
    </div>
  )

  const windowWidth = isMobile ? Math.min(window.innerWidth - 40, 320) : size?.width || 320
  const windowHeight = isMobile ? Math.min(window.innerHeight - 120, 300) : size?.height || 220

  return (
    <WindowFrame
      id={id}
      title={title}
      position={position}
      zIndex={zIndex}
      width={windowWidth}
      height={windowHeight}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      isActive={isActive}
      icon={icon}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
      customFooterContent={customFooterContent}
    >
      <div className="h-full flex flex-col relative min-h-0 mx-2">
        {!isMobile && (
          <Win95MenuBar
            items={[
              {
                label: "File",
                items: [
                  { label: "New", onClick: () => {} },
                  { label: "Open", onClick: () => {} },
                  { type: "separator" },
                  { label: "Create Shortcut", onClick: () => {} },
                  { label: "Delete", onClick: () => {}, shortcut: "Del" },
                  { label: "Rename", onClick: () => {}, shortcut: "F2" },
                  { type: "separator" },
                  { label: "Properties", onClick: () => {}, shortcut: "Alt+Enter" },
                  { type: "separator" },
                  { label: "Close", onClick: onClose },
                ],
              },
              {
                label: "Edit",
                items: [
                  { label: "Undo", onClick: () => {}, shortcut: "Ctrl+Z" },
                  { type: "separator" },
                  { label: "Cut", onClick: () => {}, shortcut: "Ctrl+X" },
                  { label: "Copy", onClick: () => {}, shortcut: "Ctrl+C" },
                  { label: "Paste", onClick: () => {}, shortcut: "Ctrl+V" },
                  { type: "separator" },
                  { label: "Select All", onClick: () => {}, shortcut: "Ctrl+A" },
                  { label: "Invert Selection", onClick: () => {} },
                ],
              },
              {
                label: "View",
                items: [
                  { label: "Toolbar", onClick: () => {} },
                  { label: "Status Bar", onClick: () => {} },
                  { type: "separator" },
                  { label: "Large Icons", onClick: () => {} },
                  { label: "Small Icons", onClick: () => {} },
                  { label: "List", onClick: () => {} },
                  { label: "Details", onClick: () => {} },
                  { type: "separator" },
                  { label: "Arrange Icons", onClick: () => {} },
                  { label: "Refresh", onClick: () => {}, shortcut: "F5" },
                ],
              },
              {
                label: "Go",
                items: [
                  { label: "Back", onClick: () => {}, shortcut: "Alt+←" },
                  { label: "Forward", onClick: () => {}, shortcut: "Alt+→" },
                  { label: "Up One Level", onClick: () => {}, shortcut: "Backspace" },
                  { type: "separator" },
                  { label: "Home", onClick: () => {} },
                ],
              },
              {
                label: "Help",
                items: [
                  { label: "Help Topics", onClick: () => {} },
                  { type: "separator" },
                  { label: "About Windows", onClick: () => {} },
                ],
              },
            ]}
          />
        )}

        <div className={`flex-1 overflow-hidden border-1 relative ${isDarkMode ? "bg-black" : "bg-white"}`}>
          {iconType === "my-computer" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img
                src="/images/sidekick.gif"
                alt="Sidekick Device"
                className={`opacity-80 ${isMobile ? "w-48" : "w-64"}`}
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          )}

          <div
            className="hh-full overflow-y-auto win95-inner-content"
            style={{
              backgroundColor: isDarkMode ? "#000" : "#fff", 
              padding: "16px",
            }}
          >
            <div className={`grid gap-4 ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-4 gap-4"}`}>
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-default p-2 transition-colors border border-transparent ${isDarkMode ? "text-white" : "text-black"} ${isMobile ? "w-full min-h-[80px]" : "w-36"}`}
                  onClick={() => handleFileClick(file)}
                  onDoubleClick={() => handleFileDoubleClick(file)}
                >
                  {file.icon.startsWith("/icons/") ? (
                    <img
                      src={file.icon || "/placeholder.svg"}
                      alt={file.name}
                      className={`mb-1 pixelated flex-shrink-0 ${isMobile ? "w-10 h-10" : "w-8 h-8"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className={`mb-1 filter drop-shadow-sm ${isMobile ? "text-2xl" : "text-2xl"}`}>
                      {file.icon}
                    </div>
                  )}
                  <div
                    className={`text-center font-mono leading-tight border border-dotted border-transparent px-1 ${isMobile ? "text-xs break-words" : "text-xs"} ${isDarkMode ? "text-white" : "text-black"}`}
                    style={{ wordBreak: "break-word", hyphens: "auto" }}
                  >
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
