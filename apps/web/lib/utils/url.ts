import { UrlQueryObject } from '../api/types'

const isEmptyValue = (value: string | number | undefined | null) => value === undefined || value === ''

// Check if a URL is absolute
export const isAbsoluteUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

export const openNewWindow = (url: string) => {
  const newWindow = window.open(url, '', 'noopener,noreferrer')
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  newWindow && (newWindow.opener = null)
}

export function trimmedSearchParams(obj: UrlQueryObject) {
  const sp = new URLSearchParams()

  for (const key in obj) {
    const value = obj[key]

    if (Array.isArray(value)) {
      for (const item of value) {
        if (!isEmptyValue(item)) sp.append(key, String(item))
      }
    } else {
      if (!isEmptyValue(value)) sp.append(key, String(value))
    }
  }

  return sp
}
