/* eslint-disable @typescript-eslint/no-explicit-any */
// 此 csc-fetcher 仅适用于 http status code 200 + response status code 102000 的 pattern
import { cscFetcherConfig } from './config'
import { BaseError, UnauthorizedError, HttpLevelError, WrongResponseStructError } from './errors'
import type { FetchDataOptions } from './fetcher'
import { fetchData } from './fetcher'
import { refreshToken } from './refreshToken'
import { responseSchema } from './schemas'

export const successCode = '200'
export const authErrorCodes = ['401100000'] // TODO: 定义认证错误码

const isJsonContentType = (res: Response) => {
  const contentType = res.headers.get('content-type')
  return contentType && contentType.includes('application/json')
}

export async function extractWrapData<T>(res: Response, args: CscFetcherOptions<T>) {
  // http level error
  if (!res.ok) {
    console.error(`[http level error]`, res)
    throw new HttpLevelError(res.status)
  }

  // check response data is JSON
  if (!isJsonContentType(res)) {
    if (res.status === 204) return undefined

    throw new WrongResponseStructError(`[${args.url}] response data is not JSON`)
  }

  const jsonData = await res.json()
  const parseResult = responseSchema.safeParse(jsonData)

  if (!parseResult) throw new WrongResponseStructError(`[${args.url}] empty response data`)

  if (!parseResult.success) {
    throw new WrongResponseStructError(
      `[${args.url}] wrong response struct:\n ${JSON.stringify(parseResult.error.errors, null, 2)}`
    )
  }

  return parseResult.data
}

export type CscFetcherOptions<T> = FetchDataOptions & {
  transfer: (data: any) => T
  body?: Record<string, unknown> | FormData
}

export async function handleData<T>(args: CscFetcherOptions<T>, skipTokenError: boolean): Promise<T | undefined> {
  const res = await fetchData(args)
  const parsedRawData = await extractWrapData(res, args)

  // 如果空数据直接返回 undefined
  if (!parsedRawData) {
    return undefined
  }

  const code = String(parsedRawData.code)

  // 检查响应数据是否成功
  if (code !== successCode) {
    // 检查响应数据是否为认证错误
    if (!skipTokenError && authErrorCodes.includes(code)) {
      // 检查是否设置了刷新 token url
      if (cscFetcherConfig?.getRefreshTokenUrl?.()) {
        const refreshResult = await refreshToken()

        if (refreshResult) return await handleData(args, true)
      } else if (cscFetcherConfig?.handleUnauthorized) {
        cscFetcherConfig.handleUnauthorized()
        return
      }

      throw new UnauthorizedError()
    }

    throw new BaseError(parsedRawData)
  }

  try {
    return args.transfer(parsedRawData.data)
  } catch (e) {
    if (cscFetcherConfig.exposeError) console.error(e, 'transfer error with', args.method, args.url)
    throw e
  }
}
