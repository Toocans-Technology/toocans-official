import { z } from 'zod'
import { cscFetcherConfig } from '.'
import { typedStorage } from '../utils'
import { successCode } from './helpers'

const refreshDataSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
  expire_in: z.number(),
})

let refreshTokenPromise: Promise<boolean> | null = null

export async function refreshToken(): Promise<boolean> {
  // if there is a refresh promise, return it
  if (refreshTokenPromise) {
    return refreshTokenPromise
  }

  // else, create a new refresh promise
  refreshTokenPromise = refresh().then((r) => {
    refreshTokenPromise = null
    return r
  })

  return refreshTokenPromise
}

/** refresh token */
async function refresh(): Promise<boolean> {
  const refreshToken = typedStorage.refreshToken

  if (!refreshToken) return false

  if (!cscFetcherConfig?.getRefreshTokenUrl?.()) return false

  const response = await fetch(cscFetcherConfig.getRefreshTokenUrl(), {
    method: 'POST',
    headers: {
      Authorization: refreshToken, // use refresh token to get new token
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })

  const tokenRes = await response.json()
  const code = tokenRes?.status?.code

  if (code === successCode) {
    const { access_token, expire_in, refresh_token } = refreshDataSchema.parse(tokenRes.data)

    typedStorage.accessToken = access_token
    typedStorage.refreshToken = refresh_token
    typedStorage.expireIn = expire_in
    return true
  } else {
    typedStorage.clearToken()
    return false
  }
}
