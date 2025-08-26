import { customIcons } from '../../assets/icons';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon = ({ name, className, size = 24 }: IconProps) => {
  const svgString = customIcons[name];

  if (!svgString) {
    return null; // Don't render anything if icon not found
  }

  return (
    <div
      className={className}
      style={{ width: size, height: size, display: 'inline-block' }}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};
