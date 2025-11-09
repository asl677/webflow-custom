"use client"

import type React from "react"

import { WindowFrame } from "./window-frame"
import { useState } from "react"

interface DemoRequestFormProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  onMaximize?: () => void
  isActive?: boolean
  size?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
  icon?: string
}

export function DemoRequestForm({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  onMaximize,
  isActive,
  size,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
  icon,
}: DemoRequestFormProps) {
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false
  const defaultSize = isMobile
    ? { width: window.innerWidth - 20, height: window.innerHeight - 60 }
    : { width: 500, height: 360 }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    company: "",
    role: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [selectedOption, setSelectedOption] = useState<"contact" | "book">("contact")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        company: "",
        role: "",
      })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <WindowFrame
      id={id}
      title="Request a Demo"
      icon={icon || "/icons/envelope-closed.png"}
      position={position}
      size={size || defaultSize}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
      isActive={isActive}
    >
      <div className="h-full overflow-auto" style={{ backgroundColor: "#c0c0c0" }}>
        <div className="p-4">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-lg font-bold text-black mb-2">Thank you for your interest!</div>
              <div className="text-sm text-black">We'll be in touch shortly.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="mb-4">
                <label className="block text-sm font-bold text-black mb-1">Contact Method</label>
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value as "contact" | "book")}
                  className="w-full px-2 py-1 text-sm border-2"
                  style={{
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <option value="contact">Let us contact you</option>
                  <option value="book">Book a time directly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-2 py-1 text-sm border-2"
                  style={{
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                    backgroundColor: "#ffffff",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">Work Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-2 py-1 text-sm border-2"
                  style={{
                    borderTopColor: "#808080",
                    borderLeftColor: "#808080",
                    borderRightColor: "#dfdfdf",
                    borderBottomColor: "#dfdfdf",
                    backgroundColor: "#ffffff",
                  }}
                />
              </div>

              {selectedOption === "contact" ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-2 py-1 text-sm border-2"
                      style={{
                        borderTopColor: "#808080",
                        borderLeftColor: "#808080",
                        borderRightColor: "#dfdfdf",
                        borderBottomColor: "#dfdfdf",
                        backgroundColor: "#ffffff",
                      }}
                    />
                    <p className="text-xs text-black mt-1">Enter your preferred number for us to reach you by phone</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Message</label>
                    <input
                      type="text"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what you'd like to discuss..."
                      className="w-full px-2 py-1 text-sm border-2"
                      style={{
                        borderTopColor: "#808080",
                        borderLeftColor: "#808080",
                        borderRightColor: "#dfdfdf",
                        borderBottomColor: "#dfdfdf",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      placeholder="Your company name"
                      className="w-full px-2 py-1 text-sm border-2"
                      style={{
                        borderTopColor: "#808080",
                        borderLeftColor: "#808080",
                        borderRightColor: "#dfdfdf",
                        borderBottomColor: "#dfdfdf",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      placeholder="Your role"
                      className="w-full px-2 py-1 text-sm border-2"
                      style={{
                        borderTopColor: "#808080",
                        borderLeftColor: "#808080",
                        borderRightColor: "#dfdfdf",
                        borderBottomColor: "#dfdfdf",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-bold border-2 text-black"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#dfdfdf",
                    borderLeftColor: "#dfdfdf",
                    borderRightColor: "#808080",
                    borderBottomColor: "#808080",
                  }}
                  onMouseDown={(e) => {
                    const target = e.currentTarget
                    target.style.borderTopColor = "#808080"
                    target.style.borderLeftColor = "#808080"
                    target.style.borderRightColor = "#dfdfdf"
                    target.style.borderBottomColor = "#dfdfdf"
                  }}
                  onMouseUp={(e) => {
                    const target = e.currentTarget
                    target.style.borderTopColor = "#dfdfdf"
                    target.style.borderLeftColor = "#dfdfdf"
                    target.style.borderRightColor = "#808080"
                    target.style.borderBottomColor = "#808080"
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget
                    target.style.borderTopColor = "#dfdfdf"
                    target.style.borderLeftColor = "#dfdfdf"
                    target.style.borderRightColor = "#808080"
                    target.style.borderBottomColor = "#808080"
                  }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </WindowFrame>
  )
}
