import { z } from 'zod'

export enum WithdrawalStatus {
  PendingReview = 1, // 提币待审核中
  AutoApproved = 2, // 系统自动审核
  ManuallyApproved = 3, // 人工审核通过
  ManuallyRejected = 4, // 人工审核拒绝
  WalletProcessing = 5, // 钱包处理中
  WalletSubmitFailed = 6, // 钱包提交失败（可以重新请求）
  SystemRetry = 7, // 系统重试的状态
  Success = 10, // 提币成功
  Failed = 11, // 提币失败
  ManualRejectFailed = 12, // 人工审核拒绝失败
}

export const withdrawalStatusSchema = z.nativeEnum(WithdrawalStatus)

export enum WithdrawMethod {
  Default = 0, // 默认
  OnChain = 1, // 区块链交易
  Internal = 2, // 内部转账
}

export const withdrawMethodSchema = z.nativeEnum(WithdrawMethod)

export enum VerifyType {
  sms = 'sms',
  email = 'email',
}

export const verifyTypeSchema = z.nativeEnum(VerifyType)

export enum InternalTransferType {
  UID = 1,
  Email = 2,
  Phone = 3,
}

export const internalTransferTypeSchema = z.nativeEnum(InternalTransferType)

export enum ChargeType {
  OnChain = 1, // 链上
  Internal = 2, // 内部转账
}

export const chargeTypeSchema = z.nativeEnum(ChargeType)

export enum AddressType {
  OnChain = 1, // 链上地址
  UID = 2, // UID
  Email = 3, // 邮箱
  Phone = 4, // 手机号
}

export const addressTypeSchema = z.nativeEnum(AddressType)
