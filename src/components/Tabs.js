// components/Tabs.js
// Renders a collection of selectable category pills.  If no categories
// are selected the consumer can interpret this as selecting all.  Each
// pill toggles its selection state when clicked.  The list is kept
// compact by hiding the toggle on small screens.

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Tabs({ tabs, selected, toggle }) {
  const [expanded, setExpanded] = useState(false);
  // The pill representing each selected category.  When clicked
  // directly, deselects the category.
  const SelectedPills = () => (
    <div className="flex flex-wrap gap-1 mb-1">
      {selected.map((tab) => (
        <button
          key={tab}
          onClick={() => toggle(tab)}
          className="bg-blue-600 text-white px-2 py-0.5 rounded"
          title="클릭하면 선택이 해제됩니다"
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mb-2">
      {/* Selected pills */}
      {selected.length > 0 && <SelectedPills />}
      {/* Expand/collapse button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-sm text-blue-600 hover:underline focus:outline-none"
      >
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        <span>{expanded ? '태그 숨기기' : '태그 더보기'}</span>
      </button>
      {/* All category pills, shown when expanded */}
      {expanded && (
        <div className="mt-1 flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => toggle(tab)}
              className={`text-sm px-2 py-0.5 rounded border ${
                selected.includes(tab)
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}