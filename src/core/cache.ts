// 合并上报 cache法
const cache: string[] = []

export function getCache() {
  return cache
}

export function addCache(data: string) {
  cache.push(data)
}

export function clearCache() {
  cache.length = 0
}
