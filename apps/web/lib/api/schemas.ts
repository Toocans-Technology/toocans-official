import { z } from 'zod'

const responseStatusSchema = z.object({
  code: z.union([z.number(), z.string()]),
  msg: z.string(),
  data: z.any().optional(),
})

export type ResponseStatus = z.infer<typeof responseStatusSchema>

export const responseSchema = z.object({ data: z.any() }).merge(responseStatusSchema)
