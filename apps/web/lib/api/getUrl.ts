const API_DOMAIN = 't-api'
const API_SERVICE_NAME = 'toocans-broke-api'
const API_VERSION = 'v1'

// Get api url
export function getUrl(apiUrl: string) {
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

  return `${endpoint}/${API_DOMAIN}/${API_SERVICE_NAME}/${API_VERSION}${apiUrl}`
}
