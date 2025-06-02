import { LRUCache } from 'lru-cache'

const cache = new LRUCache({
  max: 500, // Maximum number of items to store
  ttl: 1000 * 60 * 60, // 1 hour TTL
})

export default cache
