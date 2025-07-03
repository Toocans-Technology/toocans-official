import { z } from 'zod'

export enum AllowDeposit {
  enabled = 1,
  disabled = 0,
}

export const allowDepositSchema = z.nativeEnum(AllowDeposit)

export enum AllowWithdraw {
  enabled = 1,
  disabled = 0,
}

export const allowWithdrawSchema = z.nativeEnum(AllowWithdraw)
