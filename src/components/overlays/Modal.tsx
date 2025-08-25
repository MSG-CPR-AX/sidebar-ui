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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
      role="button"
      tabIndex={0}
      aria-label="Close modal"
    >
      <div
        className="bg-surface w-full max-w-md rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="border-divider flex items-center justify-between border-b p-4">
          <h2 id="modal-title" className="text-primary text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary"
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
