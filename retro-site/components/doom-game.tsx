"use client"

import { WindowFrame } from "./window-frame"
import { Win95MenuBar } from "./win95-menubar"

interface DoomGameProps {
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
  onMinimize?: () => void
  onResize?: (size: { width: number; height: number }) => void
}

export function DoomGame({
  id,
  position,
  zIndex,
  isAnimating = false,
  isMinimized = false,
  isMaximized = false,
  onMaximize,
  size = { width: 640, height: 480 },
  isActive = true,
  isDarkMode = false,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
}: DoomGameProps) {
  return (
    <WindowFrame
      id={id}
      title="DOOM"
      icon="/icons/doom.png"
      position={position}
      size={size}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      isActive={isActive}
      onClose={onClose}
      onMove={onMove}
      onResize={onResize}
      onFocus={onFocus}
      onMinimize={onMinimize}
      resizable={true}
      aspectRatio={4 / 3} // Added 4:3 aspect ratio lock for game window
      customFooterContent={
        <div className="flex justify-between w-full">
          <span>Ready</span>
        </div>
      }
    >
      <div className="flex flex-col h-full bg-win95-window mx-2">
        {/* Menu bar */}
        <Win95MenuBar
          items={[
            {
              label: "File",
              items: [
                { label: "New Game", onClick: () => {} },
                { label: "Load Game", onClick: () => {}, shortcut: "Ctrl+L" },
                { type: "separator" },
                { label: "Save Game", onClick: () => {}, shortcut: "Ctrl+S" },
                { label: "Save As...", onClick: () => {} },
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
              label: "Help",
              items: [
                { label: "Doom Help", onClick: () => {} },
                { label: "Keyboard Shortcuts", onClick: () => {} },
                { type: "separator" },
                { label: "About Doom", onClick: () => {} },
              ],
            },
          ]}
        />

        {/* Game area */}
        <div
          className="flex-1"
          style={{
            backgroundColor: "#000000",
            border: "2px solid",
            borderColor: isDarkMode 
              ? "#666 #333 #333 #666" 
              : "#555 rgb(223, 223, 223) rgb(223, 223, 223) #555",
          }}
        >
          <iframe
            src="https://archive.org/embed/doom-2-play"
            className="w-full h-full border-0"
            frameBorder="0"
            title="DOOM"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </WindowFrame>
  )
}

export default DoomGame
