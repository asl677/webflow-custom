"use client"

import { useState, useEffect } from "react"
import { WindowFrame } from "./window-frame"

interface FigmaAppProps {
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
  isDarkMode?: boolean
}

const FigmaAppFixed = ({
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
}: FigmaAppProps) => {
  const [activeTab, setActiveTab] = useState("Design")
  const [leftPaneWidth, setLeftPaneWidth] = useState(150)
  const [rightPaneWidth, setRightPaneWidth] = useState(150)
  const [shapes, setShapes] = useState([
    { id: 'frame1', type: 'rectangle', x: 50, y: 100, width: 80, height: 120, color: '#e5e7eb', name: 'frame023482' },
    { id: 'frame2', type: 'rectangle', x: 150, y: 100, width: 80, height: 120, color: '#e5e7eb', name: 'frame2333' },
    { id: 'frame3', type: 'rectangle', x: 250, y: 100, width: 80, height: 120, color: '#e5e7eb', name: 'frame023482' },
    { id: 'frame4', type: 'rectangle', x: 350, y: 100, width: 80, height: 120, color: '#e5e7eb', name: 'frame2333' }
  ])
  const [selectedShape, setSelectedShape] = useState<string | null>(null)

  return (
    <WindowFrame
      id={id}
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive}
      size={size}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onResize={onResize}
      title="Figma"
      icon="/icons/factory-icon.png"
    >
      <div className="flex flex-col h-full" style={{ backgroundColor: "white" }}>
        {/* Figma Menu Bar */}
        <div className="flex overflow-x-auto bg-win95-window">
          <button className="px-3 py-1 border-r border-neutral-400 text-sm hover:bg-neutral-300 text-black flex-shrink-0 whitespace-nowrap">
            Project
          </button>
          <button className="px-3 py-1 border-r border-neutral-400 text-sm hover:bg-neutral-300 text-black flex-shrink-0 whitespace-nowrap">
            Project
          </button>
          <div className="flex-1 hidden md:block" />
          <button className="px-3 py-1 text-sm hover:bg-gray-300 text-black flex-shrink-0 whitespace-nowrap">
            Preview
          </button>
        </div>

        {/* Figma Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full overflow-hidden" style={{ backgroundColor: "silver" }}>
            {/* Left Panel - Layers */}
            <div
              className="border-r border-neutral-400 flex flex-col h-full"
              style={{
                width: `${leftPaneWidth}px`,
                backgroundColor: "#ffffff",
                border: "2px inset #c0c0c0",
                margin: "0 4px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <div className="flex-1">
                <div className="space-y-2">
                  {shapes.map((shape) => (
                    <div 
                      key={shape.id}
                      className={`text-xs text-black cursor-pointer p-1 ${
                        selectedShape === shape.id ? 'bg-blue-100' : ''
                      }`}
                      style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                      onClick={() => setSelectedShape(shape.id)}
                    >
                      {shape.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Canvas Area */}
            <div
              className="flex-1 border-r border-neutral-400 flex flex-col"
              style={{
                backgroundColor: "#ffffff",
                border: "2px inset #c0c0c0",
                margin: "0 4px",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <div className="flex-1 p-2">
                <div className="space-y-2">
                  {/* Canvas with rectangles */}
                  <div className="relative min-h-96 bg-white" style={{ minHeight: '400px' }}>
                    {shapes.map((shape) => (
                      <div key={shape.id} className="absolute" style={{
                        left: `${shape.x}px`,
                        top: `${shape.y}px`,
                      }}>
                        {/* Frame name above the shape */}
                        <div 
                          className="text-xs font-bold text-black cursor-pointer select-none"
                          style={{ 
                            fontFamily: "MS Sans Serif, sans-serif",
                            fontSize: '10px',
                            marginBottom: '2px'
                          }}
                        >
                          {shape.name}
                        </div>
                        
                        {/* The actual shape */}
                        <div
                          className="select-none"
                          style={{
                            width: `${shape.width}px`,
                            height: `${shape.height}px`,
                            backgroundColor: shape.color,
                            boxShadow: '2px 2px 0 #000000',
                            border: selectedShape === shape.id ? '1px solid #808080' : 'none'
                          }}
                          onClick={() => setSelectedShape(shape.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Bottom Fixed Footer Action Bar */}
              <div 
                className="flex justify-center items-center p-2"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTop: "1px solid #808080",
                  borderLeft: "1px solid #dfdfdf",
                  borderRight: "1px solid #808080",
                  borderBottom: "1px solid #dfdfdf",
                  boxShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080",
                }}
              >
                <div className="flex gap-1">
                  <button className="px-3 py-1 text-xs text-black font-bold" style={{
                    backgroundColor: "#c0c0c0",
                    border: "1px outset #c0c0c0",
                    fontFamily: "MS Sans Serif, sans-serif",
                    fontWeight: "bold",
                  }}>
                    Frame
                  </button>
                  <button className="px-3 py-1 text-xs text-black font-bold" style={{
                    backgroundColor: "#c0c0c0",
                    border: "1px outset #c0c0c0",
                    fontFamily: "MS Sans Serif, sans-serif",
                    fontWeight: "bold",
                  }}>
                    Shapes
                  </button>
                  <button className="px-3 py-1 text-xs text-black font-bold" style={{
                    backgroundColor: "#c0c0c0",
                    border: "1px outset #c0c0c0",
                    fontFamily: "MS Sans Serif, sans-serif",
                    fontWeight: "bold",
                  }}>
                    Pen
                  </button>
                  <button className="px-3 py-1 text-xs text-black font-bold" style={{
                    backgroundColor: "#c0c0c0",
                    border: "1px outset #c0c0c0",
                    fontFamily: "MS Sans Serif, sans-serif",
                    fontWeight: "bold",
                  }}>
                    Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - Properties */}
            <div
              className="flex flex-col h-full"
              style={{
                width: `${rightPaneWidth}px`,
                backgroundColor: "#ffffff",
                border: "2px inset #c0c0c0",
                margin: "0 4px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <div className="flex-1">
                <div className="space-y-2">
                  <div className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Position</div>
                  <div className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Layout</div>
                  <div className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Appearance</div>
                  <div className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Typography</div>
                  <div className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Fill</div>
                  <div className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Stroke</div>
                  <div className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Effects</div>
                  <div className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Export</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}

export default FigmaAppFixed
