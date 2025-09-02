import { z } from 'zod'

export const WithdrawAddressSchema = z.object({
  id: z.string(),
  userId: z.optional(z.string()),
  tokenId: z.optional(z.string()),
  address: z.optional(z.string()),
  addressName: z.optional(z.string()),
  addressType: z.optional(z.number()), // 类型1，链上地址，2 uid,3 email，4 phone
  addressExt: z.optional(z.string()).nullable(), // 地址扩展字段
  tokenNetWork: z.optional(z.string()), // 币种网络
  remark: z.optional(z.string()).nullable(), // 备注
  status: z.optional(z.number()), // 状态 1:正常 2:禁用
  created: z.optional(z.string()), // 创建时间
  updated: z.optional(z.string()), // 更新时间
  requestNum: z.optional(z.number()), // 请求次数
  successNum: z.optional(z.number()), // 成功次数
  protocolName: z.optional(z.string()).nullable(),
  chainName: z.optional(z.string()).nullable(),
  chainIcon: z.optional(z.string()).nullable(),
})

export type WithdrawAddress = z.infer<typeof WithdrawAddressSchema>
