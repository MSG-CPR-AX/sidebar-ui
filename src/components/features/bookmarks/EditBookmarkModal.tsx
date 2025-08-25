import { Modal } from '../../overlays/Modal'
import { Bookmark } from '../../../lib/types'
import { Button } from '../../atoms/Button'

interface EditBookmarkModalProps {
  isOpen: boolean
  onClose: () => void
  bookmark: Bookmark | null
}

const InputField = ({
  label,
  id,
  defaultValue,
}: {
  label: string
  id: string
  defaultValue?: string
}) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1 block text-sm font-medium text-gray-300"
    >
      {label}
    </label>
    <input
      type="text"
      id={id}
      defaultValue={defaultValue}
      className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
)

export const EditBookmarkModal = ({
  isOpen,
  onClose,
  bookmark,
}: EditBookmarkModalProps) => {
  if (!bookmark) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Bookmark">
      <form className="space-y-4">
        <InputField label="Title" id="title" defaultValue={bookmark.title} />
        <InputField label="URL" id="url" defaultValue={bookmark.url} />
        <InputField
          label="Description"
          id="description"
          defaultValue={bookmark.description ?? ''}
        />

        <div>
          <div className="mb-1 block text-sm font-medium text-gray-300">
            Tags
          </div>
          <div className="rounded bg-gray-700 p-2 text-sm text-gray-400">
            Tag selection UI here
          </div>
        </div>
        <div>
          <div className="mb-1 block text-sm font-medium text-gray-300">
            Folder
          </div>
          <div className="rounded bg-gray-700 p-2 text-sm text-gray-400">
            Folder selection UI here
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  )
}
