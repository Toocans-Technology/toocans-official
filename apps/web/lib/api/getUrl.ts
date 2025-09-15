const API_DOMAIN = 't-api'
const API_SERVICE_NAME = 'toocans-wallet-api'
const API_VERSION = 'v1'
const API_VERSION2 = 'v2'
const API_MARKET_DOMAIN = 't-quotation'
const API_MARKET_SERVICE_NAME = 'toocans-market-quotation'
// Get api url
export function getUrl(apiUrl: string) {
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

  return `${endpoint}/${API_DOMAIN}/${API_SERVICE_NAME}/${API_VERSION}${apiUrl}`
}

export function getUrlByV2(apiUrl: string) {
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT
  return `${endpoint}/${API_DOMAIN}/${API_SERVICE_NAME}/${API_VERSION2}${apiUrl}`
}

export function getUrlByMarket(apiUrl: string) {
  const endpoint = process.env.NEXT_PUBLIC_MARKET_API_ENDPOINT
  return `${endpoint}/${API_MARKET_DOMAIN}/${API_MARKET_SERVICE_NAME}/${API_VERSION}${apiUrl}`
}
