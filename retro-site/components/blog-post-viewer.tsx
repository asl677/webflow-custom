"use client"

import { useState } from "react"
import { WindowFrame } from "./window-frame"

interface BlogPostViewerProps {
  id: string
  initialPost?: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  isActive?: boolean // Added isActive to interface
  isDarkMode?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
}

const blogPosts = [
  {
    id: "ufa",
    title: "User Facing Analytics (UFA)",
    content: `User Facing Analytics (UFA)

A monorepo starter kit for building applications with a multi-modal backend that combines transactional (PostgreSQL), analytical (ClickHouse), and search (Elasticsearch) capabilities. The stack is configured for real-time data synchronization across services.

Stack Overview:

Backend & Data Layer:
• Transactional Database: PostgreSQL with Fastify and Drizzle ORM
• Analytical Database: ClickHouse with Moose framework for API and data ingestion
• Search Engine: Elasticsearch for full-text search capabilities

Data Synchronization & Streaming:
• Moose Workflows powered by Temporal for orchestration
• Moose Stream powered by Redpanda for real-time event streaming
• Supabase Realtime for live database updates

Frontend Stack:
• Build Tool: Vite for fast development and optimized builds
• Framework: React 19 with TypeScript for type safety
• Routing & State: TanStack Router, TanStack Query, and TanStack Form
• Styling: Tailwind CSS for utility-first styling

Key Features:
• Multi-modal data architecture combining OLTP, OLAP, and search
• Real-time data synchronization across all services
• Modern React 19 frontend with powerful state management
• Production-ready monorepo structure
• Type-safe development with TypeScript throughout

Perfect for building analytics-heavy applications that need to serve data to end users with low latency and high performance.

GitHub Repository: github.com/514-labs/area-code/tree/main/ufa`,
  },
  {
    id: "odw",
    title: "Operational Data Warehouse (ODW)",
    content: `Operational Data Warehouse (ODW)

A starter kit for building an operational data warehouse using the Moose framework. Designed to ingest data from various sources including Blobs, Events, and Logs into an analytical backend powered by ClickHouse.

Stack Overview:

Core Framework:
• Moose (Python): Modern data engineering framework for building data-intensive applications
• Provides built-in connectors for various data sources
• Handles data transformation and loading automatically

Data Platform:
• ClickHouse: High-performance columnar database for analytical workloads
• Optimized for OLAP queries and real-time analytics
• Handles billions of rows with sub-second query performance

Streaming Infrastructure:
• RedPanda: Kafka-compatible streaming platform
• Enables real-time data ingestion and processing
• Low-latency event streaming for operational analytics

Data Ingestion:
• Blob Storage: Ingest data from S3, GCS, and other object stores
• Event Streams: Process real-time events from applications
• Log Files: Parse and analyze application and system logs

Visualization:
• Streamlit: Python-based framework for building data apps
• Create interactive dashboards and reports
• Rapid prototyping of analytical interfaces

Use Cases:
• Real-time operational analytics and monitoring
• Log aggregation and analysis
• Event stream processing and analytics
• Business intelligence and reporting
• Data lake to warehouse pipelines

The ODW template provides a complete foundation for building production-grade data warehouses that can handle operational workloads with real-time requirements.

GitHub Repository: github.com/514-labs/area-code/tree/main/odw`,
  },
  {
    id: "user-analytics",
    title: "User-facing Analytics Best Practices",
    content: `Blog Post: User-facing Analytics Best Practices

Learn how to build effective user-facing analytics that provide real value to your customers. This comprehensive guide covers dashboard design, performance optimization, and user experience considerations for analytical backends.

Key Topics Covered:
• Dashboard Design Principles
• Performance Optimization Strategies
• User Experience Best Practices
• Data Visualization Techniques
• Real-time Analytics Implementation

Whether you're building customer-facing dashboards or internal analytics tools, this guide provides the essential knowledge you need to create compelling and useful analytics experiences.`,
  },
  {
    id: "clickhouse-product",
    title: "ClickHouse for Product Teams",
    content: `Blog Post: ClickHouse for Product Teams

Discover how product teams can leverage ClickHouse for fast, scalable analytics. From data modeling to query optimization, this post covers everything you need to know about implementing ClickHouse in your product stack.

What You'll Learn:
• ClickHouse Architecture Overview
• Data Modeling Best Practices
• Query Optimization Techniques
• Integration with Product Analytics
• Performance Monitoring and Tuning

ClickHouse offers unparalleled performance for analytical workloads, making it an ideal choice for product teams who need fast insights from large datasets.`,
  },
  {
    id: "data-intensive",
    title: "Building Data-Intensive Features",
    content: `Blog Post: Building Data-Intensive Features

A deep dive into architecting and implementing data-intensive features that scale. Learn about data pipeline design, real-time processing, and how to handle high-volume analytical workloads in production.

Core Concepts:
• Data Pipeline Architecture
• Real-time vs Batch Processing
• Scalability Considerations
• Error Handling and Recovery
• Monitoring and Observability

Building features that can handle massive amounts of data requires careful planning and the right architectural decisions. This guide walks you through the essential patterns and practices.`,
  },
  {
    id: "ai-integration",
    title: "AI Integration Patterns",
    content: `Blog Post: AI Integration Patterns

Explore modern patterns for integrating AI capabilities into your applications. This post covers API design, model deployment strategies, and best practices for building AI-powered features that users love.

Integration Strategies:
• API Design for AI Services
• Model Deployment Patterns
• Caching and Performance
• Error Handling for AI Systems
• User Experience Considerations

As AI becomes more prevalent in software applications, understanding how to integrate these capabilities effectively is crucial for modern development teams.`,
  },
  {
    id: "nextjs-analytics",
    title: "Next.js for Analytics Dashboards",
    content: `Blog Post: Next.js for Analytics Dashboards

Learn how to build high-performance analytics dashboards using Next.js. This tutorial covers server-side rendering, data fetching strategies, and optimization techniques for data-heavy applications.

Technical Deep Dive:
• Server-Side Rendering for Analytics
• Data Fetching Strategies
• Performance Optimization
• Caching Mechanisms
• Real-time Updates

Next.js provides excellent tools for building fast, SEO-friendly analytics dashboards. This guide shows you how to leverage these capabilities effectively.`,
  },
  {
    id: "dev-tools",
    title: "Developer Tools and Observability",
    content: `Blog Post: Developer Tools and Observability

A comprehensive guide to building better developer tools with proper observability. Learn about monitoring, logging, and debugging strategies that help teams ship faster and more reliably.

Observability Pillars:
• Metrics and Monitoring
• Logging Best Practices
• Distributed Tracing
• Error Tracking and Alerting
• Performance Profiling

Great developer tools are built with observability in mind from day one. This post covers the essential practices for creating tools that are easy to debug and maintain.`,
  },
]

export function BlogPostViewer({
  id,
  initialPost = "user-analytics",
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  isActive, // Added isActive to destructured props
  isDarkMode = false,
  onMaximize,
  size,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
}: BlogPostViewerProps) {
  const [currentPostId, setCurrentPostId] = useState(initialPost)

  const currentPost = blogPosts.find((post) => post.id === currentPostId) || blogPosts[0]
  const currentIndex = blogPosts.findIndex((post) => post.id === currentPostId)

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + blogPosts.length) % blogPosts.length
    setCurrentPostId(blogPosts[prevIndex].id)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % blogPosts.length
    setCurrentPostId(blogPosts[nextIndex].id)
  }

  return (
    <WindowFrame
      id={id}
      title={`${currentPost.title} - Blog Post`}
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive} // Pass isActive to WindowFrame
      onMaximize={onMaximize}
      width={size?.width || 700}
      height={size?.height || 600}
      icon="/icons/blog-icon.png"
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
    >
      <div className="flex flex-col mx-2 h-full blog-post-viewer bg-white">
        {/* Document toolbar */}
        <div
          className="flex items-center justify-between px-0 py-0"
          style={{ backgroundColor: "#c0c0c0" }}
        >
          <div className="flex items-center gap-0">
            <button
              className="px-2 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#555",
                borderBottomColor: "#555",
              }}
            >
              File
            </button>
            <button
              className="px-2 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#555",
                borderBottomColor: "#555",
              }}
            >
              Edit
            </button>
            <button
              className="px-2 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#555",
                borderBottomColor: "#555",
              }}
            >
              View
            </button>
          </div>
          <div className="flex items-center gap-0">
            <button
              onClick={handlePrevious}
              className="px-3 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#555",
                borderBottomColor: "#555",
              }}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-3 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#555",
                borderBottomColor: "#555",
              }}
            >
              Next
            </button>
          </div>
        </div>

        {/* Document content */}
        <div className="flex-1 overflow-hidden bg-white win95-inner-content !m-0 !mr-[0px] !p-[0] !pb-[4px]" style={{ minHeight: 0 }}>
          <div
            className="h-full overflow-y-auto"
            style={{

            }}
          >
            <div className="max-w-none leading-relaxed break-words word-wrap">
              {currentPost.content.split("\n").map((line, index) => {
                // Main title (starts with "Blog Post:")
                if (line.startsWith("Blog Post:") || line.startsWith("User Facing Analytics (UFA)")) {
                  return (
                    <h1
                      key={index}
                      className={`text-xl font-bold mb-6 text-center border-b-2 border-gray-300 pb-2 ${isDarkMode ? "text-white" : "text-black"}`}
                    >
                      {line.replace("Blog Post: ", "").replace("User Facing Analytics (UFA)", "")}
                    </h1>
                  )
                }
                // Section headings (lines ending with ":")
                else if (line.endsWith(":") && line.length > 10 && !line.startsWith("•")) {
                  return (
                    <h2 key={index} className={`text-lg font-bold mt-6 mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {line}
                    </h2>
                  )
                }
                // Bullet points
                else if (line.startsWith("•")) {
                  return (
                    <li key={index} className={`text-sm mb-1 ml-4 list-disc ${isDarkMode ? "text-white" : "text-black"}`}>
                      {line.substring(2)}
                    </li>
                  )
                }
                // Empty lines
                else if (line.trim() === "") {
                  return <div key={index} className="mb-3"></div>
                }
                // Regular paragraphs
                else {
                  return (
                    <p key={index} className={`text-sm mb-4 leading-relaxed ${isDarkMode ? "text-white" : "text-black"}`}>
                      {line}
                    </p>
                  )
                }
              })}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="border-t border-gray-400 px-1 py-1 text-xs text-black flex justify-between"
          style={{ backgroundColor: "#c0c0c0" }}
        >
         
          {/* <span>{currentPost.title}</span> */}
        </div>
      </div>
    </WindowFrame>
  )
}
