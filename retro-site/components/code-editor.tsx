"use client"

import { useState } from "react"
import { WindowFrame } from "./window-frame"

interface CodeEditorProps {
  id: string
  title: string
  content: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  isActive?: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize?: () => void
  onResize?: (size: { width: number; height: number }) => void
}

export function CodeEditor({
  id,
  title,
  content,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  onMaximize,
  size,
  isActive = true,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
}: CodeEditorProps) {
  const [code, setCode] = useState(`// Welcome to Cursor IDE
// Type-safe, AI-powered code editor

import React from 'react'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="app">
      <h1>Hello, World!</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )
}

export default App`)

  return (
    <WindowFrame
      id={id}
      title={`Cursor IDE - ${title}`}
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      width={size?.width || 500}
      height={size?.height || 400}
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
    >
      <div className="h-full bg-black flex flex-col text-black font-mono">
        <div className="border-b p-1 flex items-center gap-4 text-black" style={{ borderBottomColor: "#808080" }}>
          <button className="px-2 py-1 text-xs bg-win95-gray text-black">File</button>
          <button className="px-2 py-1 text-xs bg-win95-gray text-black">Edit</button>
          <button className="px-2 py-1 text-xs bg-win95-gray text-black">View</button>
          <button className="px-2 py-1 text-xs bg-win95-gray text-black">Terminal</button>
          <button className="px-2 py-1 text-xs bg-win95-gray text-black">Help</button>
        </div>

        <div className="border-b p-2 flex items-center gap-2 text-black" style={{ borderBottomColor: "#808080" }}>
          <button className="win95-button w-6 h-6 text-xs flex items-center justify-center">📁</button>
          <button className="win95-button w-6 h-6 text-xs flex items-center justify-center">💾</button>
          <button className="win95-button w-6 h-6 text-xs flex items-center justify-center">🔍</button>
          <div className="w-px h-6 bg-gray-600 mx-1" />
          <button className="win95-button w-6 h-6 text-xs flex items-center justify-center">▶️</button>
          <button className="win95-button w-6 h-6 text-xs flex items-center justify-center">🐛</button>
          <div className="w-px h-6 bg-gray-600 mx-1" />
          <span className="text-xs">main.tsx</span>
        </div>

        {/* Line Numbers and Code Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Line Numbers */}
          <div className="bg-gray-900 border-r border-gray-600 p-2 text-right text-black text-sm select-none min-w-12 overflow-hidden">
            {code.split("\n").map((_, index) => (
              <div key={index} className="leading-6">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-black p-2 overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full resize-none border-none outline-none bg-transparent text-black font-mono text-sm leading-6"
              style={{
                fontFamily: "Consolas, 'Courier New', monospace",
                tabSize: 2,
                minHeight: "100%",
              }}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Status Bar */}
        <div
          className="bg-gray-300 border-t p-1 flex items-center justify-between text-xs text-black"
          style={{ borderTopColor: "#808080" }}
        >
          <div className="flex items-center gap-4">
            <span>TypeScript React</span>
            <span>UTF-8</span>
            <span>LF</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Ln {code.split("\n").length}, Col 1</span>
            <span>Spaces: 2</span>
            <span className="text-black">● Connected</span>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
