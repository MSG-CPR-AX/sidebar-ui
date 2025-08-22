import type { LucideProps, LucideIcon } from 'lucide-react'
import { clsx } from 'clsx'

export interface IconProps extends Omit<LucideProps, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'muted' | 'accent'
}

const sizeValues = {
  xs: 12,
  sm: 16, 
  md: 20,
  lg: 24,
  xl: 32,
}

const variantClasses = {
  default: 'text-bookmark-text',
  muted: 'text-bookmark-muted',
  accent: 'text-accent-blue',
}

export function createIcon(IconComponent: LucideIcon) {
  return function Icon({ 
    size = 'md', 
    variant = 'default',
    className,
    ...props 
  }: IconProps) {
    return (
      <IconComponent
        size={sizeValues[size]}
        className={clsx(
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
}

// Re-export commonly used icons for convenience
export {
  Search,
  Plus,
  MoreVertical,
  Star,
  BookOpen,
  Folder,
  Tag,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  Pin,
  Filter,
  Settings,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  Home,
  Globe,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
  Menu,
  ArrowUpDown,
  GripVertical,
} from 'lucide-react'