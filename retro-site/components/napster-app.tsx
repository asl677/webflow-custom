"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { WindowFrame } from "./window-frame"
import { SplashScreen } from "./splash-screen"
import { Win95MenuBar } from "./win95-menubar"

interface NapsterAppProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  isDarkMode?: boolean
  isActive?: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
}

interface Track {
  id: number
  title: string
  artist: string
  album: string
  duration: string
  bitrate: string
  size: string
  type: string
  src: string
}

export function NapsterApp({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  onMaximize,
  size,
  isDarkMode = false,
  isActive,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
}: NapsterAppProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const [activeTab, setActiveTab] = useState<"library" | "search" | "hotlist" | "chat">("library")
  const [artistSearchTerm, setArtistSearchTerm] = useState("")
  const [songTitleSearchTerm, setSongTitleSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Track | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(75)
  const [progress, setProgress] = useState(0)
  const [selectedTracks, setSelectedTracks] = useState<number[]>([])
  const [downloadProgress, setDownloadProgress] = useState<Record<number, number>>({})
  const audioRef = useRef<HTMLAudioElement>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(loadingInterval)
  }, [])

  useEffect(() => {
    const downloadInterval = setInterval(() => {
      setDownloadProgress((prev) => {
        const newProgress = { ...prev }
        tracks.forEach((track) => {
          if (Math.random() < 0.02 && !newProgress[track.id]) {
            newProgress[track.id] = Math.random() * 20
          }
          if (newProgress[track.id] && newProgress[track.id] < 100) {
            newProgress[track.id] = Math.min(100, newProgress[track.id] + Math.random() * 5)
          }
        })
        return newProgress
      })
    }, 1000)

    return () => clearInterval(downloadInterval)
  }, [])

  const tracks: Track[] = [
    {
      id: 1,
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      album: "Nevermind",
      duration: "5:01",
      bitrate: "128k",
      size: "4.6MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 2,
      title: "Enter Sandman",
      artist: "Metallica",
      album: "Metallica",
      duration: "5:31",
      bitrate: "128k",
      size: "5.1MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 3,
      title: "Losing My Religion",
      artist: "R.E.M.",
      album: "Out of Time",
      duration: "4:27",
      bitrate: "128k",
      size: "4.1MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 4,
      title: "Under the Bridge",
      artist: "Red Hot Chili Peppers",
      album: "Blood Sugar Sex Magik",
      duration: "4:24",
      bitrate: "128k",
      size: "4.0MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 5,
      title: "Black",
      artist: "Pearl Jam",
      album: "Ten",
      duration: "5:43",
      bitrate: "128k",
      size: "5.3MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 6,
      title: "Creep",
      artist: "Radiohead",
      album: "Pablo Honey",
      duration: "3:58",
      bitrate: "128k",
      size: "3.7MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 7,
      title: "Man in the Box",
      artist: "Alice in Chains",
      album: "Facelift",
      duration: "4:46",
      bitrate: "128k",
      size: "4.4MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 8,
      title: "Touch Me I'm Sick",
      artist: "Mudhoney",
      album: "Superfuzz Bigmuff",
      duration: "2:33",
      bitrate: "128k",
      size: "2.4MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 9,
      title: "Hunger Strike",
      artist: "Temple of the Dog",
      album: "Temple of the Dog",
      duration: "4:03",
      bitrate: "128k",
      size: "3.8MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 10,
      title: "Would?",
      artist: "Alice in Chains",
      album: "Dirt",
      duration: "3:28",
      bitrate: "128k",
      size: "3.2MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 11,
      title: "Jeremy",
      artist: "Pearl Jam",
      album: "Ten",
      duration: "5:19",
      bitrate: "128k",
      size: "4.9MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 12,
      title: "Plush",
      artist: "Stone Temple Pilots",
      album: "Core",
      duration: "5:13",
      bitrate: "128k",
      size: "4.8MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 13,
      title: "Outshined",
      artist: "Soundgarden",
      album: "Badmotorfinger",
      duration: "5:10",
      bitrate: "128k",
      size: "4.7MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 14,
      title: "Rooster",
      artist: "Alice in Chains",
      album: "Dirt",
      duration: "6:15",
      bitrate: "128k",
      size: "5.8MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 15,
      title: "Alive",
      artist: "Pearl Jam",
      album: "Ten",
      duration: "5:41",
      bitrate: "128k",
      size: "5.2MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 16,
      title: "Come As You Are",
      artist: "Nirvana",
      album: "Nevermind",
      duration: "3:39",
      bitrate: "128k",
      size: "3.4MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 17,
      title: "Interstate Love Song",
      artist: "Stone Temple Pilots",
      album: "Purple",
      duration: "3:15",
      bitrate: "128k",
      size: "3.0MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 18,
      title: "Spoonman",
      artist: "Soundgarden",
      album: "Superunknown",
      duration: "4:07",
      bitrate: "128k",
      size: "3.8MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 19,
      title: "Them Bones",
      artist: "Alice in Chains",
      album: "Dirt",
      duration: "2:30",
      bitrate: "128k",
      size: "2.3MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
    {
      id: 20,
      title: "Even Flow",
      artist: "Pearl Jam",
      album: "Ten",
      duration: "4:53",
      bitrate: "128k",
      size: "4.5MB",
      type: "MP3",
      src: "/demo-audio.mp3",
    },
  ]

  const filteredTracks = tracks.filter(
    (track) =>
      (artistSearchTerm === "" || track.artist.toLowerCase().includes(artistSearchTerm.toLowerCase())) &&
      (songTitleSearchTerm === "" || track.title.toLowerCase().includes(songTitleSearchTerm.toLowerCase())),
  )

  const sortedTracks = [...filteredTracks].sort((a, b) => {
    if (!sortField) return 0

    let aValue = a[sortField]
    let bValue = b[sortField]

    if (sortField === "duration") {
      const parseTime = (time: string) => {
        const [minutes, seconds] = time.split(":").map(Number)
        return minutes * 60 + seconds
      }
      aValue = parseTime(a.duration as string)
      bValue = parseTime(b.duration as string)
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field: keyof Track) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleTrackSelect = (trackId: number, isCtrlClick = false) => {
    if (isCtrlClick) {
      setSelectedTracks((prev) => (prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]))
    } else {
      setSelectedTracks([trackId])
    }
  }

  const handleTrackDoubleClick = (track: Track) => {
    setCurrentTrack(track)
    setProgress(0)
    setCurrentTime(0)

    if (audioRef.current) {
      audioRef.current.src = track.src
      audioRef.current.load()
      setIsPlaying(true)
      audioRef.current.play().catch(() => {
        console.log("[v0] Playing track (visual only):", track.title, "by", track.artist)
      })
    } else {
      setIsPlaying(true)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.pause()
        if (simulationIntervalRef.current) {
          clearInterval(simulationIntervalRef.current)
          simulationIntervalRef.current = null
        }
      } else {
        audioRef.current.play().catch(() => {
          console.log("[v0] Audio playback failed, using visual simulation")
          if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current)
          }

          const trackDuration = 240 // 4 minutes in seconds for demo
          setDuration(trackDuration)

          simulationIntervalRef.current = setInterval(() => {
            setCurrentTime((prev) => {
              const newTime = prev + 0.1
              if (newTime >= trackDuration) {
                setIsPlaying(false)
                setProgress(0)
                setCurrentTime(0)
                if (simulationIntervalRef.current) {
                  clearInterval(simulationIntervalRef.current)
                  simulationIntervalRef.current = null
                }
                return 0
              }
              setProgress((newTime / trackDuration) * 100)
              return newTime
            })
          }, 100)
        })
      }
    }
    setIsPlaying(!isPlaying)
  }

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current)
      simulationIntervalRef.current = null
    }
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseInt(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const renderLoadingScreen = () => (
    <SplashScreen
      title="Napster"
      version="" // removed version text as requested
      image="/images/Napster_splash.png"
      description=""
      copyright="Copyright © 1999-2001 Napster, Inc."
      company="All rights reserved. Napster and the Napster logo are trademarks of Napster, Inc."
      progress={loadingProgress}
      imageStyle={{
        objectFit: "contain",
        maxHeight: "200px",
        backgroundColor: "#ffffff",
        padding: "20px",
      }}
    />
  )

  const renderLibraryTab = () => (
    <div className="flex flex-col h-full">
      <div className="p-2" style={{ backgroundColor: "#c0c0c0" }}>
        <div className="flex gap-2 items-center">
          <label className="text-sm font-bold text-black">Artist:</label>
          <input
            type="text"
            placeholder="Artist name..."
            value={artistSearchTerm}
            onChange={(e) => setArtistSearchTerm(e.target.value)}
            className="flex-1 px-2 py-1 text-sm win95-input border-none border-0 shadow-none"
            style={{
              backgroundColor: "#ffffff !important",
              color: "#000000 !important",
             
              fontFamily: '"W95Font", "MS Sans Serif", "Microsoft Sans Serif", sans-serif !important',
              fontSize: "11px !important",
            }}
          />
          <label className="text-sm font-bold text-black">Song Title:</label>
          <input
            type="text"
            value={songTitleSearchTerm}
            onChange={(e) => setSongTitleSearchTerm(e.target.value)}
            placeholder="Song title..."
            className="flex-1 px-2 py-1 text-sm border win95-input"
            style={{
              backgroundColor: "#ffffff !important",
              color: "#000000 !important",
            
              fontFamily: '"W95Font", "MS Sans Serif", "Microsoft Sans Serif", sans-serif !important',
              fontSize: "11px !important",
            }}
          />
          <button
            className="px-4 py-1 text-sm border text-black hover:bg-neutral-300 win95-button"
            style={{
              backgroundColor: "#c0c0c0 !important",
              borderTopColor: "#dfdfdf !important",
              borderLeftColor: "#dfdfdf !important",
              borderRightColor: "#808080 !important",
              borderBottomColor: "#808080 !important",
              fontFamily: '"W95Font", "MS Sans Serif", "Microsoft Sans Serif", sans-serif !important',
              fontSize: "11px !important",
            }}
          >
            Find It!
          </button>
        </div>
      </div>

      <div
        className="flex-1 m-2 overflow-y-auto"
        style={{
          backgroundColor: "white",
          
        }}
      >
        <div className="text-xs">
          {sortedTracks.map((track, index) => (
            <div
              key={track.id}
              className={`flex items-center px-2 py-1  cursor-pointer border-none ${
                selectedTracks.includes(track.id) ? "bg-neutral-300" : ""
              } ${currentTrack?.id === track.id ? "bg-yellow-100" : ""}`}
              onClick={(e) => handleTrackSelect(track.id, e.ctrlKey)}
              onDoubleClick={() => handleTrackDoubleClick(track)}
            >
              <div
                className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                style={{
                  backgroundColor: ["#ff0000", "#00ff00", "#ff8800"][index % 3],
                }}
              />
              <div className="flex-1 grid grid-cols-7 gap-4 items-center">
                <div className="text-black font-medium truncate">{track.title}</div>
                <div className="text-black truncate">{track.artist}</div>
                <div className="text-black truncate">{track.album}</div>
                <div className="text-black">{track.duration}</div>
                <div className="text-black">{track.bitrate}</div>
                <div className="text-black">{track.size}</div>
                <div className="w-full">
                  {downloadProgress[track.id] ? (
                    <div
                      className="w-full h-3 bg-white border border-neutral-400"
                      style={{
                        borderTopColor: "#808080",
                        borderLeftColor: "#808080",
                        borderRightColor: "#dfdfdf",
                        borderBottomColor: "#808080",
                      }}
                    >
                      <div
                        className="h-full bg-win95-titlebar dark:bg-white transition-all duration-200"
                        style={{ width: `${downloadProgress[track.id]}%` }}
                      />
                    </div>
                  ) : (
                    <div className="h-3"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSearchTab = () => (
    <div className="flex flex-col h-full p-4" style={{ backgroundColor: "#c0c0c0" }}>
      <div className="text-center">
        <h3 className="text-lg font-bold text-black mb-4">Search the Napster Network</h3>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter artist, song, or album name..."
            className="w-full px-3 py-2 text-sm border mb-2 win95-input"
            style={{
              backgroundColor: isDarkMode ? "#000000" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#000000",
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#808080",
              fontFamily: '"W95Font", "MS Sans Serif", "Microsoft Sans Serif", sans-serif !important',
              fontSize: "11px !important",
            }}
          />
          <button
            className="px-4 py-2 text-sm border text-black hover:bg-neutral-300 win95-button"
            style={{
              backgroundColor: "#c0c0c0",
              borderTopColor: "#dfdfdf",
              borderLeftColor: "#dfdfdf",
              borderRightColor: "#808080",
              borderBottomColor: "#808080",
              fontFamily: '"W95Font", "MS Sans Serif", "Microsoft Sans Serif", sans-serif !important',
              fontSize: "11px !important",
            }}
          >
            Search
          </button>
        </div>
        <div className="text-sm text-neutral-600">
          <p>Connected to 1,247,892 users</p>
          <p>Sharing 2,847,293 files</p>
        </div>
      </div>
    </div>
  )

  const renderHotlistTab = () => (
    <div className="flex flex-col h-full p-4" style={{ backgroundColor: "#c0c0c0" }}>
      <h3 className="text-lg font-bold text-black mb-4">Hot Files</h3>
      <div className="space-y-2">
        {tracks.slice(0, 5).map((track, index) => (
          <div key={track.id} className="flex items-center gap-2 p-2 bg-white border border-neutral-400">
            <span className="text-sm font-bold text-red-600">#{index + 1}</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-black">{track.title}</div>
              <div className="text-xs text-neutral-600">
                {track.artist} - {track.album}
              </div>
            </div>
            <div className="text-xs text-neutral-600">{track.bitrate}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderChatTab = () => (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#c0c0c0" }}>
      <div className="p-2 border-b border-neutral-400">
        <h3 className="text-sm font-bold text-black">Chat Rooms</h3>
      </div>
      <div className="flex-1 p-2">
        <div
          className="bg-white border border-neutral-400 h-32 mb-2 p-2 text-xs overflow-auto"
          style={{
            borderTopColor: "#808080",
            borderLeftColor: "#808080",
            borderRightColor: "#dfdfdf",
            borderBottomColor: "#808080",
          }}
        >
          <div className="text-blue-600">&lt;MusicLover99&gt; anyone have the new Radiohead album?</div>
          <div className="text-green-600">&lt;GrungeKid&gt; check out my Pearl Jam collection!</div>
          <div className="text-purple-600">&lt;MetalHead&gt; Metallica rules!</div>
        </div>
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full px-2 py-1 text-xs border win95-input"
          style={{
            backgroundColor: isDarkMode ? "#000000" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
            borderTopColor: "#808080",
            borderLeftColor: "#808080",
            borderRightColor: "#dfdfdf",
            borderBottomColor: "#808080",
            fontFamily: '"W95Font", "MS Sans Serif", "Microsoft Sans Serif", sans-serif !important',
            fontSize: "11px !important",
          }}
        />
      </div>
    </div>
  )

  return (
    <WindowFrame
      id={id}
      title="Napster"
      icon="/icons/napster-icon.png"
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      width={size?.width || 800}
      height={size?.height || 600}
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
    >
      <audio ref={audioRef} preload="none" />

      {isLoading ? (
        renderLoadingScreen()
      ) : (
        <div className="flex flex-col h-full bg-ring" style={{ backgroundColor: "#808080" }}>
          <Win95MenuBar
              items={[
                {
                  label: "File",
                  items: [
                    { label: "New Playlist", onClick: () => {} },
                    { label: "Open File", onClick: () => {}, shortcut: "Ctrl+O" },
                    { type: "separator" },
                    { label: "Exit", onClick: () => {} },
                  ],
                },
                {
                  label: "Edit",
                  items: [
                    { label: "Cut", onClick: () => {} },
                    { label: "Copy", onClick: () => {} },
                    { label: "Paste", onClick: () => {} },
                    { type: "separator" },
                    { label: "Select All", onClick: () => {}, shortcut: "Ctrl+A" },
                  ],
                },
                {
                  label: "View",
                  items: [
                    { label: "Toolbar", onClick: () => {} },
                    { label: "Status Bar", onClick: () => {} },
                    { type: "separator" },
                    { label: "Refresh", onClick: () => {}, shortcut: "F5" },
                  ],
                },
                {
                  label: "Go",
                  items: [
                    { label: "Back", onClick: () => {}, shortcut: "Alt+←" },
                    { label: "Forward", onClick: () => {}, shortcut: "Alt+→" },
                    { type: "separator" },
                    { label: "Home", onClick: () => {} },
                  ],
                },
                {
                  label: "Favorites",
                  items: [
                    { label: "Add to Favorites", onClick: () => {} },
                    { label: "Organize Favorites", onClick: () => {} },
                    { type: "separator" },
                    { label: "My Music", onClick: () => {} },
                    { label: "Recently Played", onClick: () => {} },
                  ],
                },
                {
                  label: "Help",
                  items: [
                    { label: "User Guide", onClick: () => {} },
                    { label: "Keyboard Shortcuts", onClick: () => {} },
                    { type: "separator" },
                    { label: "About Napster", onClick: () => {} },
                  ],
                },
              ]}
            />

          <div className="flex-1 overflow-hidden">
            {activeTab === "library" && renderLibraryTab()}
            {activeTab === "search" && renderSearchTab()}
            {activeTab === "hotlist" && renderHotlistTab()}
            {activeTab === "chat" && renderChatTab()}
          </div>
        </div>
      )}
    </WindowFrame>
  )
}
