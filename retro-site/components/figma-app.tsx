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

const FigmaApp = ({
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
  isDarkMode,
}: FigmaAppProps) => {
  const [activeTab, setActiveTab] = useState("Design")
  const [leftPaneWidth, setLeftPaneWidth] = useState(150)
  const [rightPaneWidth, setRightPaneWidth] = useState(150)
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)
  const [shapes, setShapes] = useState<Array<{id: string, type: 'rectangle' | 'triangle' | 'circle', x: number, y: number, width: number, height: number, color: string, name: string, strokeColor?: string, shadowColor?: string, isInitialFrame?: boolean}>>([
    { id: 'frame1', type: 'rectangle', x: 100, y: 100, width: 80, height: 120, color: '#e5e7eb', name: 'frame_01', isInitialFrame: true },
    { id: 'frame2', type: 'rectangle', x: 200, y: 100, width: 80, height: 120, color: '#e5e7eb', name: 'frame_02', isInitialFrame: true },
    { id: 'frame4', type: 'rectangle', x: 300, y: 100, width: 80, height: 120, color: '#e5e7eb', name: 'frame_03', isInitialFrame: true }
  ])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentShape, setCurrentShape] = useState<{x: number, y: number, width: number, height: number} | null>(null)
  const [draggedShape, setDraggedShape] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [canvasTransform, setCanvasTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false)
  const [canvasDragStart, setCanvasDragStart] = useState({ x: 0, y: 0 })
  const [shapesDropdownOpen, setShapesDropdownOpen] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [showComments, setShowComments] = useState(false)
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null)
  const [dragOverLayer, setDragOverLayer] = useState<string | null>(null)
  const [selectedShapeProps, setSelectedShapeProps] = useState({
    x: 0,
    y: 0,
    opacity: 100,
    strokeWidth: 1,
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 0,
    exportFormat: 'png'
  })

  const windows95Colors = [
    '#000000', '#800000', '#008000', '#808000',
    '#000080', '#800080', '#008080', '#C0C0C0',
    '#808080', '#FF0000', '#00FF00', '#FFFF00',
    '#0000FF', '#FF00FF', '#00FFFF', '#FFFFFF'
  ]

  // Keyboard delete functionality
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedShape) {
        setShapes(prev => prev.filter(shape => shape.id !== selectedShape))
        setSelectedShape(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedShape])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shapesDropdownOpen) {
        setShapesDropdownOpen(false)
      }
    }

    if (shapesDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [shapesDropdownOpen])

  // Global mouse up handler to clean up drag operations
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (draggedShape) {
        setDraggedShape(null)
        setDragOffset({x: 0, y: 0})
      }
      if (isDraggingCanvas) {
        setIsDraggingCanvas(false)
      }
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [draggedShape, isDraggingCanvas])

  // Pan and zoom handlers
  const handleCanvasWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom with Ctrl/Cmd + wheel from center
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.max(0.1, Math.min(5, canvasTransform.scale * zoomFactor))
      
      // Get canvas center
      const canvasContainer = document.querySelector('.figma-canvas-container')
      if (canvasContainer) {
        const rect = canvasContainer.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        
        // Calculate new transform to zoom from center
        const scaleChange = newScale / canvasTransform.scale
        const newX = centerX - (centerX - canvasTransform.x) * scaleChange
        const newY = centerY - (centerY - canvasTransform.y) * scaleChange
        
        setCanvasTransform({
          x: newX,
          y: newY,
          scale: newScale
        })
      }
    } else {
      // Pan with wheel
      const panSpeed = 1
      setCanvasTransform(prev => ({
        ...prev,
        x: prev.x - e.deltaX * panSpeed,
        y: prev.y - e.deltaY * panSpeed
      }))
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Handle canvas drag - allow dragging anywhere in the canvas
    if (e.button === 0 && !e.altKey && !e.ctrlKey && !e.metaKey) {
      // Only prevent canvas dragging if clicking directly on a shape
      const target = e.target as HTMLElement
      const isDirectShape = target.classList.contains('shape-element') && target.hasAttribute('data-shape')
      
      if (!isDirectShape) {
        e.preventDefault()
        e.stopPropagation()
        
        setIsDraggingCanvas(true)
        setCanvasDragStart({
          x: e.clientX - canvasTransform.x,
          y: e.clientY - canvasTransform.y
        })
      }
    } else if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle mouse button or Alt + left click for panning
      e.preventDefault()
      e.stopPropagation()
      
      const startX = e.clientX - canvasTransform.x
      const startY = e.clientY - canvasTransform.y
      
      const handleMouseMove = (e: MouseEvent) => {
        setCanvasTransform(prev => ({
          ...prev,
          x: e.clientX - startX,
          y: e.clientY - startY
        }))
      }
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  // Drag handling for shapes only (not window resize)
  const handleShapeDragStart = (e: React.MouseEvent, shapeId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Stop any canvas dragging
    setIsDraggingCanvas(false)
    
    setDraggedShape(shapeId)
    const shape = shapes.find(s => s.id === shapeId)
    
    if (shape) {
      // Get the canvas container position
      const canvasContainer = document.querySelector('.figma-canvas-container')
      if (canvasContainer) {
        const canvasRect = canvasContainer.getBoundingClientRect()
        
        // Calculate mouse position relative to canvas
        const mouseX = (e.clientX - canvasRect.left - canvasTransform.x) / canvasTransform.scale
        const mouseY = (e.clientY - canvasRect.top - canvasTransform.y) / canvasTransform.scale
        
        setDragOffset({
          x: mouseX - shape.x,
          y: mouseY - shape.y
        })
      }
    }
  }

  const handleShapeDragMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      // Handle canvas dragging
      e.preventDefault()
      e.stopPropagation()
      
      setCanvasTransform(prev => ({
        ...prev,
        x: e.clientX - canvasDragStart.x,
        y: e.clientY - canvasDragStart.y
      }))
    } else if (draggedShape) {
      // Handle shape dragging
      e.preventDefault()
      e.stopPropagation()
      
      // Get the canvas container position
      const canvasContainer = document.querySelector('.figma-canvas-container')
      if (canvasContainer) {
        const canvasRect = canvasContainer.getBoundingClientRect()
        
        // Convert mouse position to canvas coordinates
        const mouseX = (e.clientX - canvasRect.left - canvasTransform.x) / canvasTransform.scale
        const mouseY = (e.clientY - canvasRect.top - canvasTransform.y) / canvasTransform.scale
        
        const newX = mouseX - dragOffset.x
        const newY = mouseY - dragOffset.y
        
        setShapes(prev => prev.map(shape => 
          shape.id === draggedShape 
            ? { ...shape, x: Math.max(0, newX), y: Math.max(0, newY) }
            : shape
        ))
      }
    } else if (isResizing) {
      // Handle resizing
      handleResizeMove(e)
    }
  }

  const handleShapeDragEnd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggedShape(null)
    setDragOffset({x: 0, y: 0})
    setIsDraggingCanvas(false)
    handleResizeEnd(e)
  }

  const handleLeftPaneResize = (e: React.MouseEvent) => {
    setIsResizingLeft(true)
    const startX = e.clientX
    const startWidth = leftPaneWidth

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(150, Math.min(400, startWidth + (e.clientX - startX)))
      setLeftPaneWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizingLeft(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleShapeClick = (e: React.MouseEvent, shapeId: string) => {
    e.stopPropagation()
    setSelectedShape(shapeId)
  }

  const handleResizeStart = (e: React.MouseEvent, shapeId: string, handle: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    const shape = shapes.find(s => s.id === shapeId)
    if (shape) {
      setIsResizing(true)
      setResizeHandle(handle)
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: shape.width,
        height: shape.height
      })
    }
  }

  const handleResizeMove = (e: React.MouseEvent) => {
    if (isResizing && resizeHandle && selectedShape) {
      e.preventDefault()
      e.stopPropagation()
      
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      
      let newWidth = resizeStart.width
      let newHeight = resizeStart.height
      
      if (resizeHandle.includes('right')) {
        newWidth = Math.max(20, resizeStart.width + deltaX)
      }
      if (resizeHandle.includes('bottom')) {
        newHeight = Math.max(20, resizeStart.height + deltaY)
      }
      if (resizeHandle.includes('left')) {
        newWidth = Math.max(20, resizeStart.width - deltaX)
      }
      if (resizeHandle.includes('top')) {
        newHeight = Math.max(20, resizeStart.height - deltaY)
      }
      
      setShapes(prev => prev.map(shape => 
        shape.id === selectedShape 
          ? { ...shape, width: newWidth, height: newHeight }
          : shape
      ))
    }
  }

  const handleResizeEnd = (e: React.MouseEvent) => {
    if (isResizing) {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(false)
      setResizeHandle(null)
    }
  }


  const addNewRectangle = () => {
    const newId = `frame${Date.now()}`
    const newFrameCount = shapes.filter(s => s.type === 'rectangle' && !s.isInitialFrame).length
    const newShape = {
      id: newId,
      type: 'rectangle' as const,
      x: 400 + newFrameCount * 100, // Position new frames to the right of the 3rd frame
      y: 150,
      width: 80,
      height: 120,
      color: '#e5e7eb',
      name: `frame_${(newFrameCount + 4).toString().padStart(2, '0')}`
    }
    setShapes(prev => [...prev, newShape])
  }

  const addNewShape = (shapeType: 'rectangle' | 'triangle' | 'circle') => {
    const newId = `shape${Date.now()}`
    const shapeNumber = shapes.filter(s => s.type === shapeType).length + 1
    const newShape = {
      id: newId,
      type: shapeType,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      width: 80,
      height: 80,
      color: '#e5e7eb',
      name: `${shapeType}_${shapeNumber.toString().padStart(2, '0')}`
    }
    setShapes(prev => [...prev, newShape])
    setShapesDropdownOpen(false)
  }

  const handleLayerDragStart = (e: React.DragEvent, shapeId: string) => {
    setDraggedLayer(shapeId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleLayerDragOver = (e: React.DragEvent, shapeId: string) => {
    e.preventDefault()
    setDragOverLayer(shapeId)
  }

  const handleLayerDrop = (e: React.DragEvent, targetShapeId: string) => {
    e.preventDefault()
    if (draggedLayer && draggedLayer !== targetShapeId) {
      const draggedIndex = shapes.findIndex(s => s.id === draggedLayer)
      const targetIndex = shapes.findIndex(s => s.id === targetShapeId)
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newShapes = [...shapes]
        const draggedShape = newShapes[draggedIndex]
        newShapes.splice(draggedIndex, 1)
        newShapes.splice(targetIndex, 0, draggedShape)
        setShapes(newShapes)
      }
    }
    setDraggedLayer(null)
    setDragOverLayer(null)
  }

  const handleRightPaneResize = (e: React.MouseEvent) => {
    setIsResizingRight(true)
    const startX = e.clientX
    const startWidth = rightPaneWidth

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(150, Math.min(400, startWidth - (e.clientX - startX)))
      setRightPaneWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizingRight(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <WindowFrame
      id={id}
      title="Figma"
      icon="/icons/figma-icon-sm.png"
      iconStyle={{ transform: 'rotate(90deg) !important' }}
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
    >
      <div
        className="flex flex-col h-full"
        style={{
          backgroundColor: "white",
          borderTopColor: "#555",
          borderLeftColor: "#555",
          borderRightColor: "#dfdfdf",
          borderBottomColor: "#dfdfdf",
          boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        {/* Figma Menu Bar */}
        <div className="flex overflow-x-auto bg-win95-window">
          <button className="px-3 py-1 border-r border-neutral-400 text-sm hover:bg-neutral-300 text-black flex-shrink-0 whitespace-nowrap">
            Untitled
          </button>
  

          <div className="flex-1 hidden md:block" />

          <button 
            className="px-3 py-1 text-sm hover:bg-gray-300 text-black flex-shrink-0 whitespace-nowrap"
            onClick={() => setShapes([])}
          >
            Clear
          </button>
          <button 
            className="px-3 py-1 text-sm hover:bg-gray-300 text-black flex-shrink-0 whitespace-nowrap"
            onClick={() => {
              setShapes([
                { id: 'frame1', type: 'rectangle', x: 200, y: 150, width: 80, height: 120, color: '#e5e7eb', name: 'frame_01' },
                { id: 'frame2', type: 'rectangle', x: 300, y: 150, width: 80, height: 120, color: '#e5e7eb', name: 'frame_02' },
                { id: 'frame4', type: 'rectangle', x: 400, y: 150, width: 80, height: 120, color: '#e5e7eb', name: 'frame_03' }
              ])
            }}
          >
            New
          </button>
          <button className="px-3 py-1 text-sm hover:bg-gray-300 text-black flex-shrink-0 whitespace-nowrap">
            Preview
          </button>
        </div>

        {/* Figma Main Content */}
        <div className="flex-1 overflow-hidden">
          <div
            className="flex h-full overflow-hidden"
            style={{
              backgroundColor: "silver",
            }}
          >
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
                overflow: "hidden",
              }}
            >
              <div className="flex-1 overflow-hidden">
                <div className="space-y-2">
                  {shapes.map((shape) => (
                    <div 
                      key={shape.id}
                      className={`text-xs text-black cursor-pointer p-1 ${
                        selectedShape === shape.id ? 'bg-blue-100' : ''
                      } ${dragOverLayer === shape.id ? 'bg-gray-200' : ''}`}
                      style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                      onClick={() => setSelectedShape(shape.id)}
                      draggable
                      onDragStart={(e) => handleLayerDragStart(e, shape.id)}
                      onDragOver={(e) => handleLayerDragOver(e, shape.id)}
                      onDrop={(e) => handleLayerDrop(e, shape.id)}
                    >
                      {shape.name}
                    </div>
                  ))}
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

            {/* Main Canvas Area */}
            <div
              className="flex-1 border-r border-neutral-400 flex flex-col overflow-hidden"
              style={{
                backgroundColor: "#ffffff",
                border: "2px inset #c0c0c0",
                margin: "0 4px",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              {/* Canvas Area */}
              <div 
                className="flex-1 overflow-hidden"
                onMouseMove={handleShapeDragMove}
                onMouseUp={handleShapeDragEnd}
                onWheel={handleCanvasWheel}
                onMouseDown={handleCanvasMouseDown}
                style={{
                  cursor: isDraggingCanvas ? 'grabbing' : 'grab'
                }}
              >
                <div 
                  className="figma-canvas-container figma-canvas relative bg-white"
                  style={{
                    transform: `translate(${canvasTransform.x}px, ${canvasTransform.y}px) scale(${canvasTransform.scale})`,
                    transformOrigin: '0 0',
                    minHeight: '100vh',
                    minWidth: '100vw'
                  }}
                >
                  {/* Canvas content with padding */}
                  <div className="absolute inset-0 p-8">
                    {shapes.map((shape) => (
                      <div key={shape.id} className="absolute shape-element" data-shape={shape.id} style={{
                        left: `${shape.x}px`,
                        top: `${shape.y}px`,
                      }}>
                      {/* Frame name above the shape */}
                      <div 
                        className="text-xs font-bold text-black cursor-pointer select-none"
                        style={{ 
                          fontFamily: "MS Sans Serif, sans-serif",
                          fontSize: '10px',
                          marginBottom: '2px',
                          textAlign: 'center'
                        }}
                        onClick={(e) => handleShapeClick(e, shape.id)}
                      >
                        {shape.name}
                      </div>
                      
                      {/* The actual shape */}
                      {shape.type === 'circle' ? (
                        <div
                          className="cursor-move select-none relative"
                          style={{
                            width: `${shape.width}px`,
                            height: `${shape.height}px`,
                            backgroundColor: shape.color,
                            borderRadius: '50%',
                            boxShadow: 'none',
                            border: shape.strokeColor ? `2px solid ${shape.strokeColor}` : 'none',
                            opacity: selectedShape === shape.id ? selectedShapeProps.opacity / 100 : 1
                          }}
                          onClick={(e) => handleShapeClick(e, shape.id)}
                          onMouseDown={(e) => handleShapeDragStart(e, shape.id)}
                        >
                          {/* Resize handles - only show when selected */}
                          {selectedShape === shape.id && (
                            <>
                              {/* Top-left */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-nw-resize"
                                style={{
                                  left: '-4px',
                                  top: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'top-left')}
                              />
                              {/* Top-right */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-ne-resize"
                                style={{
                                  right: '-4px',
                                  top: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'top-right')}
                              />
                              {/* Bottom-left */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-sw-resize"
                                style={{
                                  left: '-4px',
                                  bottom: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'bottom-left')}
                              />
                              {/* Bottom-right */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-se-resize"
                                style={{
                                  right: '-4px',
                                  bottom: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'bottom-right')}
                              />
                            </>
                          )}
                        </div>
                      ) : shape.type === 'triangle' ? (
                        <div
                          className="cursor-move select-none relative"
                          style={{
                            width: 0,
                            height: 0,
                            borderLeft: `${shape.width / 2}px solid ${shape.strokeColor || 'transparent'}`,
                            borderRight: `${shape.width / 2}px solid ${shape.strokeColor || 'transparent'}`,
                            borderBottom: `${shape.height}px solid ${shape.color}`,
                            boxShadow: 'none',
                            outline: 'none',
                            opacity: selectedShape === shape.id ? selectedShapeProps.opacity / 100 : 1
                          }}
                          onClick={(e) => handleShapeClick(e, shape.id)}
                          onMouseDown={(e) => handleShapeDragStart(e, shape.id)}
                        >
                          {/* Resize handles - only show when selected */}
                          {selectedShape === shape.id && (
                            <>
                              {/* Top-left */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-nw-resize"
                                style={{
                                  left: '-4px',
                                  top: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'top-left')}
                              />
                              {/* Top-right */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-ne-resize"
                                style={{
                                  right: '-4px',
                                  top: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'top-right')}
                              />
                              {/* Bottom-left */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-sw-resize"
                                style={{
                                  left: '-4px',
                                  bottom: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'bottom-left')}
                              />
                              {/* Bottom-right */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-se-resize"
                                style={{
                                  right: '-4px',
                                  bottom: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'bottom-right')}
                              />
                            </>
                          )}
                        </div>
                      ) : (
                        <div
                          className="cursor-move select-none relative"
                          style={{
                            width: `${shape.width}px`,
                            height: `${shape.height}px`,
                            backgroundColor: shape.color,
                            boxShadow: shape.shadowColor ? `2px 2px 0 ${shape.shadowColor}` : '2px 2px 0 #000000',
                            border: shape.strokeColor ? `2px solid ${shape.strokeColor}` : 'none',
                            opacity: selectedShape === shape.id ? selectedShapeProps.opacity / 100 : 1
                          }}
                          onClick={(e) => handleShapeClick(e, shape.id)}
                          onMouseDown={(e) => handleShapeDragStart(e, shape.id)}
                        >
                          {/* Resize handles - only show when selected */}
                          {selectedShape === shape.id && (
                            <>
                              {/* Top-left */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-nw-resize"
                                style={{
                                  left: '-4px',
                                  top: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'top-left')}
                              />
                              {/* Top-right */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-ne-resize"
                                style={{
                                  right: '-4px',
                                  top: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'top-right')}
                              />
                              {/* Bottom-left */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-sw-resize"
                                style={{
                                  left: '-4px',
                                  bottom: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'bottom-left')}
                              />
                              {/* Bottom-right */}
                              <div
                                className="absolute w-2 h-2 bg-black cursor-se-resize"
                                style={{
                                  right: '-4px',
                                  bottom: '-4px',
                                  border: '1px solid #fff'
                                }}
                                onMouseDown={(e) => handleResizeStart(e, shape.id, 'bottom-right')}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  </div>
                </div>
              </div>
              
              {/* Bottom Fixed Footer Action Bar */}
              <div 
                className="flex justify-center items-center p-2 flex-shrink-0"
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
                     <button 
                       className="px-3 py-1 text-xs text-black font-bold"
                       style={{
                         backgroundColor: "#c0c0c0",
                         border: "1px outset #c0c0c0",
                         fontFamily: "MS Sans Serif, sans-serif",
                         fontWeight: "bold",
                       }}
                       onClick={addNewRectangle}
                     >
                       Frame
                     </button>
                     <div className="relative">
                       <button 
                         className="px-3 py-1 text-xs text-black font-bold"
                         style={{
                           backgroundColor: "#c0c0c0",
                           border: "1px outset #c0c0c0",
                           fontFamily: "MS Sans Serif, sans-serif",
                           fontWeight: "bold",
                         }}
                         onClick={() => setShapesDropdownOpen(!shapesDropdownOpen)}
                       >
                         Shapes
                       </button>
                       
                       {shapesDropdownOpen && (
                         <div 
                           className="absolute bottom-full left-0 mb-1 bg-white border border-gray-400 shadow-lg z-50"
                           style={{
                             border: "1px outset #c0c0c0",
                             backgroundColor: "#c0c0c0",
                             minWidth: "120px"
                           }}
                         >
                           <button
                             className="w-full px-3 py-1 text-xs text-black text-left"
                             style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                             className="w-full px-3 py-1 text-xs text-black text-left"
                             style={{ 
                               fontFamily: "MS Sans Serif, sans-serif",
                               backgroundColor: "transparent",
                               border: "none",
                               cursor: "pointer"
                             }}
                             onMouseEnter={(e) => {
                               e.currentTarget.style.backgroundColor = '#c0c0c0 !important'
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.backgroundColor = 'transparent !important'
                             }}
                             onClick={() => addNewShape('rectangle')}
                           >
                             Rectangle
                           </button>
                           <button
                             className="w-full px-3 py-1 text-xs text-black text-left"
                             style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                             className="w-full px-3 py-1 text-xs text-black text-left"
                             style={{ 
                               fontFamily: "MS Sans Serif, sans-serif",
                               backgroundColor: "transparent",
                               border: "none",
                               cursor: "pointer"
                             }}
                             onMouseEnter={(e) => {
                               e.currentTarget.style.backgroundColor = '#c0c0c0 !important'
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.backgroundColor = 'transparent !important'
                             }}
                             onClick={() => addNewShape('triangle')}
                           >
                             Triangle
                           </button>
                           <button
                             className="w-full px-3 py-1 text-xs text-black text-left"
                             style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                             className="w-full px-3 py-1 text-xs text-black text-left"
                             style={{ 
                               fontFamily: "MS Sans Serif, sans-serif",
                               backgroundColor: "transparent",
                               border: "none",
                               cursor: "pointer"
                             }}
                             onMouseEnter={(e) => {
                               e.currentTarget.style.backgroundColor = '#c0c0c0 !important'
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.backgroundColor = 'transparent !important'
                             }}
                             onClick={() => addNewShape('circle')}
                           >
                             Circle
                           </button>
                         </div>
                       )}
                     </div>
                     <button 
                       className="px-3 py-1 text-xs text-black font-bold"
                       style={{
                         backgroundColor: "#c0c0c0",
                         border: "1px outset #c0c0c0",
                         fontFamily: "MS Sans Serif, sans-serif",
                         fontWeight: "bold",
                       }}
                       onClick={() => setShowComments(!showComments)}
                     >
                       Comments
                     </button>
                </div>
              </div>
            </div>

            <div
              className="w-1 bg-gray-400 cursor-col-resize hover:bg-gray-500 flex-shrink-0"
              onMouseDown={handleRightPaneResize}
              style={{
                borderLeft: "1px solid #808080",
                borderRight: "1px solid #dfdfdf",
              }}
            />

            {/* Right Panel - Properties */}
            <div
              className="border-r border-neutral-400 flex flex-col h-full"
              style={{
                width: `${rightPaneWidth}px`,
                backgroundColor: "#ffffff",
                border: "2px inset #c0c0c0",
                margin: "0 4px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              {showComments ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Comments</h3>
                    <button
                      className="px-2 py-1 text-xs text-black"
                      style={{
                        backgroundColor: "#c0c0c0",
                        border: "1px outset #c0c0c0",
                        fontFamily: "MS Sans Serif, sans-serif",
                        cursor: "pointer"
                      }}
                      onClick={() => setShowComments(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <div className="text-xs text-black font-bold" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>John Doe</div>
                      <div className="text-xs text-gray-600" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>2 hours ago</div>
                      <div className="text-xs text-black mt-1" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>This design looks great! Maybe we should adjust the spacing here.</div>
                    </div>
                    <div>
                      <div className="text-xs text-black font-bold" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Jane Smith</div>
                      <div className="text-xs text-gray-600" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>1 hour ago</div>
                      <div className="text-xs text-black mt-1" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>I agree with John. The color scheme works well.</div>
                    </div>
                    <div>
                      <div className="text-xs text-black font-bold" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Mike Johnson</div>
                      <div className="text-xs text-gray-600" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>30 minutes ago</div>
                      <div className="text-xs text-black mt-1" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Can we make the buttons a bit larger?</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 ">
                <div className="space-y-1">
                  {/* Position */}
                  <div>
                    <button
                      className="figma-accordion-button w-full text-left px-2 py-1 text-xs text-black hover:bg-black hover:text-white"
                      onClick={() => setActiveAccordion(activeAccordion === 'position' ? null : 'position')}
                    >
                      {activeAccordion === 'position' ? '▼' : '▶'} Position
                    </button>
                    <div 
                      className={`ml-2 space-y-2 transition-all duration-200 overflow-hidden ${
                        activeAccordion === 'position' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>X:</label>
                          <input
                            type="number"
                            value={selectedShape ? shapes.find(s => s.id === selectedShape)?.x || 0 : 0}
                            onChange={(e) => {
                              const newX = parseInt(e.target.value) || 0
                              if (selectedShape) {
                                setShapes(prev => prev.map(shape => 
                                  shape.id === selectedShape 
                                    ? { ...shape, x: newX }
                                    : shape
                                ))
                              }
                            }}
                            className="w-16 px-1 py-0.5 text-xs"
                            style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Y:</label>
                          <input
                            type="number"
                            value={selectedShape ? shapes.find(s => s.id === selectedShape)?.y || 0 : 0}
                            onChange={(e) => {
                              const newY = parseInt(e.target.value) || 0
                              if (selectedShape) {
                                setShapes(prev => prev.map(shape => 
                                  shape.id === selectedShape 
                                    ? { ...shape, y: newY }
                                    : shape
                                ))
                              }
                            }}
                            className="w-16 px-1 py-0.5 text-xs"
                            style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Width:</label>
                          <input
                            type="number"
                            value={selectedShape ? shapes.find(s => s.id === selectedShape)?.width || 0 : 0}
                            onChange={(e) => {
                              const newWidth = parseInt(e.target.value) || 0
                              if (selectedShape) {
                                setShapes(prev => prev.map(shape => 
                                  shape.id === selectedShape 
                                    ? { ...shape, width: newWidth }
                                    : shape
                                ))
                              }
                            }}
                            className="w-16 px-1 py-0.5 text-xs"
                            style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Height:</label>
                          <input
                            type="number"
                            value={selectedShape ? shapes.find(s => s.id === selectedShape)?.height || 0 : 0}
                            onChange={(e) => {
                              const newHeight = parseInt(e.target.value) || 0
                              if (selectedShape) {
                                setShapes(prev => prev.map(shape => 
                                  shape.id === selectedShape 
                                    ? { ...shape, height: newHeight }
                                    : shape
                                ))
                              }
                            }}
                            className="w-16 px-1 py-0.5 text-xs"
                            style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                          />
                        </div>
                      </div>
                  </div>

                  {/* Layout */}
                  <div>
                    <button
                      className="figma-accordion-button w-full text-left px-2 py-1 text-xs text-black hover:bg-black hover:text-white"
                      onClick={() => setActiveAccordion(activeAccordion === 'layout' ? null : 'layout')}
                    >
                      {activeAccordion === 'layout' ? '▼' : '▶'} Layout
                    </button>
                    {activeAccordion === 'layout' && (
                      <div className="ml-2 space-y-2">
                        <div className="grid grid-cols-2 gap-1">
                          <button className="px-2 py-1 text-xs text-black hover:bg-black hover:text-white" style={{ fontFamily: "MS Sans Serif, sans-serif", backgroundColor: "transparent", border: "none" }}>Left</button>
                          <button className="px-2 py-1 text-xs text-black hover:bg-black hover:text-white" style={{ fontFamily: "MS Sans Serif, sans-serif", backgroundColor: "transparent", border: "none" }}>Top</button>
                          <button className="px-2 py-1 text-xs text-black hover:bg-black hover:text-white" style={{ fontFamily: "MS Sans Serif, sans-serif", backgroundColor: "transparent", border: "none" }}>Right</button>
                          <button className="px-2 py-1 text-xs text-black hover:bg-black hover:text-white" style={{ fontFamily: "MS Sans Serif, sans-serif", backgroundColor: "transparent", border: "none" }}>Bottom</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Appearance */}
                  <div>
                    <button
                      className="figma-accordion-button w-full text-left px-2 py-1 text-xs text-black hover:bg-black hover:text-white"
                      onClick={() => setActiveAccordion(activeAccordion === 'appearance' ? null : 'appearance')}
                    >
                      {activeAccordion === 'appearance' ? '▼' : '▶'} Appearance
                    </button>
                    {activeAccordion === 'appearance' && (
                      <div className="ml-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Opacity:</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={selectedShapeProps.opacity}
                            onChange={(e) => setSelectedShapeProps(prev => ({ ...prev, opacity: parseInt(e.target.value) || 0 }))}
                            className="w-16 px-1 py-0.5 text-xs"
                            style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                          />
                          <span className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fill */}
                  <div>
                    <button
                      className="figma-accordion-button w-full text-left px-2 py-1 text-xs text-black hover:bg-black hover:text-white"
                      onClick={() => setActiveAccordion(activeAccordion === 'fill' ? null : 'fill')}
                    >
                      {activeAccordion === 'fill' ? '▼' : '▶'} Fill
                    </button>
                    {activeAccordion === 'fill' && (
                      <div className="ml-2">
                        <div className="grid grid-cols-4 gap-1">
                          {windows95Colors.map((color, index) => (
                            <button
                              key={index}
                              className="figma-color-button w-6 h-6 hover:scale-110 transition-transform"
                              style={{ 
                                '--color': color,
                                border: '1px solid #808080',
                                minWidth: '24px',
                                minHeight: '24px'
                              } as React.CSSProperties}
                              onClick={() => {
                                // Update selected shape fill color
                                if (selectedShape) {
                                  setShapes(prev => prev.map(shape => 
                                    shape.id === selectedShape 
                                      ? { ...shape, color: color }
                                      : shape
                                  ))
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stroke */}
                  <div>
                    <button
                      className="figma-accordion-button w-full text-left px-2 py-1 text-xs text-black hover:bg-black hover:text-white"
                      onClick={() => setActiveAccordion(activeAccordion === 'stroke' ? null : 'stroke')}
                    >
                      {activeAccordion === 'stroke' ? '▼' : '▶'} Stroke
                    </button>
                    {activeAccordion === 'stroke' && (
                      <div className="ml-2 space-y-2">
                        <div className="grid grid-cols-4 gap-1">
                          {windows95Colors.map((color, index) => (
                            <button
                              key={index}
                              className="figma-color-button w-6 h-6 hover:scale-110 transition-transform"
                              style={{ 
                                '--color': color,
                                border: '1px solid #808080',
                                minWidth: '24px',
                                minHeight: '24px'
                              } as React.CSSProperties}
                              onClick={() => {
                                // Update selected shape stroke color
                                if (selectedShape) {
                                  setShapes(prev => prev.map(shape => 
                                    shape.id === selectedShape 
                                      ? { ...shape, strokeColor: color }
                                      : shape
                                  ))
                                }
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Width:</label>
                          <input
                            type="number"
                            min="0"
                            value={selectedShapeProps.strokeWidth}
                            onChange={(e) => setSelectedShapeProps(prev => ({ ...prev, strokeWidth: parseInt(e.target.value) || 0 }))}
                            className="w-16 px-1 py-0.5 text-xs"
                            style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Effects */}
                  <div>
                    <button
                      className="figma-accordion-button w-full text-left px-2 py-1 text-xs text-black hover:bg-black hover:text-white"
                      onClick={() => setActiveAccordion(activeAccordion === 'effects' ? null : 'effects')}
                    >
                      {activeAccordion === 'effects' ? '▼' : '▶'} Effects
                    </button>
                    {activeAccordion === 'effects' && (
                      <div className="ml-2 space-y-2">
                        <div className="text-xs text-black mb-2" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Drop Shadow:</div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>X:</label>
                            <input
                              type="number"
                              value={selectedShapeProps.shadowX}
                              onChange={(e) => setSelectedShapeProps(prev => ({ ...prev, shadowX: parseInt(e.target.value) || 0 }))}
                              className="w-12 px-1 py-0.5 text-xs"
                              style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Y:</label>
                            <input
                              type="number"
                              value={selectedShapeProps.shadowY}
                              onChange={(e) => setSelectedShapeProps(prev => ({ ...prev, shadowY: parseInt(e.target.value) || 0 }))}
                              className="w-12 px-1 py-0.5 text-xs"
                              style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-black" style={{ fontFamily: "MS Sans Serif, sans-serif" }}>Blur:</label>
                            <input
                              type="number"
                              min="0"
                              value={selectedShapeProps.shadowBlur}
                              onChange={(e) => setSelectedShapeProps(prev => ({ ...prev, shadowBlur: parseInt(e.target.value) || 0 }))}
                              className="w-12 px-1 py-0.5 text-xs"
                              style={{ fontFamily: "MS Sans Serif, sans-serif" }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-1 mt-2">
                          {windows95Colors.map((color, index) => (
                            <button
                              key={index}
                              className="figma-color-button w-6 h-6 hover:scale-110 transition-transform"
                              style={{ 
                                '--color': color,
                                border: '1px solid #808080',
                                minWidth: '24px',
                                minHeight: '24px'
                              } as React.CSSProperties}
                              onClick={() => {
                                // Update selected shape shadow color
                                if (selectedShape) {
                                  setShapes(prev => prev.map(shape => 
                                    shape.id === selectedShape 
                                      ? { ...shape, shadowColor: color }
                                      : shape
                                  ))
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Export */}
                  <div>
                    <button
                      className="figma-accordion-button w-full text-left px-2 py-1 text-xs text-black hover:bg-black hover:text-white"
                      onClick={() => setActiveAccordion(activeAccordion === 'export' ? null : 'export')}
                    >
                      {activeAccordion === 'export' ? '▼' : '▶'} Export
                    </button>
                    {activeAccordion === 'export' && (
                      <div className="ml-2">
                        <select
                          value={selectedShapeProps.exportFormat}
                          onChange={(e) => setSelectedShapeProps(prev => ({ ...prev, exportFormat: e.target.value }))}
                          className="w-full px-2 py-1 text-xs"
                          style={{ 
                            fontFamily: "MS Sans Serif, sans-serif"
                          }}
                        >
                          <option value="png">PNG</option>
                          <option value="svg">SVG</option>
                          <option value="pdf">PDF</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </WindowFrame>
  )
}

export default FigmaApp