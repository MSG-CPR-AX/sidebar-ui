import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { clsx } from 'clsx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  variant?: 'default' | 'search'
  isLoading?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    isLoading = false,
    disabled,
    className,
    id,
    'aria-describedby': ariaDescribedBy,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined
    const helperTextId = helperText ? `${inputId}-helper` : undefined
    
    const describedBy = [
      ariaDescribedBy,
      errorId,
      helperTextId,
    ].filter(Boolean).join(' ')

    const baseInputClasses = 'w-full rounded-lg border px-3 py-2 text-sm placeholder:text-bookmark-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sidebar-bg disabled:cursor-not-allowed disabled:opacity-50 transition-colors'
    
    const variants = {
      default: clsx(
        'bg-dark-700 border-dark-600 text-bookmark-text',
        error 
          ? 'border-accent-red focus:border-accent-red focus:ring-accent-red' 
          : 'focus:border-accent-blue focus:ring-accent-blue'
      ),
      search: clsx(
        'bg-dark-800 border-dark-600 text-bookmark-text',
        'focus:border-accent-blue focus:ring-accent-blue'
      ),
    }

    const inputClasses = clsx(
      baseInputClasses,
      variants[variant],
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className
    )

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-bookmark-text"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-bookmark-muted">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled || isLoading}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          />
          
          {rightIcon && !isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-bookmark-muted">
              {rightIcon}
            </div>
          )}
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="h-4 w-4 animate-spin text-bookmark-muted"
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
            </div>
          )}
        </div>
        
        {error && (
          <p 
            id={errorId}
            className="mt-1.5 text-sm text-accent-red"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={helperTextId}
            className="mt-1.5 text-sm text-bookmark-muted"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'