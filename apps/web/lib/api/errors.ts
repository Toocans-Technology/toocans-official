import type { ResponseStatus } from './schemas'

// HTTP级别的报错
export class HttpLevelError extends Error {
  public code: number
  constructor(code: number) {
    super(code.toString())
    this.name = 'HttpLevelError'
    this.code = code
    Object.setPrototypeOf(this, HttpLevelError.prototype)
  }
}

export const isHttpLevelError = (error: unknown): error is HttpLevelError =>
  error instanceof HttpLevelError && error.name === 'HttpLevelError'

// 错误的响应返回结果
export class WrongResponseStructError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WrongResponseStructError'
    Object.setPrototypeOf(this, WrongResponseStructError.prototype)
  }
}

export const isWrongResponseStructError = (error: unknown): error is WrongResponseStructError =>
  error instanceof WrongResponseStructError && error.name === 'WrongResponseStructError'

// csc 系列错误基础
export class BaseError extends Error {
  public code: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public data: any

  constructor(args: ResponseStatus) {
    const { code, msg, data } = args
    super(msg)
    this.name = 'BaseError'
    this.code = String(code)
    this.data = data ?? msg
    Object.setPrototypeOf(this, BaseError.prototype)
  }
}

export const isBaseError = (error: unknown): error is BaseError =>
  error instanceof BaseError && error.name === 'BaseError'

// 未授权错误
export class UnauthorizedError extends Error {
  constructor() {
    super('UnauthorizedError')
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export const isUnauthorizedError = (error: unknown): error is UnauthorizedError =>
  error instanceof UnauthorizedError && error.name === 'UnauthorizedError'
