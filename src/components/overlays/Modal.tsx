import { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Icon } from '../atoms/Icon'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  if (!isOpen) return null

  return ReactDOM.createPortal(
    // The overlay for closing the modal
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={onClose}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
      role="button"
      tabIndex={0}
      aria-label="Close modal"
    >
      {/* The modal panel itself */}
      <div
        className="w-full max-w-md rounded-lg bg-gray-800 shadow-xl"
        onClick={(e) => e.stopPropagation()} // Stop click from bubbling to the overlay
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}
