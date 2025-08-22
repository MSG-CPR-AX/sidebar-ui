import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <Loader2
      className={clsx(
        'animate-spin text-bookmark-muted',
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    />
  )
}

export interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md',
  className 
}: LoadingStateProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3 py-8', className)}>
      <LoadingSpinner size={size} />
      <p className="text-sm text-bookmark-muted">{message}</p>
    </div>
  )
}

export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-dark-700'
  
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={clsx(baseClasses, variants[variant], className)}
      style={style}
      aria-hidden="true"
    />
  )
}

// Preset skeleton components for common use cases
export function BookmarkSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton variant="circular" width={20} height={20} />
      <div className="flex-1 space-y-2">
        <Skeleton height={16} width="60%" />
        <Skeleton height={12} width="40%" />
      </div>
      <Skeleton variant="circular" width={16} height={16} />
    </div>
  )
}

export function BookmarkListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }, (_, i) => (
        <BookmarkSkeleton key={i} />
      ))}
    </div>
  )
}

export function CategorySkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={16} height={16} />
        <Skeleton height={16} width="30%" />
      </div>
      <div className="ml-6 space-y-1">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} height={14} width="25%" />
        ))}
      </div>
    </div>
  )
}

export function SearchSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton height={36} className="w-full" />
      <div className="space-y-1">
        {Array.from({ length: 8 }, (_, i) => (
          <BookmarkSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}