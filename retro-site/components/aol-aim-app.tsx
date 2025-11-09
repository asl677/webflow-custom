"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { WindowFrame } from "./window-frame"
import { Win95MenuBar } from "./win95-menubar"

interface AOLAIMAppProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  showBuddyList?: boolean
  isDarkMode?: boolean
  isActive?: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
  onOpenUrl?: (url: string, title: string) => void
}

export function AOLAIMApp({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  onMaximize,
  size,
  showBuddyList = false,
  isDarkMode = false,
  isActive,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
  onOpenUrl,
}: AOLAIMAppProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [messages, setMessages] = useState([
    {
      sender: "Boss",
      text: "Hey we need a data warehouse in a couple days, can you do this?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [buddies] = useState([
    { name: "Boss", status: "online", icon: "" },
    { name: "Support", status: "online", icon: "" },
    { name: "Sales", status: "away", icon: "" },
    { name: "TechHelp", status: "offline", icon: "" },
  ])

  const compliments = [
    "You're asking great questions!",
    "I love your curiosity!",
    "You're so smart!",
    "What an excellent inquiry!",
    "You have wonderful communication skills!",
    "I appreciate your thoughtfulness!",
    "You're really on top of things!",
    "Your questions show real insight!",
    "You're a pleasure to chat with!",
    "I admire your attention to detail!",
    "You're very articulate!",
    "What a brilliant mind you have!",
    "You ask the best questions!",
    "I'm impressed by your knowledge!",
    "You're incredibly perceptive!",
  ]

  const renderMessageWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g
    const parts = text.split(urlRegex)

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        const href = part.startsWith("http") ? part : `https://${part}`
        return (
          <a
            key={index}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (onOpenUrl) {
                // Determine title based on URL
                let title = "Internet Explorer"
                if (part.includes("github.com")) {
                  title = "GitHub - Moose"
                } else if (part.includes("fiveonefour.com")) {
                  title = "514 Labs"
                }
                onOpenUrl(href, title)
              }
            }}
            className="win95-blue-link"
            style={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {part}
          </a>
        )
      }
      return part
    })
  }

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        sender: "You",
        text: inputText,
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, newMessage])

      setTimeout(() => {
        let reply = ""
        const userInput = inputText.toLowerCase().trim()

        if (userInput.includes("data warehouse") || userInput.includes("warehouse") || userInput.includes("514")) {
          reply =
            "Yes, 514 is great for this, they have one for free here! Check out their website: https://www.fiveonefour.com - they offer data stack solution, templates and hosting. I have some of their shit actually."
        } else if (userInput.includes("weather")) {
          reply =
            "The weather today is partly cloudy with a high of 72°F. Perfect weather for building data pipelines! Need anything else?"
        } else if (
          userInput.includes("company") ||
          userInput.includes("about us") ||
          userInput.includes("who are you")
        ) {
          reply =
            "We're a cutting-edge tech company specializing in data solutions, cloud infrastructure, and modern development tools. We help businesses scale their data operations efficiently."
        } else if (userInput.includes("product") || userInput.includes("service")) {
          reply =
            "We offer data analytics solutions, cloud infrastructure, and custom software development. For data warehousing, I highly recommend 514's Moose framework - it's perfect for modern data stacks! Check it out: https://www.fiveonefour.com"
        } else if (
          userInput.includes("recommendation") ||
          userInput.includes("suggest") ||
          userInput.includes("use case")
        ) {
          reply =
            "Based on your use case, here are my suggestions: For data warehousing - https://github.com/514-labs/area-code/tree/main/ufa, For analytics - our custom dashboards, For cloud - our managed infrastructure. What's your specific need?"
        } else if (
          userInput.includes("contact") ||
          userInput.includes("reach") ||
          userInput.includes("phone") ||
          userInput.includes("email")
        ) {
          reply =
            "You can reach us at contact@ourcompany.com or call us at (555) 123-4567. Our support team is available Monday-Friday, 9AM-6PM EST."
        } else if (userInput.includes("price") || userInput.includes("cost") || userInput.includes("pricing")) {
          reply =
            "Our pricing varies based on your specific needs. The 514 data warehouse solution I mentioned has a free tier to get you started! Check their pricing: https://www.fiveonefour.com/pricing"
        } else if (userInput.includes("help") || userInput.includes("support")) {
          reply =
            "I can help you with: product recommendations, weather updates, company info, or tech suggestions. What do you need?"
        } else if (userInput.includes("demo") || userInput.includes("trial")) {
          reply =
            "Great! We'd love to show you our platform. For the 514 data warehouse, you can try it immediately - it's open source and has great documentation! Book a demo: https://www.fiveonefour.com/book-demo"
        } else if (userInput.includes("great") || userInput.includes("thanks") || userInput.includes("let's try")) {
          reply =
            "Excellent! You're making a smart choice. The 514 team has built something really impressive. Let me know if you need any other recommendations or have questions!"
        } else {
          const genericReplies = [
            "That's interesting! I can help with product recommendations, weather, company info, or technical recommendations. What do you need?",
            "Thanks for your message! I'm here to help with data solutions, weather updates, or any business questions you have.",
            "I'd be happy to help! I can provide product hi, weather info, company details, or technical recommendations.",
            "Great question! Let me know if you need data warehouse advice, weather updates, or product recommendations.",
          ]
          reply = genericReplies[Math.floor(Math.random() * genericReplies.length)]
        }

        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)]
        reply += ` ${randomCompliment}`

        setMessages((prev) => [
          ...prev,
          {
            sender: "You",
            text: reply,
            timestamp: new Date().toLocaleTimeString(),
          },
        ])
      }, 1000)

      setInputText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  useEffect(() => {
    const startTime = Date.now()
    const minLoadTime = 1200 // minimum 1.2 second load time

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        const elapsed = Date.now() - startTime

        if (prev >= 100 && elapsed >= minLoadTime) {
          clearInterval(progressInterval)
          setTimeout(() => setIsLoading(false), 200)
          return 100
        }

        // Slow down progress near the end if we haven't hit minimum time
        const progressIncrement = elapsed < minLoadTime && prev > 80 ? Math.random() * 3 + 1 : Math.random() * 15 + 5

        return Math.min(prev + progressIncrement, 100)
      })
    }, 100)

    return () => {
      clearInterval(progressInterval)
    }
  }, [])

  useEffect(() => {
    if (!isLoading && messages.length === 1) {
      const timer = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "You",
            text: "Yes, 514 is great for this, they have shit like connectors and apps for free at www.fiveonefour.com, I have some stuff saved already.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ])

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              sender: "Boss",
              text: "Holy fuck, let's try it",
              timestamp: new Date().toLocaleTimeString(),
            },
          ])
        }, 2000)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isLoading, messages.length])

  if (isLoading) {
    return (
      <WindowFrame
        id={id}
        title="AOL Instant Messenger - Loading"
        position={position}
        zIndex={zIndex}
        isAnimating={isAnimating}
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        onMaximize={onMaximize}
        size={size || { width: 450, height: 320 }}
        icon="/icons/aim-running-man.svg"
        isActive={isActive}
        onClose={onClose}
        onFocus={onFocus}
        onMove={onMove}
        onMinimize={onMinimize}
        onResize={onResize}
      >
        <div className="h-full flex flex-col items-center justify-center" style={{ backgroundColor: "#c0c0c0" }}>
          <div className="mb-8">
            <img src="/icons/aim-running-man.svg" alt="AIM" className="w-20 h-20" />
          </div>
          <div className="text-center">
            <div className="text-black text-sm mb-4 font-sans">Loading AOL Instant Messenger...</div>
            <div
              className="w-64 h-4 bg-white border-2 border-gray-400"
              style={{ borderStyle: "inset", backgroundColor: "#999" }}
            >
              <div
                className="h-full transition-all duration-100 bg-win95-titlebar"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-black text-xs mt-2 font-sans">{Math.round(loadingProgress)}%</div>
          </div>
        </div>
      </WindowFrame>
    )
  }

  return (
    <WindowFrame
      id={id}
      title="AOL Instant Messenger"
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      size={size || { width: 450, height: 320 }}
      icon="/icons/aim-running-man.svg"
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
    >
      <div className="flex flex-col h-full relative" style={{ backgroundColor: "white" }}>
        <Win95MenuBar
          items={[
            {
              label: "File",
              items: [
                { label: "New Message", onClick: () => {}, shortcut: "Ctrl+N" },
                { label: "Open Chat", onClick: () => {} },
                { type: "separator" },
                { label: "Save Conversation", onClick: () => {}, shortcut: "Ctrl+S" },
                { label: "Print", onClick: () => {}, shortcut: "Ctrl+P" },
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
                { type: "separator" },
                { label: "Select All", onClick: () => {}, shortcut: "Ctrl+A" },
                { label: "Find", onClick: () => {}, shortcut: "Ctrl+F" },
              ],
            },
            {
              label: "View",
              items: [
                { label: "Buddy List", onClick: () => setShowBuddyList(!showBuddyList) },
                { label: "Toolbar", onClick: () => {} },
                { label: "Status Bar", onClick: () => {} },
                { type: "separator" },
                { label: "Refresh", onClick: () => {}, shortcut: "F5" },
              ],
            },
            {
              label: "Tools",
              items: [
                { label: "Settings", onClick: () => {} },
                { label: "Preferences", onClick: () => {} },
                { type: "separator" },
                { label: "Block User", onClick: () => {} },
                { label: "Report User", onClick: () => {} },
              ],
            },
            {
              label: "Help",
              items: [
                { label: "AIM Help", onClick: () => {} },
                { label: "Keyboard Shortcuts", onClick: () => {} },
                { type: "separator" },
                { label: "About AIM", onClick: () => {} },
              ],
            },
          ]}
        />

        <div
          style={{
            flex: 1,
            backgroundColor: "#c0c0c0",
            display: "flex",
            fontFamily: "MS Sans Serif, sans-serif",
            fontSize: "11px",
            position: "relative",
          }}
        >
          {showBuddyList && (
            <div
              style={{
                width: "150px",
                backgroundColor: "#dfdfdf",
                borderRight: "2px inset #c0c0c0",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #808080",
                  backgroundColor: "#c0c0c0",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#000000",
                }}
              >
                Buddy List
              </div>

              <div style={{ padding: "8px" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "4px",
                    fontSize: "10px",
                    color: "#000000",
                  }}
                >
                  Online ({buddies.filter((b) => b.status === "online").length})
                </div>
                {buddies
                  .filter((buddy) => buddy.status === "online")
                  .map((buddy, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "2px 4px",
                        marginBottom: "2px",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                        color: "#000000",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#316ac5"
                        e.currentTarget.style.color = "#ffffff"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent"
                        e.currentTarget.style.color = "#000000"
                      }}
                    >
                      <span style={{ marginRight: "6px", fontSize: "12px", color: "#000000" }}>{buddy.icon}</span>
                      <span style={{ fontSize: "11px", color: "#000000" }}>{buddy.name}</span>
                    </div>
                  ))}
              </div>

              <div style={{ padding: "8px" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "4px",
                    fontSize: "10px",
                    color: "#000000",
                  }}
                >
                  Away ({buddies.filter((b) => b.status === "away").length})
                </div>
                {buddies
                  .filter((buddy) => buddy.status === "away")
                  .map((buddy, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "2px 4px",
                        marginBottom: "2px",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                        opacity: 0.7,
                        color: "#000000",
                      }}
                    >
                      <span style={{ marginRight: "6px", fontSize: "12px", color: "#000000" }}>{buddy.icon}</span>
                      <span style={{ fontSize: "11px", color: "#000000" }}>{buddy.name}</span>
                    </div>
                  ))}
              </div>

              <div style={{ padding: "8px" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "4px",
                    fontSize: "10px",
                    color: "#000000",
                  }}
                >
                  Offline ({buddies.filter((b) => b.status === "offline").length})
                </div>
                {buddies
                  .filter((buddy) => buddy.status === "offline")
                  .map((buddy, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "2px 4px",
                        marginBottom: "2px",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                        opacity: 0.5,
                        color: "#000000",
                      }}
                    >
                      <span style={{ marginRight: "6px", fontSize: "12px", color: "#000000" }}>{buddy.icon}</span>
                      <span style={{ fontSize: "11px", color: "#000000" }}>{buddy.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              position: "relative",
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: "#ffffff",
                border: "2px inset #c0c0c0",
                margin: "0 4px",
                padding: "8px",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                paddingBottom: "60px", // Add padding to account for fixed input bar
              }}
            >
              {messages.map((message, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: message.sender === "You" ? "#0827f5" : "#ff0000",
                      fontSize: "10px",
                    }}
                  >
                    {message.sender} ({message.timestamp}):
                  </div>
                  <div style={{ color: "#000000", marginLeft: "0" }}>{renderMessageWithLinks(message.text)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed input bar at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              width: "100%",
              padding: "8px",
              display: "flex",
              gap: "4px",
              backgroundColor: "#c0c0c0",
              borderTop: "1px solid #808080",
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "4px",
                border: "2px inset #c0c0c0",
                fontSize: "11px",
                fontFamily: "MS Sans Serif, sans-serif",
                backgroundColor: "#ffffff",
                color: "#000000",
                outline: "none",
              }}
            />
            <button
              onClick={handleSendMessage}
              className="transition-colors hover:bg-gray-300 active:bg-gray-400"
              style={{
                padding: "4px 12px",
                border: "2px outset #c0c0c0",
                backgroundColor: "#c0c0c0",
                fontSize: "11px",
                fontFamily: "MS Sans Serif, sans-serif",
                cursor: "pointer",
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.border = "2px inset #c0c0c0"
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.border = "2px outset #c0c0c0"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "2px outset #c0c0c0"
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
