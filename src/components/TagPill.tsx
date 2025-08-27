interface TagPillProps {
  tag: string;
  onClick: (tag: string) => void;
  isSelected: boolean;
}

export function TagPill({ tag, onClick, isSelected }: TagPillProps) {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full cursor-pointer";
  const selectedClasses = "bg-blue-500 text-white";
  const unselectedClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <span
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
      onClick={() => onClick(tag)}
    >
      {tag}
    </span>
  );
}
