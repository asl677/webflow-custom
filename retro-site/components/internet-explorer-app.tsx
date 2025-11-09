"use client"

import type React from "react"
import { WindowFrame } from "./window-frame"
import { useState, useEffect } from "react"
import { SplashScreen } from "./splash-screen"
import { Win95MenuBar } from "./win95-menubar"

interface InternetExplorerAppProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  isActive?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  initialTab?: string
  initialUrl?: string
  initialTitle?: string
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize?: () => void
  onResize?: (size: { width: number; height: number }) => void
}
 

function AnimatedLineChart({ isMobile }: { isMobile: boolean }) {
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev + 1) % 100)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const chartWidth = isMobile ? 200 : 300
  const chartHeight = isMobile ? 60 : 80

  const dataPoints = Array.from({ length: 20 }, (_, i) => {
    const baseY = chartHeight / 2
    const wave = Math.sin((i + animationProgress) * 0.3) * 15
    const trend = i * 2 - 10
    return {
      x: (i / 19) * chartWidth,
      y: baseY + wave + trend,
    }
  })

  const pathData = dataPoints.map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")

  return (
    <div className="flex justify-center mb-4">
      <div className="border border-white p-2 bg-black">
        <svg width={chartWidth} height={chartHeight} className="block" style={{ imageRendering: "pixelated" }}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#333" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d={pathData} fill="none" stroke="white" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
          {dataPoints.map((point, i) => (
            <rect key={i} x={point.x - 1} y={point.y - 1} width="2" height="2" fill="white" />
          ))}
        </svg>
        <div className="text-center text-xs text-white mt-1 font-mono">
          ANALYTICS ▲ {(50 + Math.sin(animationProgress * 0.1) * 20).toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

function MySpaceContent({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: "#000033" }}>
      {/* Header with navigation */}
      <div className="relative">
        <div className="flex items-center justify-between p-4 border-b-2 border-yellow-400">
          <div className="flex items-center gap-4">
            <div className="bg-win95-titlebar text-white px-4 py-2 font-bold text-xl border-2 border-white">
              BLOCKBUSTER
            </div>
            <div className="text-yellow-400 font-bold text-2xl">VIDEO</div>
            <div className="text-yellow-400 font-bold text-2xl">MUSIC</div>
          </div>
          <div className="flex gap-4 text-white text-sm">
            <a href="#" className="hover:text-yellow-400">
              The Company
            </a>
            <a href="#" className="hover:text-yellow-400">
              Web Guide
            </a>
            <a href="#" className="hover:text-yellow-400">
              Contact Us
            </a>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex">
          {/* Left sidebar */}
          <div className="w-64 bg-win95-titlebar p-4">
            <div className="text-center mb-4">
              <div className="bg-yellow-400 text-black px-2 py-1 font-bold text-sm mb-2">All New</div>
              <div className="bg-yellow-400 text-black px-2 py-1 font-bold text-sm">GUARANTEE!</div>
            </div>

            <div className="space-y-4">
              <div className="bg-orange-500 p-2 text-center">
                <img src="/abstract-movie-poster.png" alt="Movie poster" className="w-full h-20 object-cover mb-2" />
                <div className="text-white text-xs font-bold">THIS MONTH'S PICK</div>
              </div>

              <div className="text-white text-xs">
                <div className="font-bold mb-2">Can't Go To Dallas?</div>
                <img src="/generic-cartoon-character.png" alt="Cartoon" className="w-full h-16 object-cover" />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-8">
            <div className="text-center mb-8">
              <div className="text-yellow-400 text-sm mb-2">WELCOME to</div>
              <div className="text-blue-400 font-bold text-4xl mb-4">Blockbuster Online!</div>

              <div className="flex items-start gap-6 flex-col">
                <div className="flex-1 text-left">
                  <p className="text-white mb-4">
                    Preview, purchase videos, and get the latest in-store specials at the{" "}
                    <span className="text-yellow-400 font-bold">Blockbuster Online Video Store</span>. Not all videos
                    are available to buy, but click on New Releases or browse by category with Favorites; find a title
                    to rent on the next trip to your local store.
                  </p>

                  <p className="text-white mb-6">
                    Come in and get acquainted with over 200,000 music titles. Listen to soundbytes. Check out a genre
                    or two. Read an interview. Then, buy away!
                  </p>
                </div>

                <div className="w-32"></div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="border border-neutral-400 p-4 mb-6">
              <p className="text-white text-sm">
                Have some comments or concerns about the redesigned Blockbuster site? We want to hear about it — but
                first check the <span className="text-yellow-400 underline">FAQ page</span> to see if your concerns have
                already been addressed.
              </p>
            </div>

            <div className="text-center text-xs text-neutral-400">
              <p>BLOCKBUSTER name, design and related marks are trademarks of Blockbuster Entertainment Inc.</p>
              <p>© 1998 Blockbuster Entertainment Inc. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoogleContent({ isMobile }: { isMobile: boolean }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [currentQuery, setCurrentQuery] = useState("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCurrentQuery(searchQuery)
      setShowResults(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleLuckySearch = () => {
    if (searchQuery.trim()) {
      setCurrentQuery(searchQuery)
      setShowResults(true)
    }
  }

  const handleBackToSearch = () => {
    setShowResults(false)
    setSearchQuery("")
    setCurrentQuery("")
  }

  const getFakeResults = (query: string) => {
    const baseResults = [
      {
        title: `${query} - Official Website`,
        url: `http://www.${query.toLowerCase().replace(/\s+/g, "")}.com`,
        description: `The official website for ${query}. Find information, products, and services related to ${query}.`,
      },
      {
        title: `${query} - Wikipedia, the free encyclopedia`,
        url: `http://www.wikipedia.org/wiki/${query.replace(/\s+/g, "_")}`,
        description: `${query} is a topic covered extensively on Wikipedia. Learn about the history, background, and details of ${query}.`,
      },
      {
        title: `${query} News and Updates`,
        url: `http://news.${query.toLowerCase().replace(/\s+/g, "")}.com`,
        description: `Latest news and updates about ${query}. Stay informed with the most recent developments and announcements.`,
      },
      {
        title: `${query} Community Forum`,
        url: `http://forum.${query.toLowerCase().replace(/\s+/g, "")}.org`,
        description: `Join the ${query} community forum to discuss, share experiences, and get help from other users.`,
      },
      {
        title: `${query} Reviews and Ratings`,
        url: `http://reviews.${query.toLowerCase().replace(/\s+/g, "")}.net`,
        description: `Read reviews and ratings for ${query}. See what other people think and make informed decisions.`,
      },
      {
        title: `${query} - Amazon.com`,
        url: `http://www.amazon.com/s?k=${query.replace(/\s+/g, "+")}`,
        description: `Shop for ${query} on Amazon.com. Find great deals, fast shipping, and customer reviews.`,
      },
      {
        title: `${query} Tutorial and Guide`,
        url: `http://tutorial.${query.toLowerCase().replace(/\s+/g, "")}.info`,
        description: `Learn about ${query} with our comprehensive tutorial and guide. Step-by-step instructions included.`,
      },
      {
        title: `${query} - Yahoo! Directory`,
        url: `http://dir.yahoo.com/search?p=${query.replace(/\s+/g, "+")}`,
        description: `${query} directory listing on Yahoo!. Find related websites and resources in our web directory.`,
      },
    ]
    return baseResults.slice(0, 8) // Return 8 results
  }

  if (showResults) {
    const results = getFakeResults(currentQuery)

    return (
      <div
        className="flex-1 overflow-auto bg-white"
        style={{ boxShadow: "inset -1px -1px 0 #dfdfdf, inset 1px 1px 0 #808080" }}
      >
        <div className="p-4">
          {/* Search bar at top */}
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-300">
            <img
              src="/images/google-1998-logo.png"
              alt="Google!"
              className="h-8 w-auto"
              style={{ imageRendering: "pixelated" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-2 py-1 border border-gray-400 text-black text-sm"
              style={{ fontFamily: "monospace" }}
            />
            <button
              onClick={handleSearch}
              className="px-3 py-1 border-2 border-gray-400 bg-gray-200 text-black text-xs hover:bg-gray-300"
              style={{
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              Search
            </button>
          </div>

          {/* Results info */}
          <div className="text-sm text-black mb-4">
            Searched the web for <strong>{currentQuery}</strong>. Results <strong>1-8</strong> of about{" "}
            <strong>{Math.floor(Math.random() * 50000) + 10000}</strong>. Search took{" "}
            <strong>
              0.{Math.floor(Math.random() * 9) + 1}
              {Math.floor(Math.random() * 9)}
            </strong>{" "}
            seconds.
          </div>

          {/* Search results */}
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="mb-4">
                <div className="win95-blue-link text-base hover:text-purple-600 cursor-pointer mb-1">
                  {result.title}
                </div>
                <div className="text-black text-sm mb-1">{result.description}</div>
                <div className="text-green-700 text-xs">{result.url}</div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleBackToSearch}
                className="px-3 py-1 border-2 border-gray-400 bg-gray-200 text-black text-xs hover:bg-gray-300"
                style={{
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                New Search
              </button>
              <span className="win95-blue-link cursor-pointer">Next</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex-1 overflow-auto bg-white"
      style={{ boxShadow: "inset -1px -1px 0 #dfdfdf, inset 1px 1px 0 #808080" }}
    >
      <div className="flex flex-col items-center justify-center min-h-full p-8">
        {/* Google Logo */}
        <div className="mb-6">
          <img
            src="/images/google-1998-logo.png"
            alt="Google!"
            className="h-16 w-auto"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* Search section */}
        <div className="w-full max-w-md mb-6">
          <div className="text-center mb-4 text-black text-sm">Search the web using Google!</div>

          <div className="flex items-center justify-center mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-64 px-2 py-1 border-2 border-black text-black"
              style={{ fontFamily: "monospace" }}
              placeholder=""
            />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              className="px-3 py-1 border-2 border-gray-400 bg-gray-200 text-black text-xs hover:bg-gray-300"
              style={{
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              10 results
            </button>
            <button
              onClick={handleSearch}
              className="px-3 py-1 border-2 border-gray-400 bg-gray-200 text-black text-xs hover:bg-gray-300"
              style={{
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              Google Search
            </button>
            <button
              onClick={handleLuckySearch}
              className="px-3 py-1 border-2 border-gray-400 bg-gray-200 text-black text-xs hover:bg-gray-300"
              style={{
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              I'm feeling lucky
            </button>
          </div>

          {/* About Google link */}
          <div className="mb-6">
            <a href="#" className="win95-blue-link text-lg">
              About Google!
            </a>
          </div>

          {/* Links section */}
          <div className="flex gap-4 mb-6">
            <a href="#" className="win95-blue-link text-sm">
              Stanford Search
            </a>
            <a href="#" className="win95-blue-link text-sm">
              Linux Search
            </a>
          </div>

          {/* Updates section */}
          <div className="bg-gray-200 p-4 mb-6 border border-gray-400 w-full max-w-md">
            <div className="text-center text-black text-sm mb-3">Get Google updates monthly!</div>
            <div className="flex items-center justify-center gap-2">
              <input
                type="email"
                placeholder="your e-mail"
                className="px-2 py-1 border border-gray-400 text-black text-sm flex-1"
              />
              <button
                className="px-3 py-1 border-2 border-gray-400 bg-gray-200 text-black text-xs hover:bg-gray-300"
                style={{
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                Subscribe
              </button>
              <a href="#" className="win95-blue-link text-xs">
                Archive
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-black">Copyright ©1997-8 Stanford University</div>
        </div>
      </div>
    </div>
  )
}

export function InternetExplorerApp({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  isActive,
  onMaximize,
  size,
  initialTab = "home",
  initialUrl,
  initialTitle,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
}: InternetExplorerAppProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false
  const [activeTab, setActiveTab] = useState(initialTab)

  const tabs = [
    { id: "home", label: "fiveonefour.com", url: "http://www.fiveonefour.com" },
    { id: "myspace", label: "Blockbuster Video", url: "http://www.myspace.com" },
    { id: "google", label: "Google Search", url: "http://www.google.com" },
  ]

  useEffect(() => {
    if (initialUrl) {
      // Check if initialUrl matches any tab's URL or contains key domains
      if (initialUrl.includes("fiveonefour.com") || initialUrl.includes("github.com/514-labs")) {
        setActiveTab("home")
      } else if (initialUrl.includes("myspace.com") || initialUrl.includes("blockbuster")) {
        setActiveTab("myspace")
      } else if (initialUrl.includes("google.com")) {
        setActiveTab("google")
      } else {
        // If it's a tab ID, use it directly
        const matchingTab = tabs.find((tab) => tab.id === initialUrl)
        if (matchingTab) {
          setActiveTab(initialUrl)
        }
      }
    }
  }, [initialUrl])

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            setIsLoading(false)
            clearInterval(interval)
            return 100
          }
          return prev + 5 // slower progress increment for longer loading
        })
      }, 500) // 500ms intervals for longer loading duration

      return () => clearInterval(interval)
    }
  }, [isLoading])

  const getCurrentTabTitle = () => {
    if (initialTitle && activeTab === initialTab) {
      return initialTitle
    }
    return tabs.find((tab) => tab.id === activeTab)?.label || "fiveonefour.com"
  }

  return (
    <WindowFrame
      id={id}
      title={`Internet Explorer - ${getCurrentTabTitle()}`}
      position={position}
      zIndex={zIndex}
      width={size?.width || 800}
      height={size?.height || 490} // Reduced default height from 530 to 490 (40px shorter)
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive}
      onMaximize={onMaximize}
      icon="/icons/msie1-2.png"
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
    >
      {isLoading ? (
        <SplashScreen
          title="Internet Explorer"
          version="1.0"
          image="/images/ie-splash.png"
          description="Internet Explorer is initializing its web browsing engine and network protocols. The application is loading HTML rendering components, JavaScript interpreter, and security modules. Network connectivity is being established to provide seamless web navigation and content display capabilities."
          copyright="© 514 all rights reserved 2025"
          company="Global"
          progress={loadingProgress}
        />
      ) : (
        <div className="bg-black text-white h-full flex flex-col font-mono internet-explorer-app !mx-2">
          {/* Standardized Win95MenuBar */}
          <Win95MenuBar
            items={[
              {
                label: "File",
                items: [
                  { label: "New Window", onClick: () => {}, shortcut: "Ctrl+N" },
                  { label: "Open...", onClick: () => {}, shortcut: "Ctrl+O" },
                  { type: "separator" },
                  { label: "Save", onClick: () => {}, shortcut: "Ctrl+S" },
                  { label: "Save As...", onClick: () => {} },
                  { type: "separator" },
                  { label: "Print...", onClick: () => {}, shortcut: "Ctrl+P" },
                  { type: "separator" },
                  { label: "Close", onClick: onClose },
                ],
              },
              {
                label: "Edit",
                items: [
                  { label: "Cut", onClick: () => {}, shortcut: "Ctrl+X" },
                  { label: "Copy", onClick: () => {}, shortcut: "Ctrl+C" },
                  { label: "Paste", onClick: () => {}, shortcut: "Ctrl+V" },
                  { type: "separator" },
                  { label: "Select All", onClick: () => {}, shortcut: "Ctrl+A" },
                  { label: "Find...", onClick: () => {}, shortcut: "Ctrl+F" },
                ],
              },
              {
                label: "View",
                items: [
                  { label: "Toolbar", onClick: () => {} },
                  { label: "Status Bar", onClick: () => {} },
                  { type: "separator" },
                  { label: "Refresh", onClick: () => {}, shortcut: "F5" },
                  { label: "Source", onClick: () => {} },
                ],
              },
              {
                label: "Go",
                items: [
                  { label: "Back", onClick: () => {}, shortcut: "Alt+←" },
                  { label: "Forward", onClick: () => {}, shortcut: "Alt+→" },
                  { type: "separator" },
                  { label: "Home", onClick: () => {} },
                  { label: "Search", onClick: () => {} },
                ],
              },
              {
                label: "Favorites",
                items: [
                  { label: "Add to Favorites", onClick: () => {} },
                  { label: "Organize Favorites", onClick: () => {} },
                  { type: "separator" },
                  { label: "Links", onClick: () => {} },
                  { label: "Channels", onClick: () => {} },
                ],
              },
              {
                label: "Help",
                items: [
                  { label: "Contents and Index", onClick: () => {}, shortcut: "F1" },
                  { label: "Tip of the Day", onClick: () => {} },
                  { type: "separator" },
                  { label: "About Internet Explorer", onClick: () => {} },
                ],
              },
            ]}
          />

          {/* Navigation bar */}
          <div
            className="border-neutral-600 flex items-center sticky top-0 z-10 py-0 gap-0 px-0 border-b-0"
            style={{ backgroundColor: "#c0c0c0" }}
          >
            <button className="px-2 py-1 text-xs text-black hover:bg-neutral-300 pointer-events-none">Address</button>
            <div className="flex-1 mx-2">
              <input
                type="text"
                value={tabs.find((tab) => tab.id === activeTab)?.url || ""}
                readOnly
                className="w-full py-1 text-xs border-2 bg-white text-black dark:bg-black dark:text-white px-2"
                style={{
                  borderTopColor: "#808080",
                  borderLeftColor: "#808080",
                  borderRightColor: "#dfdfdf",
                  borderBottomColor: "#808080",
                }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-neutral-400 border-b border-neutral-600 flex" style={{ backgroundColor: "#c0c0c0" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 text-sm font-normal relative !border-none ${
                  activeTab === tab.id ? "win95-tab-active" : ""
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? "#c0c0c0" : "#a0a0a0",
                  marginBottom: activeTab === tab.id ? "0px" : "0px",
                  paddingBottom: activeTab === tab.id ? "6px" : "4px",
                  fontFamily: "W95Font, 'MS Sans Serif', 'Microsoft Sans Serif', sans-serif",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "home" ? (
            <div className="flex-1 overflow-auto bg-black p-4 border-1">
              <div className="text-center mb-8">
               
                <h1 className={`font-bold mb-4 text-white ${isMobile ? "text-7xl" : "text-9xl"}`}>fiveonefour</h1>
                <AnimatedLineChart isMobile={isMobile} />

              </div>

              <div className={`mb-8 mx-auto ${isMobile ? "max-w-full" : "max-w-2xl"}`}>
                <div className={`flex justify-center ${isMobile ? "grid grid-cols-4 gap-2" : "gap-6"}`}>
                  <button
                    className="text-left cursor-pointer p-2 flex flex-col items-center bg-transparent border-none hover:bg-transparent"
                    onClick={() => {
                      onFocus()
                      window.dispatchEvent(new CustomEvent("openApp", { detail: { type: "moosestack" } }))
                    }}
                  >
                    <img
                      src="/icons/diskettes-icon.png"
                      alt="Moosestack"
                      width={isMobile ? "32" : "48"}
                      height={isMobile ? "32" : "48"}
                      loading="eager"
                      fetchPriority="high"
                      className={`${isMobile ? "w-8 h-8" : "w-12 h-12"} mb-1`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <p className="text-xs text-white">MooseStack</p>
                  </button>
                  <button
                    className="text-left cursor-pointer p-2 flex flex-col items-center bg-transparent border-none hover:bg-transparent"
                    onClick={() => {
                      onFocus()
                      window.dispatchEvent(new CustomEvent("openApp", { detail: { type: "registry" } }))
                    }}
                  >
                    <img
                      src="/icons/cable_2-0.png"
                      alt="Registry"
                      width={isMobile ? "32" : "48"}
                      height={isMobile ? "32" : "48"}
                      loading="eager"
                      fetchPriority="high"
                      className={`${isMobile ? "w-8 h-8" : "w-12 h-12"} mb-1`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <p className="text-xs text-white">Registry</p>
                  </button>
                  <button
                    className="text-left cursor-pointer p-2 flex flex-col items-center bg-transparent border-none hover:bg-transparent"
                    onClick={() => {
                      onFocus()
                      window.dispatchEvent(new CustomEvent("openApp", { detail: { type: "factory" } }))
                    }}
                  >
                    <img
                      src="/icons/factory-icon.png"
                      alt="Factory"
                      width={isMobile ? "32" : "48"}
                      height={isMobile ? "32" : "48"}
                      loading="eager"
                      fetchPriority="high"
                      className={`${isMobile ? "w-8 h-8" : "w-12 h-12"} mb-1`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <p className="text-xs text-white">Factory</p>
                  </button>
                  <button
                    className="text-left cursor-pointer p-2 flex flex-col items-center bg-transparent border-none hover:bg-transparent"
                    onClick={() => {
                      onFocus()
                      window.dispatchEvent(new CustomEvent("openApp", { detail: { type: "hosting-dashboard" } }))
                    }}
                  >
                    <img
                      src="/icons/hosting-icon.png"
                      alt="Hosting"
                      width={isMobile ? "32" : "48"}
                      height={isMobile ? "32" : "48"}
                      loading="eager"
                      fetchPriority="high"
                      className={`${isMobile ? "w-8 h-8" : "w-12 h-12"} mb-1`}
                      style={{ imageRendering: "pixelated" }}
                    />
                    <p className="text-xs text-white">Hosting</p>
                  </button>
                </div>
              </div>

              <div className={`mx-auto text-sm leading-relaxed ${isMobile ? "max-w-full" : "max-w-2xl"}`}>
                <p className="mb-4 text-white">
                  <strong>The fastest way to implement ClickHouse & streaming in your stack</strong>
                </p>

                <p className="mb-4 text-neutral-400">
                  Building analytics on the wrong stack turns every click into a wait. From frustration to flow:
                  Instantly fast AI-native analytics and a modern developer experience.
                </p>

                <p className="mb-6 text-white">
                  <strong>Prototype fast, deploy fast, AI fast.</strong>
                </p>

                <div className="mb-6 space-y-6">
                  <div className="border-l-2 border-white pl-4">
                    <h3 className={`font-bold mb-2 text-white ${isMobile ? "text-base" : "text-lg"}`}>Step 1: Build</h3>
                    <div className="mb-4">
                      
                      
                      <p className="mb-2 text-neutral-400 text-left">
                        Open source toolkit to build analytical backends in TypeScript/Python
                      </p>
                    </div>
                  </div>

                  <div className="border-l-2 border-white pl-4">
                    <h3 className={`font-bold mb-2 text-white ${isMobile ? "text-base" : "text-lg"}`}>
                      Step 2: Deploy
                    </h3>
                    <div className="mb-4">
                      
                      
                      <p className="mb-4 text-neutral-400 text-left">
                        Deployment DX tooling, and managed infrastructure (BYO available)
                      </p>
                    </div>
                  </div>

                  <div className="border-l-2 border-white pl-4">
                    <h3 className={`font-bold mb-2 text-white ${isMobile ? "text-base" : "text-lg"}`}>
                      Step 3: Optimize
                    </h3>
                    <div className="mb-4">
                      
                      
                      <p className="mb-4 text-neutral-400 text-left">AI copilot to build your app with you</p>
                    </div>
                  </div>
                </div>

                <p className="mb-6 text-neutral-400">
                  We're here to help. From collaborating on architecture to answering pricing questions and everything
                  in between, we'd love to chat.
                </p>

                <p className={`italic text-white ${isMobile ? "text-base" : "text-lg"}`}>
                  <strong>Have fun!</strong>
                </p>
              </div>

              <div className={`mx-auto mt-12 mb-8 ${isMobile ? "max-w-full" : "max-w-2xl"}`}>
                <h2 className={`font-bold mb-6 text-white text-center ${isMobile ? "text-xl" : "text-2xl"}`}>
                  Pricing
                </h2>
                <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
                  <div className="border-2 border-white p-4 bg-black">
                    <h3 className="font-bold text-white text-lg mb-2">Free</h3>
                    <p className="text-white text-2xl font-bold mb-4">$0</p>
                    <ul className="text-neutral-400 text-sm space-y-2 mb-4">
                      <li>• Open source toolkit</li>
                      <li>• Community support</li>
                      <li>• Self-hosted</li>
                      <li>• Unlimited projects</li>
                    </ul>
                  </div>
                  <div className="border-2 border-blue-500 p-4 bg-black">
                    <h3 className="font-bold text-white text-lg mb-2">Pro</h3>
                    <p className="text-white text-2xl font-bold mb-4">$99/mo</p>
                    <ul className="text-neutral-400 text-sm space-y-2 mb-4">
                      <li>• Managed infrastructure</li>
                      <li>• Priority support</li>
                      <li>• Advanced analytics</li>
                      <li>• Team collaboration</li>
                    </ul>
                  </div>
                  <div className="border-2 border-white p-4 bg-black">
                    <h3 className="font-bold text-white text-lg mb-2">Enterprise</h3>
                    <p className="text-white text-2xl font-bold mb-4">Custom</p>
                    <ul className="text-neutral-400 text-sm space-y-2 mb-4">
                      <li>• Dedicated support</li>
                      <li>• Custom SLAs</li>
                      <li>• On-premise option</li>
                      <li>• White-label available</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="text-xs text-neutral-500 mb-2">
                  © 1999, 2024 The FiveOneFour Group
                  <br />
                  TM and ® Trademarks of the FiveOneFour Group
                  <br />
                  Page updated December 13, 2024.
                  <br />
                  Site updated December 13, 2024
                </div>
                <div className={`flex items-center ${isMobile ? "flex-col gap-2" : "justify-between"}`}>
                  <a href="#" className={`text-white underline ${isMobile ? "text-sm" : "text-xs"}`}>
                    Go to top
                  </a>
                  <a href="#" className={`text-white underline ${isMobile ? "text-sm" : "text-xs"}`}>
                    This is Home
                  </a>
                </div>
                <div className="mt-4">
                  <a href="https://github.com/514-labs" target="_blank" rel="noopener noreferrer">
                    <img
                      src="/images/cat.gif"
                      alt="GitHub"
                      width="80"
                      height="80"
                      className="inline-block"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </a>
                </div>
              </div>
            </div>
          ) : activeTab === "google" ? (
            <GoogleContent isMobile={isMobile} />
          ) : (
            <MySpaceContent isMobile={isMobile} />
          )}
        </div>
      )}
    </WindowFrame>
  )
}

export default InternetExplorerApp
