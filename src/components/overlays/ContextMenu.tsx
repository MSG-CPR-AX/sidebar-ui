import React, { useState, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'

interface MenuPosition {
  x: number
  y: number
}

interface ContextMenuProps {
  children: React.ReactNode
  menuItems: React.ReactNode
}

export const useContextMenu = () => {
  const [position, setPosition] = useState<MenuPosition | null>(null)

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setPosition({ x: event.clientX, y: event.clientY })
  }, [])

  const closeMenu = useCallback(() => {
    setPosition(null)
  }, [])

  useEffect(() => {
    if (position) {
      window.addEventListener('click', closeMenu)
      window.addEventListener('scroll', closeMenu)
    }
    return () => {
      window.removeEventListener('click', closeMenu)
      window.removeEventListener('scroll', closeMenu)
    }
  }, [position, closeMenu])

  return { position, handleContextMenu, closeMenu }
}

export const ContextMenuWrapper = ({
  children,
  menuItems,
  position,
}: ContextMenuProps & { position: MenuPosition | null }) => {
  if (!position) return <>{children}</>

  return (
    <>
      {children}
      {ReactDOM.createPortal(
        <div
          className="fixed z-50 rounded-lg border border-gray-600 bg-gray-700 py-1 shadow-lg"
          style={{ top: position.y, left: position.x }}
        >
          {menuItems}
        </div>,
        document.body
      )}
    </>
  )
}

export const ContextMenuItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="flex w-full items-center px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-blue-600 hover:text-white"
  >
    {children}
  </button>
)
