import { useState, useEffect, useCallback, ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface MenuPosition {
  x: number
  y: number
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
}: {
  children: ReactNode
  menuItems: ReactNode
  position: MenuPosition | null
}) => {
  if (!position) return <>{children}</>

  return (
    <>
      {children}
      {ReactDOM.createPortal(
        <div
          className="border-divider bg-surface fixed z-50 rounded-lg border py-1 shadow-lg"
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
  children: ReactNode
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="text-primary hover:bg-accent-blue flex w-full items-center px-3 py-1.5 text-left text-sm hover:text-white"
  >
    {children}
  </button>
)
