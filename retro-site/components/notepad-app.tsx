"use client"
import { WindowFrame } from "./window-frame"
import { Win95MenuBar } from "./win95-menubar"

interface NotepadAppProps {
  id: string
  title: string
  content: string
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
  onMinimize?: () => void
  onMaximize?: () => void
  onResize?: (size: { width: number; height: number }) => void
}

const AIOPS_WHITEPAPER_CONTENT = `Fiveonefour: The Fastest Way to Implement ClickHouse & Streaming in Your Stack

Building analytics on the wrong stack turns every click into a wait.

From frustration to flow: Instantly fast AI-native analytics and a modern developer experience.

Prototype fast, deploy fast, AI fast.

What is Fiveonefour?

Fiveonefour is the conversation-fastdata stack that transforms how you build analytical backends. We provide three core components that work together seamlessly:

MooseStack - Develop in Code
Open source toolkit to build analytical backends in TypeScript/Python. No more wrestling with complex data pipelines or waiting hours for queries to complete.

Key Features:
• Real-time data ingestion and processing
• Built-in ClickHouse integration for lightning-fast analytics
• TypeScript/Python native development experience
• Streaming data transformations that just work

Boreal - Go to Production in a Click
Deployment DX tooling and managed infrastructure (BYO available). Stop worrying about infrastructure and focus on building features your users love.

Infrastructure Includes:
• ClickHouse - Columnar database for analytical workloads
• Redpanda - Kafka-compatible streaming platform
• Temporal - Reliable workflow orchestration
• Anthropic - AI integration for intelligent features

Sloan - Copilot Your Dev Workflow
AI copilot to build your app with you. From natural language to production code, Sloan understands your data and helps you build faster.

AI Capabilities:
• Generate data pipelines from natural language
• Auto-complete complex analytical queries
• Suggest optimizations for better performance
• Debug issues with intelligent recommendations

Why Teams Choose Fiveonefour

"With Fiveonefour, we boosted our development speed on user-facing analytics features by 10x."
- Greg Solak, Head of Engineering, F45

"Fiveonefour is my go-to dev stack now for every new project that needs an analytics backend."
- David Der, Chief AI Officer, SingleStone

"MooseStack brings the tools and abstractions that you expect from a modern developer framework to the world of batch and streaming data workloads."
- Pardhu Gunnam, CEO, Metaphor Data

"As a TypeScript dev, I was able to pick up Fiveonefour's framework and start building API endpoints and streaming transformations literally on day one."
- Jake Butler, Software Engineer, F45

"We've been able to reduce our time for ingesting new electronic medical records from days to minutes."
- Bob Heffernan, Product Manager, Morgan Records Management

Trusted by Industry Leaders

Companies like F45, Héroux-Devtek, Morgan Records Management, and LoyalSnap rely on Fiveonefour to power their most critical analytical workloads.

Enterprise-Grade Security & Compliance

Built for production workloads with security, scalability, and compliance requirements. SOC2 Type 2 certified and enterprise AI ready.

Security Features:
• SOC2 Type 2 certification
• Enterprise-grade access controls
• Data encryption at rest and in transit
• Compliance-ready audit trails

Get Started Today

Ready to transform your data stack? Install MooseStack and start building:

bash -i <(curl -fsSL https://fiveonefour.com/install.sh) moose,sloan

Questions? We're here to help. From collaborating on architecture to answering pricing questions and everything in between, we'd love to chat.

---

Want to see Fiveonefour in action?

🎥 Watch the Getting Started Video - See how to build your first analytical backend in minutes

📞 Request a Demo - Talk to our team about your specific use case

💬 Talk to Sales - Discuss pricing and enterprise features

🛠️ Talk to Engineering - Get technical questions answered

Visit fiveonefour.com to learn more and get started today.`

export function NotepadApp({
  id,
  title,
  content,
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
}: NotepadAppProps) {
  const initialContent = content === "aiops-whitepaper" ? AIOPS_WHITEPAPER_CONTENT : content

  console.log("[v0] NotepadApp received size prop:", size)
  console.log("[v0] Using width:", size?.width || 700, "height:", size?.height || 600)

  return (
    <WindowFrame
      id={id}
      title={`${title} - Document`}
      position={position}
      zIndex={zIndex}
      width={size?.width || 700}
      height={size?.height || 600}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isActive={isActive}
      icon="/icons/notepad-icon.png"
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onResize={onResize}
    >
      <div className="flex flex-col h-full bg-white">
        <Win95MenuBar
          items={[
            {
              label: "File",
              items: [
                { label: "New", onClick: () => {}, shortcut: "Ctrl+N" },
                { label: "Open...", onClick: () => {}, shortcut: "Ctrl+O" },
                { label: "Save", onClick: () => {}, shortcut: "Ctrl+S" },
                { label: "Save As...", onClick: () => {} },
                { type: "separator" },
                { label: "Print...", onClick: () => {}, shortcut: "Ctrl+P" },
                { type: "separator" },
                { label: "Exit", onClick: onClose },
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
                { label: "Find...", onClick: () => {}, shortcut: "Ctrl+F" },
              ],
            },
            {
              label: "Go",
              items: [
                { label: "Go to Line...", onClick: () => {}, shortcut: "Ctrl+G" },
                { type: "separator" },
                { label: "Previous Page", onClick: () => {} },
                { label: "Next Page", onClick: () => {} },
              ],
            },
            {
              label: "Favorites",
              items: [
                { label: "Add to Favorites", onClick: () => {} },
                { label: "Organize Favorites", onClick: () => {} },
                { type: "separator" },
                { label: "Recent Documents", onClick: () => {} },
              ],
            },
            {
              label: "Help",
              items: [
                { label: "Help Topics", onClick: () => {}, shortcut: "F1" },
                { type: "separator" },
                { label: "About Notepad", onClick: () => {} },
              ],
            },
          ]}
        />

        <div className="flex-1 overflow-hidden bg-neutral-200 px-1">
          <div
            className="h-full overflow-y-auto"
            style={{
              backgroundColor: "white",
              border: "2px solid",
              borderTopColor: "#555",
              borderLeftColor: "#555",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
              boxShadow:
                "inset -1px -1px #ffffff, inset 1px 1px #808080, inset -2px -2px #dfdfdf, inset 2px 2px #000000",
              padding: "16px",
            }}
          >
            <div className="max-w-none text-black leading-relaxed break-words word-wrap">
              {initialContent.split("\n").map((line, index) => {
                if (
                  line.includes("Fiveonefour: The Fastest Way to Implement ClickHouse & Streaming in Your Stack") ||
                  (line === line.toUpperCase() && line.length > 30)
                ) {
                  return (
                    <h1 key={index} className="text-xl font-bold mb-6 text-center border-b-2 border-gray-300 pb-2">
                      {line}
                    </h1>
                  )
                } else if (line.endsWith(":") && line.length > 20 && !line.startsWith("•")) {
                  return (
                    <h2 key={index} className="text-lg font-bold mt-6 mb-3 text-gray-800">
                      {line}
                    </h2>
                  )
                } else if (
                  (line.endsWith(":") && line.length <= 20 && line.length > 5) ||
                  (line.match(/^[A-Z][a-z].*[a-z]$/) && line.length < 50 && line.length > 10 && !line.includes("."))
                ) {
                  return (
                    <h3 key={index} className="text-md font-bold mt-4 mb-2 text-gray-700">
                      {line}
                    </h3>
                  )
                } else if (line.startsWith("•") || line.match(/^[A-Z][^:]*:/)) {
                  return (
                    <li key={index} className="text-sm mb-1 ml-4 list-disc">
                      {line.startsWith("•") ? line.substring(2) : line}
                    </li>
                  )
                } else if (line.trim() === "") {
                  return <div key={index} className="mb-3"></div>
                } else {
                  return (
                    <p key={index} className="text-sm mb-4 leading-relaxed">
                      {line}
                    </p>
                  )
                }
              })}
            </div>
          </div>
        </div>

        <div
          className="border-t border-gray-400 px-2 py-1 text-xs text-black flex justify-between"
          style={{ backgroundColor: "#c0c0c0" }}
        >
          <span className="flex items-center gap-1">
            <span>Ready</span>
            <span>| Document 1 of 1</span>
          </span>
          <span>{title}</span>
        </div>
      </div>
    </WindowFrame>
  )
}
