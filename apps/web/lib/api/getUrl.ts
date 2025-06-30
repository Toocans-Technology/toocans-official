// Get api url
export function getUrl(apiUrl: string) {
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

  return `${endpoint}${apiUrl}`
}
