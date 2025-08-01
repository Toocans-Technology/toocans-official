import { z } from 'zod'

// kyc 等级: 0-未认证 1-初级认证
export enum KycLevel {
  unverified = 0,
  low = 1,
}

export const kycLevelSchema = z.nativeEnum(KycLevel)

export enum BusinessType {
  invalid = 'INVALID',
  deposit = 'DEPOSIT',
  withdraw = 'WITHDRAW',
  transfer = 'TRANSFER',
  internal = 'INTERNAL',
  convert = 'CONVERT',
}

export const businessTypeSchema = z.nativeEnum(BusinessType)
