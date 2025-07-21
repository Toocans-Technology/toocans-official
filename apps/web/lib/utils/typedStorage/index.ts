'use client'

import { BasicStorage } from './BasicStorage'

export enum StorageKeys {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
  ExpireIn = 'expireIn',
  ClientId = 'clientId',
  i18nextLng = 'i18nextLng',
}

class LocalStorage extends BasicStorage<StorageKeys> {
  // 访问令牌
  get accessToken() {
    return String(this.get(StorageKeys.AccessToken))
  }

  set accessToken(value: string) {
    this.set(StorageKeys.AccessToken, value)
  }

  // 刷新令牌
  get refreshToken() {
    return String(this.get(StorageKeys.RefreshToken))
  }

  set refreshToken(value: string) {
    this.set(StorageKeys.RefreshToken, value)
  }

  // 授权令牌 access_token 的有效期
  get expireIn() {
    return Number(this.get(StorageKeys.ExpireIn))
  }

  set expireIn(value: number) {
    this.set(StorageKeys.ExpireIn, value)
  }

  // 应用 ID
  get clientId() {
    return String(this.get(StorageKeys.ClientId))
  }

  set clientId(value: string) {
    this.set(StorageKeys.ClientId, value)
  }

  // 清除所有存储
  clearToken() {
    this.set(StorageKeys.AccessToken, '')
    this.set(StorageKeys.RefreshToken, '')
    this.set(StorageKeys.ExpireIn, '')
    this.set(StorageKeys.ClientId, '')
  }
}

export const typedStorage = new LocalStorage()

export default typedStorage
