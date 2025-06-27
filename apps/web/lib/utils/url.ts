// Check if a URL is absolute
export const isAbsoluteUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
