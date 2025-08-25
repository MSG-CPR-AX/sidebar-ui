import { http, HttpResponse } from 'msw'
import { mockData } from './data'

export const handlers = [
  // This handler will intercept GET requests to "/api/bookmarks"
  http.get('/api/bookmarks', () => {
    // And respond with the mock data, simulating a successful API call.
    return HttpResponse.json(mockData)
  }),
]
