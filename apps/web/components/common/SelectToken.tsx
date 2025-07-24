import { sortBy } from 'es-toolkit'
import Image from 'next/image'
import { FunctionComponent, useMemo } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components'
import { useAllToken } from '@/hooks'
import { useT } from '@/i18n'

interface Props {
  onSelect?: (value: string) => void
}

const SelectToken: FunctionComponent<Props> = ({ onSelect }) => {
  const { t } = useT('common')
  const { tokens } = useAllToken()
  const allToken = { id: 'all', icon: '', name: t('common:all') }

  const tokenList = useMemo(() => {
    if (!tokens) {
      return [allToken]
    }

    const list = tokens?.map((token) => ({
      id: token.tokenId,
      icon: token.icon,
      name: token.tokenName,
    }))
    return [allToken, ...sortBy(list, ['name'])]
  }, [tokens])

  return (
    <Select defaultValue={allToken.id} onValueChange={onSelect}>
      <SelectTrigger size="sm" className="w-40">
        <SelectValue placeholder={t('common:selectToken')} />
      </SelectTrigger>
      <SelectContent className="max-h-96">
        <SelectGroup>
          {tokenList?.map((token) => {
            return (
              <SelectItem key={token.id} value={token.id}>
                <Image
                  alt={token.name}
                  width={16}
                  height={16}
                  src={token.icon || '/images/symbol-placeholder.png'}
                  className="overflow-hidden rounded-full"
                />
                <span>{token.name}</span>
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectToken
