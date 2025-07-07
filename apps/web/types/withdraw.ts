import { z } from 'zod'

export enum WithdrawalStatus {
  PendingReview = 1, // 提币待审核中
  AutoApproved = 2, // 系统自动审核
  ManuallyApproved = 3, // 人工审核通过
  ManuallyRejected = 4, // 人工审核拒绝
  WalletProcessing = 5, // 钱包处理中
  WalletSubmitFailed = 6, // 钱包提交失败（可以重新请求）
  Success = 10, // 提币成功
  Failed = 11, // 提币失败
  ManualRejectFailed = 12, // 人工审核拒绝失败
}

export const withdrawalStatusSchema = z.nativeEnum(WithdrawalStatus)

export enum WithdrawMethod {
  Default = 0, // 默认
  Blockchain = 1, // 区块链交易
  Internal = 2, // 内部转账
}

export const withdrawMethodSchema = z.nativeEnum(WithdrawMethod)

export enum VerifyType {
  sms = 'sms',
  email = 'email',
}

export const verifyTypeSchema = z.nativeEnum(VerifyType)
