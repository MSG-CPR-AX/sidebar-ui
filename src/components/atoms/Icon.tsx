import { icons, LucideProps } from 'lucide-react'

interface IconProps extends LucideProps {
  name: keyof typeof icons
}

export const Icon = ({ name, className, ...props }: IconProps) => {
  const LucideIcon = icons[name]

  if (!LucideIcon) {
    return null
  }

  return <LucideIcon className={className} {...props} />
}
