"use client"

import { useState, useRef, useEffect } from "react"

interface MenuItem {
  label: string
  onClick?: () => void
  type?: "separator"
  disabled?: boolean
  shortcut?: string
}

interface MenuBarItem {
  label: string
  items?: MenuItem[]
  onClick?: () => void
}

interface Win95MenuBarProps {
  items: MenuBarItem[]
  className?: string
}

export function Win95MenuBar({ items, className = "" }: Win95MenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 })
  const menuBarRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuBarRef.current &&
        !menuBarRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveMenu(null)
        setHoveredMenu(null)
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (
        menuBarRef.current &&
        !menuBarRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveMenu(null)
        setHoveredMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleMenuClick = (label: string, item: MenuBarItem, event: React.MouseEvent) => {
    if (item.onClick) {
      item.onClick()
      setActiveMenu(null)
      setHoveredMenu(null)
    } else if (item.items) {
      const rect = event.currentTarget.getBoundingClientRect()
      const menuBarRect = menuBarRef.current?.getBoundingClientRect()
      if (menuBarRect) {
        setMenuPosition({
          left: rect.left - menuBarRect.left,
          top: rect.height
        })
      }
      setActiveMenu(activeMenu === label ? null : label)
      setHoveredMenu(null)
    }
  }

  const handleMenuHover = (label: string, event: React.MouseEvent) => {
    if (activeMenu) {
      const rect = event.currentTarget.getBoundingClientRect()
      const menuBarRect = menuBarRef.current?.getBoundingClientRect()
      if (menuBarRect) {
        setMenuPosition({
          left: rect.left - menuBarRect.left,
          top: rect.height
        })
      }
      setActiveMenu(label)
    }
    setHoveredMenu(label)
  }

  const handleMenuItemClick = (menuItem: MenuItem) => {
    if (menuItem.onClick && !menuItem.disabled) {
      menuItem.onClick()
    }
    setActiveMenu(null)
    setHoveredMenu(null)
  }

  const getMenuButtonStyle = (label: string, isActive: boolean, isHovered: boolean) => {
    if (isActive) {
      return {
        backgroundColor: "#a0a0a0",
      }
    } else if (isHovered) {
      return {
        backgroundColor: "#a8a8a8",
      }
    } else {
      return {
        backgroundColor: "#c0c0c0",
      }
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={menuBarRef}
        className="flex items-center py-0 px-0"
        style={{ backgroundColor: "#c0c0c0" }}
      >
        {items.map((item, index) => {
          const isActive = activeMenu === item.label
          const isHovered = hoveredMenu === item.label && !isActive
          const buttonStyle = getMenuButtonStyle(item.label, isActive, isHovered)

          return (
            <button
              key={index}
              className="px-2 py-1 text-black text-sm font-normal"
              style={{
                ...buttonStyle,
                fontFamily: "W95Font, 'MS Sans Serif', 'Microsoft Sans Serif', sans-serif",
              }}
              onClick={(e) => handleMenuClick(item.label, item, e)}
              onMouseEnter={(e) => handleMenuHover(item.label, e)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Dropdown menu */}
      {activeMenu && (
        <div 
          className="absolute z-50"
          style={{
            left: `${menuPosition.left}px`,
            top: `${menuPosition.top - 2}px`
          }}
        >
          {items
            .filter((item) => item.label === activeMenu && item.items)
            .map((item, index) => (
              <div
                key={index}
                ref={dropdownRef}
                className="bg-win95-window win95-raised min-w-48"
              >
                {item.items?.map((menuItem, itemIndex) => {
                  if (menuItem.type === "separator") {
                    return null // Remove separators completely
                  }

                  return (
                    <div
                      key={itemIndex}
                      className={`relative flex items-center gap-2 px-2 py-1 hover:bg-win95-highlight cursor-pointer ${
                        menuItem.disabled ? "text-gray-400 cursor-not-allowed" : "text-black"
                      }`}
                      style={{
                        color: "black",
                        backgroundColor: "transparent",
                        fontFamily: "W95Font, 'MS Sans Serif', 'Microsoft Sans Serif', sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        if (!menuItem.disabled) {
                          e.currentTarget.style.backgroundColor = "#000080"
                          e.currentTarget.style.color = "white"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!menuItem.disabled) {
                          e.currentTarget.style.backgroundColor = "transparent"
                          e.currentTarget.style.color = "black"
                        }
                      }}
                      onClick={() => handleMenuItemClick(menuItem)}
                    >
                      <span>{menuItem.label}</span>
                    </div>
                  )
                })}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
