"use client"

import { useState, useEffect } from "react"
import { WindowFrame } from "./window-frame"
import { Win95MenuBar } from "./win95-menubar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface HostingDashboardProps {
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
  onMaximize: () => void
  onResize: (size: { width: number; height: number }) => void
}

export function HostingDashboard({
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
}: HostingDashboardProps) {
  const [modalState, setModalState] = useState<"options" | "loading" | "dashboard">("options")
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [loadingPhase, setLoadingPhase] = useState<"connecting" | "deploying">("connecting")
  const [loadingProgress, setLoadingProgress] = useState(0)

  const [activeTab, setActiveTab] = useState("overview")
  const [selectedProject, setSelectedProject] = useState("data-warehouse-514")
  const [isDeploying, setIsDeploying] = useState(false)
  const [metrics, setMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 67,
    networkTraffic: 234,
    activeConnections: 1247,
  })

  const projects = [
    { id: "data-warehouse-514", name: "514 Data Warehouse", domain: "app.514/data-warehouse/" },
    { id: "analytics-514", name: "514 Analytics", domain: "app.514/analytics/" },
    { id: "moose-stack-514", name: "514 MooseStack", domain: "app.514/moose-stack/" },
    { id: "registry-514", name: "514 Registry", domain: "app.514/registry/" },
  ]

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    setModalState("loading")
    setLoadingProgress(0)
    setLoadingPhase("connecting")
  }

  useEffect(() => {
    if (modalState !== "loading") return

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        // Switch to deploying phase at 50%
        if (prev >= 50 && loadingPhase === "connecting") {
          setLoadingPhase("deploying")
        }

        // Complete at 100%
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => setModalState("dashboard"), 300)
          return 100
        }

        return prev + Math.random() * 8 + 2
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [modalState, loadingPhase])

  // Removed the old isLoading and loadingProgress state and effect

  const handleDeploy = async () => {
    setIsDeploying(true)
    setTimeout(() => {
      setIsDeploying(false)
    }, 3000)
  }

  const handleAddProject = () => {
    window.postMessage({ type: "openAddProject" }, "*")
  }

  const handleAddSampleMooseApp = () => {
    console.log("[v0] Adding Sample Moose App")
    window.postMessage({ type: "addSampleMooseApp" }, "*")
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        cpuUsage: Math.max(10, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(20, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        networkTraffic: Math.max(100, Math.min(500, prev.networkTraffic + (Math.random() - 0.5) * 50)),
        activeConnections: Math.max(
          800,
          Math.min(2000, prev.activeConnections + Math.floor((Math.random() - 0.5) * 100)),
        ),
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (modalState === "options") {
    return (
      <WindowFrame
        id={id}
        title="New Hosting Project"
        icon="/icons/hosting-icon.png"
        position={position}
        size={size || { width: 400, height: 300 }}
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
      >
        <div className="h-full flex flex-col items-center justify-center p-6" style={{ backgroundColor: "#c0c0c0" }}>
          <div className="mb-6">
            <img src="/icons/hosting-icon.png" alt="Hosting" className="w-20 h-20" />
          </div>
          <div className="text-center mb-6"></div>
          <div className="flex flex-col w-full max-w-xs gap-0">
            {["From ClickHouse", "Import existing", "Template", "Blank"].map((option) => (
              <button key={option} onClick={() => handleOptionSelect(option)} className="hosting-option-button">
                {option}
              </button>
            ))}
          </div>
        </div>
      </WindowFrame>
    )
  }

  if (modalState === "loading") {
    return (
      <WindowFrame
        id={id}
        title={loadingPhase === "connecting" ? "Connecting..." : "Deploying"}
        icon="/icons/hosting-icon.png"
        position={position}
        size={size || { width: 400, height: 250 }}
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
      >
        <div className="h-full flex flex-col items-center justify-center p-6" style={{ backgroundColor: "#c0c0c0" }}>
          <div className="mb-6">
            <img src="/icons/hosting-icon.png" alt="Hosting" className="w-12 h-12" />
          </div>
          <div className="text-center mb-6">
            <div className="text-black text-sm font-bold mb-2">
              {loadingPhase === "connecting" ? "Connecting to hosting service..." : "Deploying your project..."}
            </div>
            <div className="text-black text-xs mb-4">{selectedOption}</div>
          </div>
          <div className="w-full max-w-xs">
            <div
              className="w-full h-4 border-2 overflow-hidden"
              style={{
                borderTopColor: "#555",
                borderLeftColor: "#555",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
                backgroundColor: "#808080",
              }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${loadingProgress}%`,
                  backgroundColor: "var(--win95-blue)",
                  maxWidth: "100%",
                }}
              />
            </div>
            <div className="text-black text-xs mt-2 text-center">{Math.round(loadingProgress)}%</div>
          </div>
        </div>
      </WindowFrame>
    )
  }

  return (
    <WindowFrame
      id={id}
      title="Hosting Dashboard"
      icon="/icons/hosting-icon.png"
      position={position}
      size={size || { width: 500, height: 400 }}
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
    >
      <div className="h-full flex flex-col px-1">
        <Win95MenuBar
          items={[
            {
              label: "File",
              items: [
                { label: "New Project", onClick: () => {} },
                { label: "Open Project", onClick: () => {}, shortcut: "Ctrl+O" },
                { type: "separator" },
                { label: "Save Configuration", onClick: () => {}, shortcut: "Ctrl+S" },
                { label: "Export Settings", onClick: () => {} },
                { type: "separator" },
                { label: "Exit", onClick: onClose },
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
              ],
            },
            {
              label: "View",
              items: [
                { label: "Overview", onClick: () => setActiveTab("overview") },
                { label: "Deployments", onClick: () => setActiveTab("deployments") },
                { label: "Monitoring", onClick: () => setActiveTab("monitoring") },
                { label: "Settings", onClick: () => setActiveTab("settings") },
                { type: "separator" },
                { label: "Refresh", onClick: () => {}, shortcut: "F5" },
              ],
            },
            {
              label: "Deploy",
              items: [
                { label: "Deploy Now", onClick: () => {} },
                { label: "Rollback", onClick: () => {} },
                { type: "separator" },
                { label: "View Logs", onClick: () => {} },
                { label: "Check Status", onClick: () => {} },
              ],
            },
            {
              label: "Help",
              items: [
                { label: "Hosting Help", onClick: () => {} },
                { label: "Keyboard Shortcuts", onClick: () => {} },
                { type: "separator" },
                { label: "About Hosting Dashboard", onClick: () => {} },
              ],
            },
          ]}
        />
        <div className="flex border-gray-400 sticky top-0 z-10 bg-win95-window border-b-0">
          <button
            className={`px-3 py-1 text-sm transition-colors hover:bg-gray-300 active:bg-gray-400 text-black ${
              activeTab === "overview" ? "win95-tab-active" : ""
            }`}
            style={{
              backgroundColor: activeTab === "overview" ? "#a0a0a0" : "#c0c0c0",
              border: "none",
            }}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-3 py-1 text-sm transition-colors hover:bg-gray-300 active:bg-gray-400 text-black ${
              activeTab === "deployments" ? "win95-tab-active" : ""
            }`}
            style={{
              backgroundColor: activeTab === "deployments" ? "#a0a0a0" : "#c0c0c0",
              border: "none",
            }}
            onClick={() => setActiveTab("deployments")}
          >
            Deployments
          </button>
          <button
            className={`px-3 py-1 text-sm transition-colors hover:bg-gray-300 active:bg-gray-400 text-black ${
              activeTab === "database" ? "win95-tab-active" : ""
            }`}
            style={{
              backgroundColor: activeTab === "database" ? "#a0a0a0" : "#c0c0c0",
              border: "none",
            }}
            onClick={() => setActiveTab("database")}
          >
            Database
          </button>
          <button
            className={`px-3 py-1 text-sm transition-colors hover:bg-gray-300 active:bg-gray-400 text-black ${
              activeTab === "streaming" ? "win95-tab-active" : ""
            }`}
            style={{
              backgroundColor: activeTab === "streaming" ? "#a0a0a0" : "#c0c0c0",
              border: "none",
            }}
            onClick={() => setActiveTab("streaming")}
          >
            Streaming
          </button>
          <button
            className={`px-3 py-1 text-sm transition-colors hover:bg-gray-300 active:bg-gray-400 text-black ${
              activeTab === "workflows" ? "win95-tab-active" : ""
            }`}
            style={{
              backgroundColor: activeTab === "workflows" ? "#a0a0a0" : "#c0c0c0",
              border: "none",
            }}
            onClick={() => setActiveTab("workflows")}
          >
            Workflows
          </button>
          <button
            className={`px-3 py-1 text-sm transition-colors hover:bg-gray-300 active:bg-gray-400 text-black ${
              activeTab === "api" ? "win95-tab-active" : ""
            }`}
            style={{
              backgroundColor: activeTab === "api" ? "#a0a0a0" : "#c0c0c0",
              border: "none",
            }}
            onClick={() => setActiveTab("api")}
          >
            API
          </button>
          <button
            className={`px-3 py-1 text-sm transition-colors hover:bg-gray-300 active:bg-gray-400 text-black ${
              activeTab === "logs" ? "win95-tab-active" : ""
            }`}
            style={{
              backgroundColor: activeTab === "logs" ? "#a0a0a0" : "#c0c0c0",
              border: "none",
            }}
            onClick={() => setActiveTab("logs")}
          >
            Logs
          </button>
          <button
            className={`px-3 py-1 text-sm transition-colors hover:bg-gray-300 active:bg-gray-400 text-black ${
              activeTab === "settings" ? "win95-tab-active" : ""
            }`}
            style={{
              backgroundColor: activeTab === "settings" ? "#a0a0a0" : "#c0c0c0",
              border: "none",
            }}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>

          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="px-3 py-1 text-sm font-bold text-black border-2 mr-1 hover:bg-gray-400"
                style={{
                  backgroundColor: "white",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                +
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-win95-window border-2 border-win95-border-inset text-black"
              style={{
                backgroundColor: "white",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              <DropdownMenuItem
                onClick={handleAddProject}
                className="hover:bg-win95-titlebar hover:text-white cursor-pointer"
              >
                Add Project
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleAddSampleMooseApp}
                className="hover:bg-win95-titlebar hover:text-white cursor-pointer"
              >
                Sample Moose App
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("[v0] Import from Git")}
                className="hover:bg-win95-titlebar hover:text-white cursor-pointer"
              >
                Import from Git
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            className="px-4 py-1 text-sm font-bold text-black border-2 mr-2 hover:bg-gray-400 flex items-center gap-2 bg-muted"
            style={{
              backgroundColor: "#c0c0c0",
              borderTopColor: "#dfdfdf",
              borderLeftColor: "#dfdfdf",
              borderRightColor: "#808080",
              borderBottomColor: "#808080",
            }}
            onClick={handleDeploy}
            disabled={isDeploying}
          >
            {isDeploying && (
              <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
            )}
            {isDeploying ? "Deploying..." : "Deploy"}
          </button>
        </div>

        <div className="bg-win95-window p-3 ">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-black">Project:</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-2 py-1 border-2 text-black text-sm min-w-0 flex-1"
              style={{
                backgroundColor: "white",
                borderTopColor: "#808080",
                borderLeftColor: "#808080",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.domain})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto p-4 !bg-transparent"
          style={{
            borderTopColor: "#808080",
            borderLeftColor: "#808080",
            borderRightColor: "#dfdfdf",
            borderBottomColor: "#808080",
            boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #808080, inset -2px -2px #dfdfdf, inset 2px 2px #000000",
          }}
        >
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div
                  className="border-2 p-2 text-center"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-lg font-bold text-black">{metrics.cpuUsage.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600">CPU Usage</div>
                </div>
                <div
                  className="border-2 p-2 text-center"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-lg font-bold text-black">{metrics.memoryUsage.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600">Memory</div>
                </div>
                <div
                  className="border-2 p-2 text-center"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-lg font-bold text-black">{metrics.networkTraffic.toFixed(0)}</div>
                  <div className="text-xs text-gray-600">MB/s</div>
                </div>
                <div
                  className="border-2 p-2 text-center"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-lg font-bold text-black">{metrics.activeConnections}</div>
                  <div className="text-xs text-gray-600">Connections</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div
                  className="border-2 p-2"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">CPU Usage Over Time</div>
                  <div className="h-20 bg-black dark:bg-black font-mono text-white text-xs p-2">
                    <div className="flex items-end h-full gap-1">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-green-400 dark:bg-white w-1"
                          style={{
                            height: `${Math.random() * metrics.cpuUsage}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className="border-2 p-2"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">Memory Usage Over Time</div>
                  <div className="h-20 bg-black dark:bg-black font-mono text-white text-xs p-2">
                    <div className="flex items-end h-full gap-1">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-blue-400 dark:bg-white w-1"
                          style={{
                            height: `${Math.random() * metrics.memoryUsage}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">Active Processes</div>
                  <div className="space-y-1">
                    {[
                      { name: "node.js", cpu: "12.3%", memory: "45MB" },
                      { name: "nginx", cpu: "2.1%", memory: "8MB" },
                      { name: "postgres", cpu: "5.7%", memory: "128MB" },
                    ].map((process, i) => (
                      <div key={i} className="flex justify-between text-xs text-black">
                        <span>{process.name}</span>
                        <span>{process.cpu}</span>
                        <span>{process.memory}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">Recent Requests</div>
                  <div className="space-y-1">
                    {[
                      { path: "/api/users", status: "200", time: "45ms" },
                      { path: "/dashboard", status: "200", time: "123ms" },
                      { path: "/api/data", status: "404", time: "12ms" },
                    ].map((request, i) => (
                      <div key={i} className="flex justify-between text-xs text-black">
                        <span>{request.path}</span>
                        <span className={request.status === "200" ? "text-green-600" : "text-red-600"}>
                          {request.status}
                        </span>
                        <span>{request.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "deployments" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black mb-4">Recent Deployments</h3>
              <div className="space-y-2">
                {[
                  { name: "Production v2.1.4", status: "Active", time: "2 hours ago" },
                  { name: "Staging v2.1.5", status: "Building", time: "5 minutes ago" },
                  { name: "Development v2.2.0", status: "Failed", time: "1 day ago" },
                ].map((deployment, i) => (
                  <div
                    key={i}
                    className="border-2 p-3 flex justify-between items-center"
                    style={{
                      backgroundColor: "#c0c0c0",
                      borderTopColor: "#808080",
                      borderLeftColor: "#808080",
                      borderRightColor: "#dfdfdf",
                      borderBottomColor: "#dfdfdf",
                    }}
                  >
                    <div>
                      <div className="font-bold text-black">{deployment.name}</div>
                      <div className="text-sm text-gray-600">{deployment.time}</div>
                    </div>
                    <div
                      className={`px-2 py-1 text-xs font-bold ${
                        deployment.status === "Active"
                          ? "bg-green-200 text-green-800"
                          : deployment.status === "Building"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                      }`}
                    >
                      {deployment.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "database" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black mb-4">Database Management</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">Connection Status</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-black">
                      <span>PostgreSQL</span>
                      <span className="text-green-600">Connected</span>
                    </div>
                    <div className="flex justify-between text-xs text-black">
                      <span>Redis Cache</span>
                      <span className="text-green-600">Connected</span>
                    </div>
                    <div className="flex justify-between text-xs text-black">
                      <span>MongoDB</span>
                      <span className="text-yellow-600">Idle</span>
                    </div>
                  </div>
                </div>
                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">Storage Usage</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-black">
                      <span>Used</span>
                      <span>2.4 GB</span>
                    </div>
                    <div className="flex justify-between text-xs text-black">
                      <span>Available</span>
                      <span>7.6 GB</span>
                    </div>
                    <div className="w-full bg-gray-300 h-2 border border-gray-400">
                      <div className="bg-win95-titlebar h-full" style={{ width: "24%" }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-black">Recent Queries</h4>
                {[
                  { query: "SELECT * FROM users WHERE active = true", time: "2ms", status: "Success" },
                  { query: "UPDATE orders SET status = 'shipped'", time: "15ms", status: "Success" },
                  { query: "INSERT INTO logs (message, timestamp)", time: "1ms", status: "Success" },
                ].map((query, i) => (
                  <div
                    key={i}
                    className="border-2 p-2 text-xs"
                    style={{
                      backgroundColor: "white",
                      borderTopColor: "#808080",
                      borderLeftColor: "#808080",
                      borderRightColor: "#dfdfdf",
                      borderBottomColor: "#808080",
                    }}
                  >
                    <div className="font-mono text-black truncate">{query.query}</div>
                    <div className="flex justify-between text-gray-600 mt-1">
                      <span>{query.time}</span>
                      <span className="text-green-600">{query.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "streaming" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black mb-4">Data Streaming</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">Active Streams</div>
                  <div className="space-y-2">
                    {[
                      { name: "user-events", rate: "1.2k/sec", status: "Active" },
                      { name: "order-updates", rate: "450/sec", status: "Active" },
                      { name: "system-logs", rate: "2.8k/sec", status: "Active" },
                    ].map((stream, i) => (
                      <div key={i} className="flex justify-between text-xs text-black">
                        <span>{stream.name}</span>
                        <span>{stream.rate}</span>
                        <span className="text-green-600">{stream.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">Throughput</div>
                  <div className="h-20 bg-black font-mono text-white text-xs p-2">
                    <div className="flex items-end h-full gap-1">
                      {Array.from({ length: 15 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-yellow-400 w-2"
                          style={{
                            height: `${Math.random() * 80 + 20}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-black">Stream Health</h4>
                {[
                  { stream: "user-events", latency: "12ms", errors: "0", backlog: "0" },
                  { stream: "order-updates", latency: "8ms", errors: "2", backlog: "45" },
                  { stream: "system-logs", latency: "15ms", errors: "0", backlog: "0" },
                ].map((health, i) => (
                  <div
                    key={i}
                    className="border-2 p-2 flex justify-between text-xs"
                    style={{
                      backgroundColor: "white",
                      borderTopColor: "#808080",
                      borderLeftColor: "#808080",
                      borderRightColor: "#dfdfdf",
                      borderBottomColor: "#808080",
                    }}
                  >
                    <span className="text-black font-bold">{health.stream}</span>
                    <span className="text-black">Latency: {health.latency}</span>
                    <span className={health.errors === "0" ? "text-green-600" : "text-red-600"}>
                      Errors: {health.errors}
                    </span>
                    <span className="text-black">Backlog: {health.backlog}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "workflows" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black mb-4">Workflow Management</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">Active Workflows</div>
                  <div className="space-y-2">
                    {[
                      { name: "Data Processing", status: "Running", progress: "75%" },
                      { name: "Email Campaign", status: "Scheduled", progress: "0%" },
                      { name: "Report Generation", status: "Completed", progress: "100%" },
                    ].map((workflow, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs text-black">
                          <span>{workflow.name}</span>
                          <span
                            className={
                              workflow.status === "Running"
                                ? "text-blue-600"
                                : workflow.status === "Completed"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                            }
                          >
                            {workflow.status}
                          </span>
                        </div>
                        <div className="w-full bg-gray-300 h-1 border border-gray-400">
                          <div className="bg-win95-titlebar h-full" style={{ width: workflow.progress }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">Execution Stats</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-black">
                      <span>Total Runs Today</span>
                      <span>47</span>
                    </div>
                    <div className="flex justify-between text-xs text-black">
                      <span>Success Rate</span>
                      <span className="text-green-600">94.3%</span>
                    </div>
                    <div className="flex justify-between text-xs text-black">
                      <span>Avg Duration</span>
                      <span>2m 34s</span>
                    </div>
                    <div className="flex justify-between text-xs text-black">
                      <span>Failed Runs</span>
                      <span className="text-red-600">3</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-black">Recent Executions</h4>
                {[
                  { workflow: "Data Processing", started: "14:32", duration: "3m 12s", status: "Success" },
                  { workflow: "Report Generation", started: "14:15", duration: "1m 45s", status: "Success" },
                  { workflow: "Email Campaign", started: "13:58", duration: "0m 23s", status: "Failed" },
                ].map((execution, i) => (
                  <div
                    key={i}
                    className="border-2 p-2 flex justify-between text-xs"
                    style={{
                      backgroundColor: "white",
                      borderTopColor: "#808080",
                      borderLeftColor: "#808080",
                      borderRightColor: "#dfdfdf",
                      borderBottomColor: "#dfdfdf",
                    }}
                  >
                    <span className="text-black font-bold">{execution.workflow}</span>
                    <span className="text-black">{execution.started}</span>
                    <span className="text-black">{execution.duration}</span>
                    <span className={execution.status === "Success" ? "text-green-600" : "text-red-600"}>
                      {execution.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black mb-4">API Management</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">API Endpoints</div>
                  <div className="space-y-2">
                    {[
                      { endpoint: "/api/users", method: "GET", status: "Active", calls: "1.2k" },
                      { endpoint: "/api/orders", method: "POST", status: "Active", calls: "456" },
                      { endpoint: "/api/analytics", method: "GET", status: "Active", calls: "2.8k" },
                    ].map((api, i) => (
                      <div key={i} className="flex justify-between text-xs text-black">
                        <span className="font-mono">{api.method}</span>
                        <span className="font-mono truncate flex-1 mx-2">{api.endpoint}</span>
                        <span className="text-green-600">{api.calls}/h</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                  }}
                >
                  <div className="text-sm font-bold mb-2 text-black">Response Times</div>
                  <div className="h-20 bg-black font-mono text-white text-xs p-2">
                    <div className="flex items-end h-full gap-1">
                      {Array.from({ length: 12 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-green-400 w-2"
                          style={{
                            height: `${Math.random() * 60 + 20}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-black mt-1">Avg: 45ms</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-black">API Keys & Authentication</h4>
                {[
                  { name: "Production API Key", usage: "1,247 calls", limit: "10,000/day", status: "Active" },
                  { name: "Development API Key", usage: "89 calls", limit: "1,000/day", status: "Active" },
                  { name: "Partner Integration", usage: "456 calls", limit: "5,000/day", status: "Active" },
                ].map((key, i) => (
                  <div
                    key={i}
                    className="border-2 p-2 flex justify-between text-xs"
                    style={{
                      backgroundColor: "white",
                      borderTopColor: "#808080",
                      borderLeftColor: "#808080",
                      borderRightColor: "#dfdfdf",
                      borderBottomColor: "#dfdfdf",
                    }}
                  >
                    <span className="text-black font-bold">{key.name}</span>
                    <span className="text-black">{key.usage}</span>
                    <span className="text-black">{key.limit}</span>
                    <span className="text-green-600">{key.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black mb-4">Application Logs</h3>
              <div
                className="border-2 p-2 h-64 overflow-y-auto font-mono text-xs"
                style={{
                  backgroundColor: "black",
                  borderTopColor: "#808080",
                  borderLeftColor: "#808080",
                  borderRightColor: "#dfdfdf",
                  borderBottomColor: "#808080",
                }}
              >
                <div className="text-green-400">[2024-01-15 14:32:15] INFO: Server started on port 3000</div>
                <div className="text-white">[2024-01-15 14:32:16] GET /api/users - 200 OK (45ms)</div>
                <div className="text-white">[2024-01-15 14:32:18] GET /dashboard - 200 OK (123ms)</div>
                <div className="text-yellow-400">[2024-01-15 14:32:20] WARN: High memory usage detected (78%)</div>
                <div className="text-white">[2024-01-15 14:32:22] POST /api/data - 201 Created (67ms)</div>
                <div className="text-red-400">[2024-01-15 14:32:25] ERROR: Database connection timeout</div>
                <div className="text-white">[2024-01-15 14:32:26] GET /health - 200 OK (12ms)</div>
                <div className="text-green-400">[2024-01-15 14:32:28] INFO: Database connection restored</div>
                <div className="text-white">[2024-01-15 14:32:30] GET /api/metrics - 200 OK (34ms)</div>
                <div className="text-blue-400">[2024-01-15 14:32:32] DEBUG: Cache hit ratio: 89%</div>
                <div className="text-white">[2024-01-15 14:32:35] PUT /api/settings - 200 OK (56ms)</div>
                <div className="text-yellow-400">
                  [2024-01-15 14:32:38] WARN: Rate limit approaching for IP 192.168.1.100
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm font-bold text-black border-2 hover:bg-gray-400"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#dfdfdf",
                    borderLeftColor: "#dfdfdf",
                    borderRightColor: "#808080",
                    borderBottomColor: "#808080",
                  }}
                >
                  Clear Logs
                </button>
                <button
                  className="px-3 py-1 text-sm font-bold text-black border-2 hover:bg-gray-400"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#dfdfdf",
                    borderLeftColor: "#dfdfdf",
                    borderRightColor: "#808080",
                    borderBottomColor: "#808080",
                  }}
                >
                  Download Logs
                </button>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black mb-4">Hosting Settings</h3>
              <div className="space-y-4">
                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#808080",
                  }}
                >
                  <label className="block text-sm font-bold text-black mb-2">Domain Name</label>
                  <input
                    type="text"
                    value="myapp.vercel.app"
                    className="w-full p-2 border-2 text-black"
                    style={{
                      backgroundColor: "#c0c0c0",
                      borderTopColor: "#808080",
                      borderLeftColor: "#808080",
                      borderRightColor: "#dfdfdf",
                      borderBottomColor: "#808080",
                    }}
                    readOnly
                  />
                </div>
                <div
                  className="border-2 p-3"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#808080",
                  }}
                >
                  <label className="block text-sm font-bold text-black mb-2">Environment</label>
                  <select
                    className="w-full p-2 border-2 text-black"
                    style={{
                      backgroundColor: "#c0c0c0",
                      borderTopColor: "#808080",
                      borderLeftColor: "#808080",
                      borderRightColor: "#dfdfdf",
                      borderBottomColor: "#808080",
                    }}
                  >
                    <option>Production</option>
                    <option>Staging</option>
                    <option>Development</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  )
}

export default HostingDashboard
