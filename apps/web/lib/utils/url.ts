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
  newWindow && (newWindow.opener = null)
}
