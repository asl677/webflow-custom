"use client"

import { useState } from "react"
import { WindowFrame } from "./window-frame"

interface AddProjectWindowProps {
  id: string
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
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
}

export function AddProjectWindow({
  id,
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
  onMinimize,
  onResize,
}: AddProjectWindowProps) {
  const [showGitHubConnect, setShowGitHubConnect] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState("")

  const mockRepos = [
    { name: "my-react-app", description: "A React application with TypeScript", stars: 42 },
    { name: "nextjs-blog", description: "Personal blog built with Next.js", stars: 18 },
    { name: "e-commerce-frontend", description: "Modern e-commerce storefront", stars: 73 },
    { name: "portfolio-v2", description: "Updated portfolio website", stars: 12 },
  ]

  const handleConnectGitHub = () => {
    setShowGitHubConnect(true)
    setTimeout(() => {
      setShowGitHubConnect(false)
    }, 2000)
  }

  const handleDeployRepo = () => {
    if (selectedRepo) {
      onClose()
    }
  }

  return (
    <>
      <WindowFrame
        id={id}
        title="Add New Project"
        position={position}
        size={size || { width: 400, height: 200 }} // Reduced default height to fit content
        zIndex={zIndex}
        isAnimating={isAnimating}
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        isActive={isActive}
        onMaximize={onMaximize}
        onClose={onClose}
        onFocus={onFocus}
        onMove={onMove}
        onMinimize={onMinimize}
        onResize={onResize}
      >
        <div className="h-full flex flex-col p-4">
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-bold text-black mb-2">Select Repository:</label>
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="w-full p-2 border-2 text-black bg-white"
                style={{
                  borderTopColor: "#808080",
                  borderLeftColor: "#808080",
                  borderRightColor: "#dfdfdf",
                  borderBottomColor: "#dfdfdf",
                }}
              >
                <option value="">Select a repository...</option>
                {mockRepos.map((repo) => (
                  <option key={repo.name} value={repo.name}>
                    {repo.name} - {repo.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 justify-end mt-auto pt-4">
              <button
                className="px-4 py-2 text-sm font-bold text-black border-2 hover:bg-gray-400"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
                onClick={handleConnectGitHub}
              >
                Connect GitHub
              </button>
              <button
                className="px-4 py-2 text-sm font-bold text-black border-2 hover:bg-gray-400"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
                onClick={handleDeployRepo}
                disabled={!selectedRepo}
              >
                Deploy
              </button>
            </div>
          </div>
        </div>
      </WindowFrame>

      {showGitHubConnect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-win95-window border-2 p-4 min-w-80 text-center"
            style={{
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
            }}
          >
            <h3 className="text-lg font-bold text-black mb-4">Connecting to GitHub...</h3>
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-black">Please wait while we connect to your GitHub account.</p>
          </div>
        </div>
      )}
    </>
  )
}
