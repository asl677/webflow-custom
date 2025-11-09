"use client"

import { useState } from "react"
import { WindowFrame } from "./window-frame"
import { Win95MenuBar } from "./win95-menubar"

interface NotepadProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  isActive?: boolean
  isDarkMode?: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
  title?: string
  initialContent?: string
}

export function Notepad({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  onMaximize,
  size = { width: 300, height: 180 }, // Reduced default height for better content fitting
  isActive = true,
  isDarkMode = false,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
  title,
  initialContent,
}: NotepadProps) {
  const getDefaultContent = () => {
    if (title?.includes("514") || initialContent?.includes("514")) {
      return `
1. Modern Data Stack
   - Real-time processing
   - Cloud-native architecture
   - Modular, AI-powered tools

2. Enterprise Solutions
   - Scalable infrastructure
   - SOC2 & 24/7 support
   - Custom integrations`
    }

    return (
      initialContent ||
      `The Conversation Fast Data Stack!

      We do things differently :)

1. Modern Data Stack
   - Get started fast
   - Get building locally
   - Get to prod easily

2. Enterprise Solutions
   - Scalable infra
   - Expert support
   - Custom integrations

3. Happy Clients
   - F45
   - District Cannabis
   - MRM

Ready?

Book Demo: https://514.ai/book-demo`
    )
  }

  const [content, setContent] = useState(getDefaultContent())

  const getWindowTitle = () => {
    return title || "why-514.txt"
  }

  return (
    <WindowFrame
      id={id}
      title={getWindowTitle()}
      icon="/icons/notepad.png"
      position={position}
      size={size}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
      resizable={true}
      customFooterContent={
        <div className="flex justify-between w-full">
          <span>Ready</span>
        </div>
      }
    >
      <div className="flex flex-col h-full mx-2 ">
        {/* Menu bar */}
        <Win95MenuBar
          items={[
            {
              label: "File",
              items: [
                { label: "New", onClick: () => {}, shortcut: "Ctrl+N" },
                { label: "Open...", onClick: () => {}, shortcut: "Ctrl+O" },
                { type: "separator" },
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
                { label: "Delete", onClick: () => {}, shortcut: "Del" },
                { type: "separator" },
                { label: "Select All", onClick: () => {}, shortcut: "Ctrl+A" },
                { label: "Time/Date", onClick: () => {}, shortcut: "F5" },
              ],
            },
            {
              label: "Search",
              items: [
                { label: "Find...", onClick: () => {}, shortcut: "Ctrl+F" },
                { label: "Find Next", onClick: () => {}, shortcut: "F3" },
                { label: "Replace...", onClick: () => {}, shortcut: "Ctrl+H" },
                { label: "Go To...", onClick: () => {}, shortcut: "Ctrl+G" },
              ],
            },
            {
              label: "Help",
              items: [
                { label: "Help Topics", onClick: () => {} },
                { type: "separator" },
                { label: "About Notepad", onClick: () => {} },
              ],
            },
          ]}
        />

        {/* Text area */}
        <div className="flex-1 notepad win95-inner-content !p-0">
          <textarea
            className="w-full h-full text-xs font-mono leading-relaxed resize-none outline-none mx-0 p-2 !border-none !border-0 !box-shadow"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              fontFamily: "MS Sans Serif, monospace",
              border: "none",
              borderWidth: "0px",
              borderStyle: "none !important" as any,
              backgroundColor: "transparent",
              color: isDarkMode ? "#ffffff" : "#000000",
            }}
            spellCheck={false}
          />
        </div>
      </div>
    </WindowFrame>
  )
}
