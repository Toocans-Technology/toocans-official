import { getCleanObject } from '../utils'
import { FetcherConfig, MethodOptions, CommonOptions } from './types'

export const fetcherConfig: FetcherConfig = {
  injectHeader: async () => ({}),
  searchStringGenerator: () => '',
}

export type FetchDataOptions = MethodOptions & CommonOptions

export async function fetchData(options: FetchDataOptions) {
  const rawHeaders = (await fetcherConfig.injectHeader(options)) ?? {}
  const headers = getCleanObject({ ...rawHeaders, ...options.headers })
  const urlObj = new URL(options.url)
  urlObj.search = fetcherConfig.searchStringGenerator(options) ?? ''
  const finalUrl = urlObj.toString()

  switch (options.method) {
    case 'GET':
      return fetch(finalUrl, {
        headers,
        signal: options.signal,
      })
    case 'POST':
    case 'PUT':
    case 'DELETE': {
      let body: string | FormData = ''

      if (options.body instanceof FormData) {
        // formData 需刪掉 Content-Type, 參考:
        // https://muffinman.io/blog/uploading-files-using-fetch-multipart-form-data/
        delete headers['Content-Type']
        body = options.body
      } else if (!headers['Content-Type']) {
        // 不是 FormData 也未指定 Content-Type, 則預設為 json
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(options.body)
      }

      return fetch(finalUrl, {
        method: options.method,
        headers,
        body,
        signal: options.signal,
      })
    }
    default: {
      const n: never = options
      return n
    }
  }
}
export const getQueryKeys = (...args: unknown[]) => {
  return [...args]
}
