"use client"

import type React from "react"

import { useState } from "react"
import { WindowFrame } from "./window-frame"

interface SignupFormProps {
  id: string
  isAnimating?: boolean
  isMinimized?: boolean
  size?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  position: { x: number; y: number }
  onMove: (position: { x: number; y: number }) => void
  onMinimize?: () => void
  onResize?: (size: { width: number; height: number }) => void
  zIndex: number
}

export function SignupForm({
  id,
  isAnimating,
  isMinimized,
  size,
  onClose,
  onFocus,
  position,
  onMove,
  onMinimize,
  onResize,
  zIndex,
}: SignupFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleGitHubLogin = () => {
    // Simulate GitHub login
    alert("GitHub login would redirect to GitHub OAuth in a real application")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Sign up attempted with email: ${email}`)
  }

  return (
    <WindowFrame
      id={id}
      title="Sign Up"
      icon="/icons/signup-icon.png"
      onClose={onClose}
      onFocus={onFocus}
      position={position}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
      zIndex={zIndex}
      // width={size?.width || 400}
      width={300}
      height={400} // Actually fix height to 380px (was showing 320px in debug logs)
      isAnimating={isAnimating}
      isMinimized={isMinimized}
    >
      <div
        style={{
          padding: "16px",
          backgroundColor: "#c0c0c0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "16px", textAlign: "center" }}>
          <img
            src="/icons/signup-icon.png"
            alt="Sign Up"
            width="48"
            height="48"
            loading="eager"
            fetchPriority="high"
            style={{
              width: "48px",
              height: "48px",
              margin: "0 auto 12px auto",
              imageRendering: "pixelated",
              display: "block",
            }}
          />
          <h2
            style={{
              fontSize: "14px",
              fontFamily: "MS Sans Serif, sans-serif",
              fontWeight: "bold",
              color: "#000000",
              marginBottom: "8px",
            }}
          >
            Create Your Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "11px",
                fontFamily: "MS Sans Serif, sans-serif",
                color: "#000000",
              }}
            >
              Email Address:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "4px",
                border: "2px inset #c0c0c0",
                fontSize: "11px",
                fontFamily: "MS Sans Serif, sans-serif",
                backgroundColor: "#ffffff",
                color: "#000000",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "11px",
                fontFamily: "MS Sans Serif, sans-serif",
                color: "#000000",
              }}
            >
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "4px",
                border: "2px inset #c0c0c0",
                fontSize: "11px",
                fontFamily: "MS Sans Serif, sans-serif",
                backgroundColor: "#ffffff",
                color: "#000000",
              }}
              required
            />
          </div>

          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                type="submit"
                style={{
                  padding: "4px 16px",
                  border: "2px outset #c0c0c0",
                  backgroundColor: "#c0c0c0",
                  fontSize: "11px",
                  fontFamily: "MS Sans Serif, sans-serif",
                  cursor: "pointer",
                  color: "#000000",
                  width: "100%",
                }}
              >
                Sign Up
              </button>

              <div
                style={{
                  textAlign: "center",
                  fontSize: "11px",
                  fontFamily: "MS Sans Serif, sans-serif",
                  color: "#000000",
                  margin: "4px 0",
                }}
              >
                or
              </div>

              <button
                type="button"
                onClick={handleGitHubLogin}
                style={{
                  padding: "4px 16px",
                  border: "2px outset #c0c0c0",
                  backgroundColor: "#c0c0c0",
                  fontSize: "11px",
                  fontFamily: "MS Sans Serif, sans-serif",
                  cursor: "pointer",
                  color: "#000000",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>
          </div>
        </form>
      </div>
    </WindowFrame>
  )
}

export default SignupForm
