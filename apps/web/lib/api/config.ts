import { fetcherConfig } from './fetcher'
import type { FetcherConfig } from './types'

// csc-fetcher config type
export type CscFetcherConfig = {
  getRefreshTokenUrl?: () => string
  handleUnauthorized?: () => void
  exposeError?: boolean
}

// csc-fetcher config instance
export const cscFetcherConfig: CscFetcherConfig = {
  exposeError: false,
}

// init csc-fetcher config
export const initCscFetcher = (config: { base: FetcherConfig; csc: CscFetcherConfig }) => {
  Object.assign(fetcherConfig, config.base)
  Object.assign(cscFetcherConfig, config.csc)
}
