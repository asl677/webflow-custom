"use client"

import { useState, useEffect } from "react"
import { WindowFrame } from "./window-frame"
import { SplashScreen } from "./splash-screen"

interface MooseStackAppProps {
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
  onMinimize?: () => void
  onMaximize?: () => void
  onResize?: (size: { width: number; height: number }) => void
}

const sections = [
  {
    title: "OLAP",
    description: "High-performance analytical processing for real-time data insights",
    code: `// MooseOLAP Query Example
const query = moose.olap()
  .select(['user_id', 'event_type', 'timestamp'])
  .from('user_events')
  .where('timestamp > ?', Date.now() - 86400000)
  .groupBy('event_type')
  .orderBy('timestamp DESC')
  .limit(1000);

const results = await query.execute();
console.log('Analytics results:', results);`,
    useCases: [
      "Real-time dashboard analytics for e-commerce platforms",
      "Customer behavior analysis and segmentation",
      "Financial reporting and fraud detection",
      "IoT sensor data aggregation and monitoring",
      "Marketing campaign performance tracking",
    ],
  },
  {
    title: "Streaming",
    description: "Real-time data streaming and processing capabilities",
    code: `// Streaming Data Pipeline
const stream = moose.stream('user-events')
  .filter(event => event.type === 'purchase')
  .transform(event => ({
    ...event,
    revenue: event.amount * 0.1,
    processed_at: new Date()
  }))
  .sink('revenue-analytics');

stream.start();
console.log('Streaming pipeline started');`,
    useCases: [
      "Live chat message processing and moderation",
      "Stock price monitoring and alert systems",
      "Social media sentiment analysis in real-time",
      "Gaming leaderboard updates and notifications",
      "Supply chain tracking and logistics optimization",
    ],
  },
  {
    title: "Workflows",
    description: "Automated data workflows and orchestration",
    code: `// Workflow Definition
const workflow = moose.workflow('data-processing')
  .step('extract', async () => {
    return await extractData('source-db');
  })
  .step('transform', async (data) => {
    return transformData(data);
  })
  .step('load', async (data) => {
    return await loadData('target-db', data);
  });

await workflow.execute();
console.log('Workflow completed successfully');`,
    useCases: [
      "Automated data backup and synchronization",
      "ETL processes for data warehouse management",
      "Machine learning model training pipelines",
      "Content publishing and approval workflows",
      "Scheduled report generation and distribution",
    ],
  },
  {
    title: "API",
    description: "RESTful API endpoints for data access and management",
    code: `// API Client Usage
const mooseAPI = new MooseAPI({
  endpoint: 'https://api.moosestack.com',
  apiKey: 'YOUR_MOOSE_API_KEY'
});

// Create a new data source
const dataSource = await mooseAPI.dataSources.create({
  name: 'user-analytics',
  type: 'postgresql',
  config: { host: 'localhost', port: 5432 }
});

console.log('Data source created:', dataSource.id);`,
    useCases: [
      "Third-party application integrations",
      "Mobile app data synchronization",
      "Webhook endpoints for external services",
      "Custom dashboard and visualization tools",
      "Microservices data exchange and communication",
    ],
  },
]

export function MooseStackApp({
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
}: MooseStackAppProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0) // added loading progress state
  const [activeSection, setActiveSection] = useState(0)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})
  const [showUseCases, setShowUseCases] = useState(false)

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            setIsLoading(false)
            clearInterval(interval)
            return 100
          }
          return prev + 10 // faster progress increment
        })
      }, 200) // 200ms intervals for faster loading

      return () => clearInterval(interval)
    }
  }, [isLoading])

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

  const useCaseCategories = [
    {
      title: "Analytics & Reporting",
      modules: ["OLAP", "API"],
      description: "Real-time analytics, dashboards, and business intelligence",
    },
    {
      title: "Real-time Processing",
      modules: ["Streaming", "Workflows"],
      description: "Live data processing and event-driven architectures",
    },
    {
      title: "Data Integration",
      modules: ["API", "Workflows", "Streaming"],
      description: "ETL processes, data synchronization, and system integrations",
    },
    {
      title: "Customer Experience",
      modules: ["Streaming", "OLAP"],
      description: "Personalization, behavior tracking, and user analytics",
    },
    {
      title: "Operations & Monitoring",
      modules: ["Workflows", "API", "Streaming"],
      description: "System monitoring, alerting, and automated operations",
    },
  ]

  if (isLoading) {
    return (
      <WindowFrame
        id={id}
        title="MooseStack Modules"
        icon="/icons/diskettes-icon.png"
        position={position}
        zIndex={zIndex}
        isAnimating={isAnimating}
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        isActive={isActive}
        size={size || { width: 500, height: 400 }}
        onClose={onClose}
        onFocus={onFocus}
        onMove={onMove}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onResize={onResize}
      >
        <SplashScreen
          title="MooseStack"
          version="1.0"
          image="/images/moosestack-splash.jpg"
          description="Type-safe, code-first tooling for building real-time analytical backends—OLAP Databases, Data Streaming, ETL Workflows, Query APIs, and more."
          copyright="© 514 all rights reserved 2025"
          company="Global"
          progress={loadingProgress}
        />
      </WindowFrame>
    )
  }

  return (
    <WindowFrame
      id={id}
      title="MooseStack Modules"
      icon="/icons/diskettes-icon.png" // Updated to use diskettes icon instead of moosestack-icon.png
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive}
      size={size || { width: 500, height: 400 }}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onResize={onResize}
    >
      <div className="flex flex-col h-full" style={{ backgroundColor: "#c0c0c0" }}>
        <div className="flex border-gray-400 !border-0" style={{ backgroundColor: "#c0c0c0" }}>
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveSection(index)
                setShowUseCases(false)
              }}
              className={`px-3 py-1 text-sm hover:bg-gray-300 text-black ${
                activeSection === index && !showUseCases ? "bg-gray-400 win95-tab-active" : ""
              }`}
              style={{
                backgroundColor: activeSection === index && !showUseCases ? "#a0a0a0" : "#c0c0c0",
                border: "none",
              }}
            >
              {section.title}
            </button>
          ))}
          <button
            onClick={() => setShowUseCases(!showUseCases)}
            className={`px-3 py-1 text-sm hover:bg-gray-300 text-black ${showUseCases ? "bg-gray-400" : ""}`}
            style={{
              backgroundColor: showUseCases ? "#a0a0a0" : "#c0c0c0",
              border: "none",
            }}
          >
            Use Cases
          </button>
          <button
            className="px-3 py-1 text-sm hover:bg-gray-300 text-black ml-auto"
            style={{
              backgroundColor: "#c0c0c0",
              border: "none",
            }}
          >
            Docs
          </button>
        </div>

        <div className="flex-1 m-2 overflow-hidden my-2 py-1">
          <div
            className="h-full overflow-y-auto p-4 py-4 my-1.5"
            style={{
              backgroundColor: "#c0c0c0",
              borderTop: "2px solid #808080",
              borderLeft: "2px solid #808080",
              borderBottom: "2px solid #dfdfdf",
              borderRight: "2px solid #dfdfdf",
            }}
          >
            {showUseCases ? (
              <div>
                <h2 className="text-black font-bold text-lg mb-4">Use Cases by Category</h2>
                <div className="space-y-4">
                  {useCaseCategories.map((category, index) => (
                    <div
                      key={index}
                      className="border border-gray-400 p-3 bg-sidebar-border border-none"
                      style={{
                        borderTopColor: "#808080",
                        borderLeftColor: "#808080",
                        borderRightColor: "#dfdfdf",
                        borderBottomColor: "#dfdfdf",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-black font-bold text-sm">{category.title}</h3>
                        <div className="flex gap-1">
                          {category.modules.map((module, moduleIndex) => (
                            <button
                              key={moduleIndex}
                              onClick={() => {
                                const moduleIndex = sections.findIndex((section) => section.title === module)
                                if (moduleIndex !== -1) {
                                  setActiveSection(moduleIndex)
                                  setShowUseCases(false)
                                }
                              }}
                              className="px-2 py-1 text-xs border text-black hover:bg-gray-200 cursor-pointer"
                              style={{
                                backgroundColor: "#e0e0e0",
                                borderTopColor: "#dfdfdf",
                                borderLeftColor: "#dfdfdf",
                                borderRightColor: "#808080",
                                borderBottomColor: "#808080",
                              }}
                            >
                              {module}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-black text-xs">{category.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-black font-bold text-lg">{sections[activeSection].title}</h2>
                  <p className="text-black text-sm mt-1">{sections[activeSection].description}</p>
                </div>

                <div
                  className="bg-white relative mb-4"
                  style={{
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <pre className="bg-white text-black p-0 font-mono text-xs overflow-auto whitespace-pre-wrap break-words relative">
                    <div className="py-3 px-0">
                      <code className="text-black leading-4">
                        {sections[activeSection].code.split("\n").map((line, i) => (
                          <div key={i} className="leading-4">
                            {line.replace(/\t/g, "    ") || " "}
                          </div>
                        ))}
                      </code>
                    </div>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(sections[activeSection].code, `section-${activeSection}`)}
                    className="absolute top-2 right-2 px-2 py-1 text-xs border text-black hover:bg-gray-300"
                    style={{
                      backgroundColor: "#c0c0c0",
                      borderTopColor: "#dfdfdf",
                      borderLeftColor: "#dfdfdf",
                      borderRightColor: "#808080",
                      borderBottomColor: "#808080",
                    }}
                  >
                    {copiedStates[`section-${activeSection}`] ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="mt-4">
                  <h3 className="text-black font-bold text-sm mb-2">Sample Use Cases:</h3>
                  <div
                    className="bg-white border border-gray-400 p-3 border-none px-0"
                    style={{
                      borderTopColor: "#808080",
                      borderLeftColor: "#808080",
                      borderRightColor: "#dfdfdf",
                      borderBottomColor: "#dfdfdf",
                    }}
                  >
                    <ul className="text-black text-xs space-y-1">
                      {sections[activeSection].useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-black mr-2">•</span>
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
