import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { clsx } from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary',
    size = 'md', 
    isLoading = false,
    disabled,
    className,
    children,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg disabled:pointer-events-none disabled:opacity-50'
    
    const variants = {
      primary: 'bg-accent-blue hover:bg-blue-600 text-white focus-visible:ring-accent-blue',
      secondary: 'bg-dark-700 hover:bg-dark-600 text-bookmark-text focus-visible:ring-dark-500',
      ghost: 'hover:bg-sidebar-hover text-bookmark-text focus-visible:ring-dark-500',
      icon: 'hover:bg-sidebar-hover text-bookmark-muted hover:text-bookmark-text focus-visible:ring-dark-500',
    }
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-6 text-base',
    }
    
    const iconSizes = {
      sm: 'h-7 w-7',
      md: 'h-8 w-8',
      lg: 'h-9 w-9',
    }
    
    const buttonClasses = clsx(
      baseClasses,
      variants[variant],
      variant === 'icon' ? iconSizes[size] : sizes[size],
      className
    )
    
    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'