import { useQuery } from '@tanstack/react-query'
import { getQuery } from '@/lib/api'
import { getUrl } from '@/lib/api/getUrl'
import { WithdrawalSchema } from './schemas'

export const getWithdrawInfo = (id?: string) => {
  return useQuery({
    ...getQuery({
      method: 'GET',
      url: getUrl(`/dw/wallet/withdrawInfo/${id}`),
      transfer: WithdrawalSchema.nullable().parse,
    }),
    enabled: !!id,
  })
}
