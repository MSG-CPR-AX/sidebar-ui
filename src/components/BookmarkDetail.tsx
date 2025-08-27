import type { Bookmark } from '../services/api';
import { flattenTags } from '../utils/bookmarkUtils';

interface BookmarkDetailProps {
  bookmark: Bookmark;
}

export function BookmarkDetail({ bookmark }: BookmarkDetailProps) {
  const tags = flattenTags(bookmark.packages);

  // This is a placeholder. The actual URL to GitLab would need a proper base URL
  // and logic to find the file, which is beyond the scope of the UI.
  const gitlabEditUrl = `https://gitlab.example.com/some/path/to/${bookmark.name}.yaml`;

  return (
    <div>
      <p><strong className="font-medium">URL:</strong> <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{bookmark.url}</a></p>
      <p><strong className="font-medium">Domain:</strong> {bookmark.domain}</p>
      <p><strong className="font-medium">Category:</strong> {bookmark.category}</p>
      <p><strong className="font-medium">Owner:</strong> {bookmark.meta.owner}</p>

      {tags.length > 0 && (
        <div className="mt-4">
          <strong className="font-medium">Tags:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map(tag => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <a href={gitlabEditUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Edit in GitLab
        </a>
      </div>
    </div>
  );
}
