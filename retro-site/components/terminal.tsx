"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { WindowFrame } from "./window-frame"

interface TerminalProps {
  id: string
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
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
}

export function Terminal({
  id,
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
}: TerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([
    "Microsoft Windows 95 [Version 4.00.950]",
    "Copyright (C) Microsoft Corp 1981-1995.",
    "",
    "Enhanced Terminal - Code Editor Mode",
    "Type 'help' for available commands",
    "",
    "C:\\WINDOWS>",
  ])
  const [currentPath, setCurrentPath] = useState("C:\\WINDOWS")
  const [isDevServerRunning, setIsDevServerRunning] = useState(false)
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  const [files, setFiles] = useState<Record<string, string>>({
    "package.json": `{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`,
    "README.md": "# My Project\n\nA sample project created in Cursor terminal.",
    "app.tsx": `import React from 'react'

export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}`,
  })
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileTreeExpanded, setFileTreeExpanded] = useState<Record<string, boolean>>({
    src: true,
    components: true,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Focus input when terminal opens
    if (inputRef.current && !isMinimized) {
      inputRef.current.focus()
    }
  }, [isMinimized])

  useEffect(() => {
    // Auto-scroll to bottom when new content is added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const getFileTree = () => {
    const tree: Record<string, any> = {
      src: {
        type: "folder",
        children: {
          components: {
            type: "folder",
            children: {},
          },
          pages: {
            type: "folder",
            children: {},
          },
        },
      },
      public: {
        type: "folder",
        children: {},
      },
    }

    // Add files to appropriate folders or root
    Object.keys(files).forEach((fileName) => {
      if (fileName.endsWith(".tsx") || fileName.endsWith(".jsx")) {
        tree.src.children.components.children[fileName] = { type: "file" }
      } else if (fileName.endsWith(".md") || fileName.endsWith(".json")) {
        tree[fileName] = { type: "file" }
      } else {
        tree.src.children[fileName] = { type: "file" }
      }
    })

    return tree
  }

  const renderFileTree = (tree: Record<string, any>, level = 0) => {
    return Object.entries(tree).map(([name, item]) => {
      const indent = "  ".repeat(level)

      if (item.type === "folder") {
        const isExpanded = fileTreeExpanded[name] !== false
        return (
          <div key={name}>
            <div
              className="cursor-pointer hover:bg-green-900 hover:bg-opacity-30 px-1"
              onClick={() => setFileTreeExpanded((prev) => ({ ...prev, [name]: !isExpanded }))}
            >
              {indent}
              {isExpanded ? "📂" : "📁"} {name}
            </div>
            {isExpanded && item.children && <div>{renderFileTree(item.children, level + 1)}</div>}
          </div>
        )
      } else {
        const isSelected = selectedFile === name
        return (
          <div
            key={name}
            className={`cursor-pointer hover:bg-green-900 hover:bg-opacity-30 px-1 ${
              isSelected ? "bg-green-800 bg-opacity-50" : ""
            }`}
            onClick={() => setSelectedFile(name)}
          >
            {indent}📄 {name}
          </div>
        )
      }
    })
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text")
    if (
      pastedText.includes("import") ||
      pastedText.includes("function") ||
      pastedText.includes("const") ||
      pastedText.includes("<")
    ) {
      // Looks like code, create a file
      const fileName = `pasted-code-${Date.now()}.${pastedText.includes("<") ? "tsx" : "js"}`
      setFiles((prev) => ({ ...prev, [fileName]: pastedText }))
      const newHistory = [...history]
      newHistory.push(`Code pasted and saved as ${fileName}`)
      newHistory.push(`File size: ${pastedText.length} characters`)
      newHistory.push(`Type 'cat ${fileName}' to view or 'run ${fileName}' to execute`)
      newHistory.push("")
      newHistory.push(`${currentPath}>`)
      setHistory(newHistory)
      setInput("")
      e.preventDefault()
    }
  }

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    const args = command.trim().split(" ")
    const newHistory = [...history, `${currentPath}>${command}`]

    switch (cmd) {
      case "dir":
      case "ls":
        newHistory.push(
          " Volume in drive C has no label.",
          " Volume Serial Number is 1234-5678",
          "",
          " Directory of " + currentPath,
          "",
          "12/15/2024  10:30 AM    <DIR>          .",
          "12/15/2024  10:30 AM    <DIR>          ..",
        )
        Object.keys(files).forEach((fileName) => {
          const size = files[fileName].length
          newHistory.push(`12/15/2024  11:00 AM         ${size.toString().padStart(8)} ${fileName}`)
        })
        newHistory.push(
          `               ${Object.keys(files).length} File(s)`,
          "               2 Dir(s)   1,234,567,890 bytes free",
          "",
        )
        break
      case "cls":
        setHistory([`${currentPath}>`])
        setInput("")
        return
      case "help":
        newHistory.push(
          "Enhanced Terminal Commands:",
          "",
          "Basic Commands:",
          "CD             Changes the current directory",
          "CLS            Clears the screen",
          "DIR/LS         Displays files and directories",
          "EXIT           Quits the terminal",
          "",
          "Development Commands:",
          "CAT <file>     Display file contents",
          "RUN <file>     Execute JavaScript/TypeScript file",
          "NPM INSTALL    Install dependencies",
          "NPM START      Start development server",
          "NPM RUN DEV    Start development server",
          "OPEN BROWSER   Open project in browser",
          "CREATE PROJECT Create new project",
          "",
          "Paste code directly into terminal to create files!",
          "",
        )
        break
      case "ver":
        newHistory.push("Enhanced Terminal v2.0 - Code Editor Mode", "Microsoft Windows 95 [Version 4.00.950]", "")
        break
      case "exit":
        onClose()
        return
      case "npm install":
        newHistory.push(
          "Installing dependencies...",
          "✓ react@18.2.0",
          "✓ next@14.0.0",
          "✓ typescript@5.0.0",
          "✓ tailwindcss@3.3.0",
          "",
          "Dependencies installed successfully!",
          "",
        )
        break
      case "npm start":
      case "npm run dev":
        setIsDevServerRunning(true)
        newHistory.push(
          "Starting development server...",
          "",
          "▲ Next.js 14.0.0",
          "- Local:        http://localhost:3000",
          "- Network:      http://192.168.1.100:3000",
          "",
          "✓ Ready in 2.3s",
          "○ Compiling / ...",
          "✓ Compiled successfully",
          "",
          "Development server is running!",
          "Type 'open browser' to view in browser",
          "",
        )
        break
      case "open browser":
        if (isDevServerRunning) {
          newHistory.push(
            "Opening browser...",
            "🌐 http://localhost:3000",
            "",
            "Browser opened successfully!",
            "Your app is now running in the browser.",
            "",
          )
        } else {
          newHistory.push("Error: Development server is not running", "Run 'npm run dev' first to start the server", "")
        }
        break
      case "create project":
        setCurrentProject("my-app")
        newHistory.push(
          "Creating new project...",
          "",
          "✓ Created project directory",
          "✓ Initialized package.json",
          "✓ Set up TypeScript configuration",
          "✓ Installed dependencies",
          "",
          "Project 'my-app' created successfully!",
          "You can now paste code and run 'npm run dev'",
          "",
        )
        break
      default:
        if (args[0] === "cat" && args[1]) {
          const fileName = args[1]
          if (files[fileName]) {
            newHistory.push("", "File contents:", "")
            const lines = files[fileName].split("\n")
            lines.forEach((line) => newHistory.push(line))
            newHistory.push("")
          } else {
            newHistory.push(`File '${fileName}' not found`, "")
          }
        } else if (args[0] === "run" && args[1]) {
          const fileName = args[1]
          if (files[fileName]) {
            newHistory.push(
              `Executing ${fileName}...`,
              "",
              "✓ Code compiled successfully",
              "✓ No errors found",
              "✓ Execution completed",
              "",
              "Output: [Simulated execution - code would run here]",
              "",
            )
          } else {
            newHistory.push(`File '${fileName}' not found`, "")
          }
        } else if (cmd.startsWith("cd ")) {
          newHistory.push(`The system cannot find the path specified.`, "")
        } else if (cmd) {
          newHistory.push(
            `'${command}' is not recognized as an internal or external command,`,
            "operable program or batch file.",
            "Type 'help' for available commands.",
            "",
          )
        }
        break
    }

    newHistory.push(`${currentPath}>`)
    setHistory(newHistory)
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input)
    }
  }

  return (
    <WindowFrame
      id={id}
      title={`${isDevServerRunning ? "🟢 " : ""}Cursor - Code Editor${currentProject ? ` - ${currentProject}` : ""}`}
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      width={size?.width || 900}
      height={size?.height || 600}
      icon="/icons/console_prompt-0.png"
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
    >
      <div className="h-full bg-black text-green-400 font-mono text-sm flex">
        {/* File Tree Panel */}
        <div className="w-64 bg-gray-900 border-r border-green-600 p-2 overflow-y-auto">
          <div className="text-green-300 font-bold mb-2 border-b border-green-600 pb-1">📁 PROJECT EXPLORER</div>
          <div className="text-xs">{renderFileTree(getFileTree())}</div>

          {/* File Content Preview */}
          {selectedFile && files[selectedFile] && (
            <div className="mt-4 border-t border-green-600 pt-2">
              <div className="text-green-300 text-xs mb-1">Preview: {selectedFile}</div>
              <div className="bg-black p-2 rounded text-xs max-h-32 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-green-400">
                  {files[selectedFile].substring(0, 200)}
                  {files[selectedFile].length > 200 && "..."}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Terminal Panel */}
        <div className="flex-1 p-2 overflow-hidden flex flex-col" onClick={() => inputRef.current?.focus()}>
          <div ref={terminalRef} className="flex-1 overflow-y-auto whitespace-pre-wrap leading-tight">
            {history.map((line, index) => (
              <div key={index} className="min-h-[1.2em]">
                {line}
              </div>
            ))}
            <div className="flex">
              <span>{currentPath}&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                onPaste={handlePaste}
                className="flex-1 bg-transparent text-green-400 outline-none border-none ml-0 font-mono dark:bg-black dark:text-white"
                style={{ caretColor: "lime" }}
                autoComplete="off"
                spellCheck={false}
              />
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
