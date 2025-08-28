import { z } from 'zod'

export const WithdrawAddressSchema = z.object({
  id: z.number(),
  userId: z.optional(z.string()),
  tokenId: z.optional(z.string()),
  address: z.optional(z.string()),
  addressName: z.optional(z.string()),
  addressType: z.optional(z.string()), // 类型1，链上地址，2 uid,3 email，4 phone
  addressExt: z.optional(z.string()), // 地址扩展字段
  remark: z.optional(z.string()), // 备注
  status: z.optional(z.number()), // 状态 1:正常 2:禁用
  created: z.optional(z.number()), // 创建时间
  updated: z.optional(z.number()), // 更新时间
  requestNum: z.optional(z.number()), // 请求次数
  successNum: z.optional(z.number()), // 成功次数
  protocolName: z.optional(z.string()),
  chainName: z.optional(z.string()),
  chainIcon: z.optional(z.string()),
})

export type WithdrawAddress = z.infer<typeof WithdrawAddressSchema>
