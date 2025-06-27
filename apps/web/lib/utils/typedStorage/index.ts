'use client'

import { BasicStorage } from './BasicStorage'

export enum StorageKeys {
  AccessToken = 'token',
  RefreshToken = 'refreshToken',
}

class LocalStorage extends BasicStorage<StorageKeys> {
  get accessToken() {
    return String(this.get(StorageKeys.AccessToken))
  }

  set accessToken(value: string) {
    this.set(StorageKeys.AccessToken, value)
  }

  get refreshToken() {
    return String(this.get(StorageKeys.RefreshToken))
  }

  set refreshToken(value: string) {
    this.set(StorageKeys.RefreshToken, value)
  }

  logout() {
    this.set(StorageKeys.AccessToken, '')
    this.set(StorageKeys.RefreshToken, '')
  }
}

export const typedStorage = new LocalStorage()

export default typedStorage
