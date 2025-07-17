import Image from 'next/image'
import { FunctionComponent, useMemo } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components'
import { useAllToken } from '@/hooks'
import { useT } from '@/i18n'
import { SYMBOL_ICON_PLACEHOLDER } from '@/lib/utils'
import { Token } from '@/services/basicConfig'

interface Props {
  onSelect?: (token: Token) => void
}

const SelectToken: FunctionComponent<Props> = () => {
  const { t } = useT('common')
  const { tokens } = useAllToken()
  const tokenList = useMemo(
    () =>
      tokens?.map((token) => ({
        id: token.id,
        icon: token.icon,
        name: token.tokenName,
        fullName: token.tokenFullName,
      })),
    [tokens]
  )

  return (
    <Select>
      <SelectTrigger size="sm" className="w-40">
        <SelectValue placeholder={t('common:selectToken')} />
      </SelectTrigger>
      <SelectContent className="max-h-96">
        <SelectGroup>
          {tokenList?.map((token) => {
            return (
              <SelectItem key={token.id} value={token.name}>
                <Image
                  alt={token.name}
                  width={16}
                  height={16}
                  src={token.icon || SYMBOL_ICON_PLACEHOLDER}
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
