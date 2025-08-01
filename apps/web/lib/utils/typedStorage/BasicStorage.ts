import type { JSONValue } from '@/types/json'

export class BasicStorage<TKey extends string> {
  get(key: TKey): JSONValue {
    if (typeof window === 'undefined') return ''

    const value = localStorage.getItem(key) || JSON.stringify('')

    try {
      return JSON.parse(value)
    } catch (error) {
      console.log(error)
      return value
    }
  }

  set(key: TKey, value: JSONValue) {
    if (typeof window === 'undefined') return

    localStorage.setItem(key, JSON.stringify(value))
  }

  remove(key: TKey) {
    if (typeof window === 'undefined') return

    localStorage.removeItem(key)
  }

  clear() {
    if (typeof window === 'undefined') return

    localStorage.clear()
  }
}
