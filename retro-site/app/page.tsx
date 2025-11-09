"use client"
import { Desktop } from "@/components/desktop"
import { useState, useEffect } from "react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Wait for progress bar to complete, then hide loading
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => clearInterval(progressInterval)
  }, [])

  return (
    <div className="relative min-h-dvh">
      {!isLoading && <Desktop />}

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "rgb(0, 128, 128)" }}>
          <div className="bg-win95-window win95-raised w-80">
            <div className="bg-win95-titlebar text-white px-2 py-1 text-sm mb-1">Loading the 90's...</div>

            <div className="bg-win95-window p-8">
            
              <div className="bg-[#999] win95-inset">
                <div className="h-4 bg-win95-titlebar transition-all duration-100" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
