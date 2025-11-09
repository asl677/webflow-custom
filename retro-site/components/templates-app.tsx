"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { WindowFrame } from "./window-frame"
import { SplashScreen } from "./splash-screen"

interface TemplatesAppProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  isActive?: boolean
  size?: { width: number; height: number }
  publishedItems?: Array<{
    name: string
    type: string
    githubHandle: string
    version: string
    publishedAt: Date
  }>
  isDarkMode?: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onMaximize?: () => void
  onResize: (size: { width: number; height: number }) => void
  onOpenFactory?: (connectorName: string) => void
  onOpenSchemaWindow?: (item: any, activeTab: "connectors" | "pipelines" | "apps") => void
}

export function TemplatesApp({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  isActive,
  size,
  publishedItems = [],
  isDarkMode = false,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onMaximize,
  onResize,
  onOpenFactory,
  onOpenSchemaWindow,
  defaultTab,
}: TemplatesAppProps & { defaultTab?: "connectors" | "pipelines" | "apps" | "request" }) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const [activeTab, setActiveTab] = useState<"connectors" | "pipelines" | "apps" | "request">(
    defaultTab || "connectors",
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("All")

  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  const [recentlyPublished, setRecentlyPublished] = useState<Set<string>>(new Set())

  const [requestedConnectors, setRequestedConnectors] = useState<
    Array<{
      name: string
      type: string
      description: string
      requestedBy: string
      requestedAt: Date
    }>
  >([])

  const [requestFormData, setRequestFormData] = useState({
    connectorName: "",
    connectorType: "Database",
    description: "",
    requesterName: "",
    requesterEmail: "",
    priority: "Medium",
  })

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            setIsLoading(false)
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [isLoading])

  useEffect(() => {
    if (publishedItems.length > 0) {
      const latestItem = publishedItems[0]
      if (latestItem && latestItem.publishedAt) {
        const timeSincePublish = Date.now() - new Date(latestItem.publishedAt).getTime()

        console.log("[v0] Latest published item:", latestItem.name)
        console.log("[v0] Time since publish:", timeSincePublish, "ms")
        console.log("[v0] Should highlight:", timeSincePublish < 5000)

        // Only highlight if published within the last 5 seconds (just published)
        if (timeSincePublish < 5000) {
          console.log("[v0] Adding to recentlyPublished:", latestItem.name)
          setRecentlyPublished((prev) => new Set([...prev, latestItem.name]))

          // Remove highlight after 10 seconds
          setTimeout(() => {
            console.log("[v0] Removing from recentlyPublished:", latestItem.name)
            setRecentlyPublished((prev) => {
              const newSet = new Set(prev)
              newSet.delete(latestItem.name)
              return newSet
            })
          }, 10000)
        }
      }
    }
  }, [publishedItems])

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

  const openInFactory = (connectorName: string) => {
    if (onOpenFactory) {
      onOpenFactory(connectorName)
    } else {
      console.log(`Opening ${connectorName} in Factory`)
    }
  }

  const handleRowClick = (item: any) => {
    console.log("[v0] Registry row clicked:", item.name, "activeTab:", activeTab)
    console.log("[v0] Item data:", JSON.stringify(item, null, 2))
    console.log("[v0] onOpenSchemaWindow available:", !!onOpenSchemaWindow)
    if (onOpenSchemaWindow) {
      console.log("[v0] Calling onOpenSchemaWindow with item:", item)
      onOpenSchemaWindow(item, activeTab)
    } else {
      console.log("[v0] onOpenSchemaWindow callback is not available")
      alert(`Opening ${item.name} - Feature coming soon!`)
    }
  }

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRequest = {
      name: requestFormData.connectorName,
      type: requestFormData.connectorType,
      description: requestFormData.description,
      requestedBy: requestFormData.requesterName,
      requestedAt: new Date(),
    }

    setRequestedConnectors((prev) => [...prev, newRequest])

    setRequestFormData({
      connectorName: "",
      connectorType: "Database",
      description: "",
      requesterName: "",
      requesterEmail: "",
      priority: "Medium",
    })

    alert("Connector request submitted successfully!")
  }

  const handleRequestFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setRequestFormData({
      ...requestFormData,
      [e.target.name]: e.target.value,
    })
  }

  const getItemDetails = (item: any) => {
    const isConnector = activeTab === "connectors"

    if (isConnector) {
      return {
        scheme: `${item.type} Connector Schema`,
        lineage: `Data Source → ${item.name} → Target System`,
        installationCode: `npm install @connectors/${item.name.toLowerCase().replace(/\s+/g, "-")}`,
        setupGuide: `// 1. Install the connector
npm install @connectors/${item.name.toLowerCase().replace(/\s+/g, "-")}

// 2. Configure environment variables
${
  item.name.includes("PostgreSQL")
    ? "DATABASE_URL=<your_postgres_connection_string>"
    : item.name.includes("Redis")
      ? "REDIS_URL=<your_redis_connection_string>"
      : item.name.includes("Supabase")
        ? "SUPABASE_URL=<your_supabase_url>\nSUPABASE_ANON_KEY=<your_supabase_key>"
        : `${item.type.toUpperCase()}_API_KEY=<your_api_key>`
}

// 3. Initialize the connector
import { ${item.name.replace(/\s+/g, "")}Connector } from '@connectors/${item.name.toLowerCase().replace(/\s+/g, "-")}'

const connector = new ${item.name.replace(/\s+/g, "")}Connector({
  ${
    item.name.includes("PostgreSQL")
      ? "connectionString: 'YOUR_DATABASE_URL'"
      : item.name.includes("Redis")
        ? "url: 'YOUR_REDIS_URL'"
        : item.name.includes("Supabase")
          ? "url: 'YOUR_SUPABASE_URL',\\n  key: 'YOUR_SUPABASE_ANON_KEY'"
          : "apiKey: 'YOUR_" + item.type.toUpperCase() + "_API_KEY'"
  }
})

// 4. Use the connector
const result = await connector.connect()
console.log('Connected:', result)`,
      }
    } else {
      return {
        scheme: `${item.type} Pipeline Architecture`,
        lineage: `Input → Processing → Transformation → Output`,
        installationCode: `npm install @pipelines/${item.name.toLowerCase().replace(/\s+/g, "-")}`,
        setupGuide: `// 1. Install the pipeline
npm install @pipelines/${item.name.toLowerCase().replace(/\s+/g, "-")}

// 2. Configure pipeline settings
const pipelineConfig = {
  name: "${item.name}",
  type: "${item.type}",
  version: "${item.version}",
  ${
    item.type === "ETL"
      ? 'batchSize: 1000,\n  schedule: "0 */6 * * *"'
      : item.type === "Streaming"
        ? "bufferSize: 500,\n  flushInterval: 1000"
        : item.type === "Machine Learning"
          ? 'modelPath: "./models/",\n  epochs: 100'
          : "workers: 4,\n  timeout: 30000"
  }
}

// 3. Initialize the pipeline
import { ${item.name.replace(/\s+/g, "")}Pipeline } from '@pipelines/${item.name.toLowerCase().replace(/\s+/g, "-")}'

const pipeline = new ${item.name.replace(/\s+/g, "")}Pipeline(pipelineConfig)

// 4. Run the pipeline
await pipeline.start()
console.log('Pipeline started successfully')`,
      }
    }
  }

  const connectors = [
    {
      name: "PostgreSQL Connector",
      code: "// PostgreSQL Connector Example\n\nconst sql = createDatabaseConnection('YOUR_DATABASE_URL')\n\nexport async function connectPostgreSQL() {\n  try {\n    const result = await sql('SELECT version()')\n    console.log('Connected to PostgreSQL:', result[0].version)\n    return { success: true, connection: sql }\n  } catch (error) {\n    console.error('PostgreSQL connection failed:', error)\n    return { success: false, error }\n  }\n}",
    },
    {
      name: "Redis Connector",
      code: "// Redis Connector Example\n\nconst redis = createRedisClient({\n  url: 'YOUR_KV_REST_API_URL',\n  token: 'YOUR_KV_REST_API_TOKEN',\n})\n\nexport async function connectRedis() {\n  try {\n    await redis.ping()\n    console.log('Connected to Redis successfully')\n    return { success: true, connection: redis }\n  } catch (error) {\n    console.error('Redis connection failed:', error)\n    return { success: false, error }\n  }\n}",
    },
  ]

  const pipelines = [
    {
      name: "Data Ingestion Pipeline",
      code: "export async function dataIngestionPipeline(source: string, destination: string) {\n  const pipeline = {\n    extract: async () => {\n      console.log('Extracting data from ' + source)\n      // Extract logic here\n      return await fetchSourceData(source)\n    },\n    \n    transform: async (data: any[]) => {\n      console.log('Transforming data...')\n      return data.map(record => ({\n        ...record,\n        processed_at: new Date().toISOString(),\n        source: source\n      }))\n    },\n    \n    load: async (transformedData: any[]) => {\n      console.log('Loading data to ' + destination)\n      // Load logic here\n      return await saveToDestination(destination, transformedData)\n    }\n  }\n  \n  try {\n    const rawData = await pipeline.extract()\n    const transformedData = await pipeline.transform(rawData)\n    const result = await pipeline.load(transformedData)\n    \n    return { success: true, recordsProcessed: result.count }\n  } catch (error) {\n    console.error('Pipeline failed:', error)\n    return { success: false, error }\n  }\n}",
    },
    {
      name: "Real-time Stream Pipeline",
      code: "import { EventEmitter } from 'events'\n\nexport class StreamPipeline extends EventEmitter {\n  private isRunning = false\n  \n  constructor(private config: any) {\n    super()\n  }\n  \n  async start() {\n    this.isRunning = true\n    console.log('Starting stream pipeline...')\n    \n    while (this.isRunning) {\n      try {\n        const batch = await this.consumeBatch()\n        \n        if (batch.length > 0) {\n          const processed = await this.processBatch(batch)\n          await this.publishResults(processed)\n          \n          this.emit('batch-processed', {\n            count: batch.length,\n            timestamp: new Date()\n          })\n        }\n        \n        await this.sleep(this.config.batchInterval || 1000)\n      } catch (error) {\n        this.emit('error', error)\n        await this.sleep(5000) // Wait before retry\n      }\n    }\n  }\n  \n  stop() {\n    this.isRunning = false\n    console.log('Stream pipeline stopped')\n  }\n  \n  private async processBatch(batch: any[]) {\n    return batch.map(item => ({\n      ...item,\n      processed: true,\n      timestamp: new Date().getTime()\n    }))\n  }\n  \n  private async consumeBatch() {\n    // Simulate batch consumption\n    return new Promise<any[]>(resolve => resolve([]))\n  }\n  \n  private async publishResults(results: any[]) {\n    // Simulate result publishing\n    console.log('Publishing results:', results)\n  }\n  \n  private async sleep(ms: number) {\n    return new Promise(resolve => setTimeout(resolve, ms))\n  }\n}",
    },
    {
      name: "ML Training Pipeline",
      code: "export async function mlTrainingPipeline(modelConfig: any) {\n  const stages = {\n    dataPrep: async () => {\n      console.log('Preparing training data...')\n      const rawData = await loadTrainingData(modelConfig.dataSource)\n      return preprocessData(rawData, modelConfig.features)\n    },\n    \n    training: async (preparedData: any) => {\n      console.log('Training model...')\n      const model = createModel(modelConfig.architecture)\n      \n      for (let epoch = 0; epoch < modelConfig.epochs; epoch++) {\n        const loss = await model.train(preparedData)\n        console.log('Epoch ' + (epoch + 1) + '/' + modelConfig.epochs + ', Loss: ' + loss)\n        \n        if (epoch % 10 === 0) {\n          await saveCheckpoint(model, epoch)\n        }\n      }\n      \n      return model\n    },\n    \n    validation: async (model: any) => {\n      console.log('Validating model...')\n      const testData = await loadTestData(modelConfig.testSource)\n      const metrics = await evaluateModel(model, testData)\n      \n      return {\n        accuracy: metrics.accuracy,\n        precision: metrics.precision,\n        recall: metrics.recall,\n        f1Score: metrics.f1Score\n      }\n    },\n    \n    deployment: async (model: any, metrics: any) => {\n      if (metrics.accuracy > modelConfig.minAccuracy) {\n        console.log('Deploying model to production...')\n        return await deployModel(model, modelConfig.deploymentTarget)\n      } else {\n        throw new Error('Model accuracy ' + metrics.accuracy + ' below threshold ' + modelConfig.minAccuracy)\n      }\n    }\n  }\n  \n  try {\n    const data = await stages.dataPrep()\n    const model = await stages.training(data)\n    const metrics = await stages.validation(model)\n    const deployment = await stages.deployment(model, metrics)\n    \n    return {\n      success: true,\n      modelId: deployment.modelId,\n      metrics,\n      deploymentUrl: deployment.url\n    }\n  } catch (error) {\n    console.error('ML Pipeline failed:', error)\n    return { success: false, error }\n  }\n}",
    },
  ]

  const getBrandLogo = (name: string) => {
    return null
  }

  const renderRequestForm = () => {
    return (
      <div className="h-full flex flex-col">
        <div
          className="flex-1 overflow-y-auto"
          style={{
            maxHeight: isMaximized ? "none" : "calc(100% - 40px)",
          }}
        >
          <form onSubmit={handleRequestSubmit} className="space-y-3">
            <div className="flex flex-col">
              <label htmlFor="connectorName" className="text-sm text-black mb-1">
                Connector Name
              </label>
              <input
                type="text"
                id="connectorName"
                name="connectorName"
                value={requestFormData.connectorName}
                onChange={handleRequestFormChange}
                className="px-2 py-1 text-sm text-black"
                style={{
                  backgroundColor: "#ffffff",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderTopColor: "#808080",
                  borderLeftColor: "#808080",
                  borderRightColor: "#dfdfdf",
                  borderBottomColor: "#dfdfdf",
                }}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="connectorType" className="text-sm text-black mb-1">
                Connector Type
              </label>
              <select
                id="connectorType"
                name="connectorType"
                value={requestFormData.connectorType}
                onChange={handleRequestFormChange}
                className="px-2 py-1 text-sm text-black"
                style={{
                  backgroundColor: "#ffffff",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderTopColor: "#808080",
                  borderLeftColor: "#808080",
                  borderRightColor: "#dfdfdf",
                  borderBottomColor: "#dfdfdf",
                }}
                required
              >
                <option value="Database">Database</option>
                <option value="CRM">CRM</option>
                <option value="Cache">Cache</option>
                <option value="Payment">Payment</option>
                <option value="Storage">Storage</option>
                <option value="Search">Search</option>
                <option value="Streaming">Streaming</option>
                <option value="Warehouse">Warehouse</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Analytics">Analytics</option>
                <option value="ETL">ETL</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Quality">Quality</option>
                <option value="Integration">Integration</option>
                <option value="Sync">Sync</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm text-black mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={requestFormData.description}
                onChange={handleRequestFormChange}
                className="px-2 py-1 text-sm text-black h-16 resize-none"
                style={{
                  backgroundColor: "#ffffff",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderTopColor: "#808080",
                  borderLeftColor: "#808080",
                  borderRightColor: "#dfdfdf",
                  borderBottomColor: "#dfdfdf",
                }}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="requesterName" className="text-sm text-black mb-1">
                Author
              </label>
              <input
                type="text"
                id="requesterName"
                name="requesterName"
                value={requestFormData.requesterName}
                onChange={handleRequestFormChange}
                className="px-2 py-1 text-sm text-black"
                style={{
                  backgroundColor: "#ffffff",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderTopColor: "#808080",
                  borderLeftColor: "#808080",
                  borderRightColor: "#dfdfdf",
                  borderBottomColor: "#dfdfdf",
                }}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="requesterEmail" className="text-sm text-black ml-2" style={{ fontWeight: "normal" }}>
                Requester Email
              </label>
              <input
                type="email"
                id="requesterEmail"
                name="requesterEmail"
                value={requestFormData.requesterEmail}
                onChange={handleRequestFormChange}
                className="px-2 py-1 text-sm text-black"
                style={{
                  backgroundColor: "#ffffff",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderTopColor: "#808080",
                  borderLeftColor: "#808080",
                  borderRightColor: "#dfdfdf",
                  borderBottomColor: "#dfdfdf",
                }}
                required
              />
            </div>
          </form>
        </div>
        <div
          className="border-t flex justify-end"
          style={{
            backgroundColor: "#c0c0c0",
            borderTopColor: "#808080",
            padding: "4px 8px",
            height: "40px",
            flexShrink: 0,
          }}
        >
          <button
            type="submit"
            onClick={handleRequestSubmit}
            className="px-4 py-1 text-sm text-black"
            style={{
              backgroundColor: "#c0c0c0",
              borderWidth: "2px",
              borderStyle: "solid",
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.borderTopColor = "#808080"
              e.currentTarget.style.borderLeftColor = "#808080"
              e.currentTarget.style.borderRightColor = "#dfdfdf"
              e.currentTarget.style.borderBottomColor = "#dfdfdf"
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.borderTopColor = ""
              e.currentTarget.style.borderLeftColor = ""
              e.currentTarget.style.borderRightColor = ""
              e.currentTarget.style.borderBottomColor = ""
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderTopColor = ""
              e.currentTarget.style.borderLeftColor = ""
              e.currentTarget.style.borderRightColor = ""
              e.currentTarget.style.borderBottomColor = ""
            }}
          >
            Submit Request
          </button>
        </div>
      </div>
    )
  }

  const renderTabs = () => {
    const tabs = [
      { id: "connectors", label: "Connectors" },
      { id: "pipelines", label: "Pipelines" },
      { id: "apps", label: "Apps" },
      { id: "request", label: "Request" },
    ] as const

    return (
      <div
        className="flex border-gray-400 border-b-0 border-none"
        style={{
          backgroundColor: "#c0c0c0",
          borderBottomColor: "#808080",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-3 py-1 text-sm text-black hover:bg-gray-300"
            style={{
              backgroundColor: activeTab === tab.id ? "#a0a0a0" : "transparent",
              border: "none",
              outline: "none",
              boxShadow: "none",
              fontFamily: "MS Sans Serif, sans-serif",
              fontWeight: "normal",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    )
  }

  const getTableData = () => {
    switch (activeTab) {
      case "connectors":
        return [
          ...publishedItems.map((item) => ({
            name: item.name,
            type: item.type,
            githubHandle: item.githubHandle,
            version: item.version,
            isNew: true,
          })),
          ...requestedConnectors.map((item) => ({
            name: item.name,
            type: item.type,
            githubHandle: item.requestedBy,
            version: "Requested",
            isRequested: true,
          })),
          { name: "Google Analytics", type: "Analytics", githubHandle: "@514-labs", version: "4.0.0" },
          { name: "Shopify", type: "E-commerce", githubHandle: "@sarah-chen", version: "2.1.0" },
          { name: "Stripe", type: "Payment", githubHandle: "@514-labs", version: "2.3.0" },
          { name: "PostgreSQL", type: "Database", githubHandle: "@mike-rodriguez", version: "2.1.0" },
          { name: "HubSpot", type: "CRM", githubHandle: "@514-labs", version: "1.2.4" },
          { name: "Salesforce", type: "CRM", githubHandle: "@alex-thompson", version: "1.3.1" },
          { name: "MongoDB", type: "Database", githubHandle: "@514-labs", version: "3.2.1" },
          { name: "MySQL", type: "Database", githubHandle: "@jessica-kim", version: "2.0.8" },
          { name: "S3", type: "Storage", githubHandle: "@514-labs", version: "1.5.2" },
          { name: "GCS", type: "Storage", githubHandle: "@david-wilson", version: "1.3.1" },
          { name: "Azure Blob", type: "Storage", githubHandle: "@514-labs", version: "1.2.4" },
          { name: "Redis", type: "Cache", githubHandle: "@emily-davis", version: "1.0.5" },
          { name: "Elasticsearch", type: "Search", githubHandle: "@ryan-martinez", version: "2.1.7" },
          { name: "Kafka", type: "Streaming", githubHandle: "@514-labs", version: "1.8.3" },
          { name: "Snowflake", type: "Warehouse", githubHandle: "@lisa-anderson", version: "1.3.5" },
          { name: "ClickHouse", type: "Warehouse", githubHandle: "@514-labs", version: "2.0.1" },
          { name: "BigQuery", type: "Warehouse", githubHandle: "@james-taylor", version: "1.7.3" },
          { name: "Redshift", type: "Warehouse", githubHandle: "@514-labs", version: "1.5.8" },
          { name: "Databricks", type: "Analytics", githubHandle: "@maria-garcia", version: "1.4.2" },
        ]
      case "pipelines":
        return [
          { name: "GA4 to ClickHouse", type: "ETL", githubHandle: "@514-labs", version: "4.0.1" },
          { name: "Shopify Orders to Warehouse", type: "ETL", githubHandle: "@tom-johnson", version: "2.1.0" },
          { name: "Stripe Events to Analytics", type: "Streaming", githubHandle: "@514-labs", version: "2.3.1" },
          { name: "HubSpot CRM Sync", type: "Sync", githubHandle: "@anna-brown", version: "1.2.4" },
          { name: "Real-time Event Processing", type: "Streaming", githubHandle: "@514-labs", version: "2.5.1" },
          { name: "Data Validation Pipeline", type: "Quality", githubHandle: "@kevin-lee", version: "1.3.2" },
          { name: "ML Feature Pipeline", type: "Machine Learning", githubHandle: "@514-labs", version: "1.1.0" },
          { name: "CDC to ClickHouse", type: "CDC", githubHandle: "@sophie-white", version: "1.4.3" },
          { name: "API to Warehouse ETL", type: "ETL", githubHandle: "@514-labs", version: "1.7.2" },
          { name: "Multi-source Data Sync", type: "Sync", githubHandle: "@carlos-lopez", version: "1.5.6" },
          { name: "Event Stream Analytics", type: "Analytics", githubHandle: "@514-labs", version: "2.1.8" },
          { name: "Data Lineage Tracker", type: "Governance", githubHandle: "@rachel-clark", version: "1.2.0" },
          { name: "Batch Processing Pipeline", type: "ETL", githubHandle: "@514-labs", version: "2.0.5" },
          { name: "Cross-platform Integration", type: "Integration", githubHandle: "@daniel-moore", version: "1.6.1" },
        ]
      case "apps":
        return [
          {
            name: "User Facing Analytics",
            type: "Multi-Modal Backend",
            githubHandle: "@514-labs",
            version: "2.1.0",
            description:
              "Combines transactional (PostgreSQL), analytical (ClickHouse), and search (Elasticsearch) with real-time data sync",
          },
          {
            name: "Operational Datawarehouse",
            type: "Data Warehouse",
            githubHandle: "@514-labs",
            version: "1.8.0",
            description: "Moose framework for ingesting data from Blobs, Events, and Logs into ClickHouse",
          },
        ]
      default:
        return []
    }
  }

  const renderTable = () => {
    const data = getTableData()

    return (
      <div className="flex flex-col h-full !shadow-none">
        {renderTabs()}
        <div
          className="flex flex-col flex-1 mx-2 overflow-hidden bg-transparent mx-0 !border-none !shadow-none px-0 my-0"
          style={{
            backgroundColor: "#ffffff",
            borderTop: "2px solid #808080",
            borderLeft: "2px solid #808080",
            borderBottom: "2px solid #dfdfdf",
            borderRight: "2px solid #dfdfdf",
          }}
        >
          <div
            className="flex items-center gap-2 p-2 border-none border-b-0 shadow-none"
            style={{ backgroundColor: "#c0c0c0" }}
          >
            <label className="text-sm text-black">Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="px-2 py-1 text-sm text-black flex-1"
              style={{
                backgroundColor: "#ffffff",
                borderWidth: "2px",
                borderStyle: "solid",
                borderTopColor: "#808080",
                borderLeftColor: "#808080",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
                fontFamily: "MS Sans Serif, sans-serif",
              }}
            />
            <label className="text-sm text-black">Filter:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2 py-1 text-sm text-black"
              style={{
                backgroundColor: "#ffffff",
                borderWidth: "2px",
                borderStyle: "solid",
                borderTopColor: "#808080",
                borderLeftColor: "#808080",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
                fontFamily: "MS Sans Serif, sans-serif",
              }}
            >
              <option value="All">All</option>
              {Array.from(new Set(data.map((item) => item.type))).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#c0c0c0" }}>
                  <th className="text-left border-r border-gray-400 text-black px-2 py-1 font-normal">Name</th>
                  <th className="text-left border-r border-gray-400 text-black px-2 py-1 font-normal">Type</th>
                  <th className="text-left border-r border-gray-400 text-black px-2 py-1 font-normal">Author</th>
                  <th className="text-left border-r border-gray-400 text-black px-2 py-1 font-normal">Version</th>
                  <th className="text-left text-black px-2 py-1 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter(
                    (item) =>
                      (filterType === "All" || item.type === filterType) &&
                      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((item, index) => {
                    const isHighlighted = recentlyPublished.has(item.name)
                    const rowStyle: React.CSSProperties = isHighlighted
                      ? {
                          backgroundColor: "#ffff00", // Bright yellow
                        }
                      : {}

                    return (
                      <tr
                        key={index}
                        className="cursor-pointer"
                        style={rowStyle}
                        onClick={() => handleRowClick(item)}
                        onMouseEnter={(e) => {
                          if (!isHighlighted) {
                            e.currentTarget.style.backgroundColor = "#f0f0f0"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isHighlighted) {
                            e.currentTarget.style.backgroundColor = "#ffffff"
                          } else {
                            e.currentTarget.style.backgroundColor = "#ffff00"
                          }
                        }}
                      >
                        <td className="text-black text-xs py-1 px-2">{item.name}</td>
                        <td className="text-black text-xs py-1 px-2">{item.type}</td>
                        <td className="text-black text-xs py-1 px-2">{item.githubHandle}</td>
                        <td className="text-black text-xs py-1 px-2">{item.version}</td>
                        <td className="text-black text-xs py-1 px-2">
                          <div className="flex gap-5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openInFactory(item.name)
                              }}
                              className="registry-link"
                            >
                              Factory
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                let githubUrl = ""
                                if (
                                  item.name === "User Facing Analytics" ||
                                  item.name === "Operational Datawarehouse"
                                ) {
                                  githubUrl = "https://github.com/514-labs/area-code"
                                } else {
                                  const repoName = item.name.toLowerCase().replace(/\s+/g, "-")
                                  githubUrl = `https://github.com/514-labs/registry/${repoName}`
                                }
                                window.open(githubUrl, "_blank")
                              }}
                              className="registry-link"
                            >
                              Github
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <WindowFrame
      id={id}
      title="Registry - Connector & Pipeline Templates"
      icon="/icons/cable_2-0.png"
      position={position}
      zIndex={zIndex}
      size={{ width: 600, height: 500 }}
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
    >
      {isLoading ? (
        <SplashScreen
          title="Registry"
          version="1.0"
          image="/images/registry-splash.jpg"
          description="A starter kit for building, testing and sharing the components you need to build out a scalable analytical system. Frontend teams have used design systems and components thinking for years, we're now bringing that to analytics. Heavily inspired by Shadcn/ui."
          copyright="© 514 all rights reserved 2025"
          company="Global"
          progress={loadingProgress}
        />
      ) : (
        <div
          className="flex flex-col h-full"
          style={{
            backgroundColor: "#c0c0c0",
          }}
        >
          {activeTab === "request" ? (
            <div className="flex flex-col h-full">
              {renderTabs()}
              <div className="flex-1 p-4 overflow-hidden">{renderRequestForm()}</div>
            </div>
          ) : (
            renderTable()
          )}
        </div>
      )}
    </WindowFrame>
  )
}
