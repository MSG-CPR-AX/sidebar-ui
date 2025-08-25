import { useQuery } from '@tanstack/react-query'
import { getBookmarkData } from '../api/client'

export const useBookmarkData = () => {
  return useQuery({
    queryKey: ['bookmarkData'], // A unique key for this query
    queryFn: getBookmarkData, // The function that will be called to fetch the data
  })
}
