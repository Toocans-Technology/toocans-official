import { JsonWithUndefined } from '@/types/json'

// URL 查询参数类型
export type UrlQueryObject = Record<string, string | number | string[] | number[] | undefined | null>

// HTTP 请求配置
export type FetcherConfig = {
  /** 用来注入 header */
  injectHeader: (options: CommonOptions) => Promise<Record<string, string>>
  /** 处理 search params */
  searchStringGenerator: (options: CommonOptions) => string
}

// HTTP 方法类型 GET/POST/PUT/DELETE
export type MethodOptions =
  | {
      method: 'GET'
    }
  | {
      method: 'POST' | 'PUT' | 'DELETE'
      body: JsonWithUndefined | FormData
    }

// HTTP 请求选项
export type CommonOptions = {
  url: string
  query?: UrlQueryObject
  headers?: Record<string, string>
  signal?: RequestInit['signal']
}
