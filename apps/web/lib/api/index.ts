/* eslint-disable @typescript-eslint/no-explicit-any */
// 此 csc-fetcher 仅适用于 http status code 200 的 pattern
import { cscFetcherConfig } from './config'
import { handleData, CscFetcherOptions } from './helpers'

export const getQuery = <T>(args: CscFetcherOptions<T>) => {
  // function 不能通过 props 从 server component 传到 client component
  // getUrl 获取的 url 服务器端和客户端不一致 会导致服务器端和客户端的 hydration 不一致 导致水合错误
  const { transfer: _, ...rest } = args
  return { queryFn: async () => await handleData(args, false), queryKey: [rest] }
}

export type GetQuery<T> = typeof getQuery<T>

export const createTransferOption = <T>(transfer: (data: any) => T) => ({ transfer })

/**
 * 推断 `T` 的 `transfer` 方法的返回值类型 `U`。
 */
export type TypeOfTransferOption<T> = T extends { transfer: (data: any) => infer U } ? U : never

export const getMutation = <TRequest, TOutput>(args: (req: TRequest) => CscFetcherOptions<TOutput>) => {
  return {
    mutationFn: async (req: TRequest) => {
      try {
        const options = args(req)
        return await handleData(options, false)
      } catch (e) {
        console.log(e)
        if (cscFetcherConfig.exposeError) console.error('mutation error with', req)
        throw e
      }
    },
  }
}

export * from './config'
export * from './errors'
