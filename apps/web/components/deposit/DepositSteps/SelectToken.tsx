'use client'

import { SearchIcon } from 'lucide-react'
import Image from 'next/image'
import { FunctionComponent, useCallback, useMemo, useState } from 'react'
import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components'
import { useAllToken } from '@/hooks/useAllToken'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'
import DefaultTokens from './DefaultTokens'

export const iconPlaceholder = 'https://dummyimage.com/18x18/999999/0011ff'

interface Props {
  defaultValue?: string
  showDefaultTokens?: boolean
  onSelect: (token: Token) => void
}

const SelectToken: FunctionComponent<Props> = ({ defaultValue = '', onSelect, showDefaultTokens = true }) => {
  const { t } = useT('deposit')
  const { tokens } = useAllToken()
  const [search, setSearch] = useState('')
  const [selectedToken, setSelectedToken] = useState<string>(defaultValue)

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

  const handleSelectToken = useCallback(
    (token: string) => {
      setSelectedToken(token)
      const selectedToken = tokens?.find((item) => item.tokenName === token)

      if (!selectedToken) {
        return
      }

      onSelect(selectedToken)
    },
    [tokens]
  )

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  return (
    <>
      <Select onValueChange={handleSelectToken} value={selectedToken}>
        <SelectTrigger className="w-[456px]">
          <SelectValue placeholder={t('deposit:selectToken')} />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          <SelectGroup className="mt-2 flex items-center bg-[#f8f8f8] px-3">
            <SearchIcon size={16} className="text-[#666]" />
            <Input
              className="rounded-none focus-visible:ring-0"
              placeholder={t('deposit:searchToken')}
              value={search}
              onChange={handleSearch}
            />
          </SelectGroup>
          <SelectGroup>
            {tokenList?.map((token) => {
              if (
                search &&
                (!token.name.toLowerCase().includes(search.toLowerCase()) ||
                  !token.fullName.toLowerCase().includes(search.toLowerCase()))
              ) {
                return null
              }

              return (
                <SelectItem key={token.id} value={token.name}>
                  <Image
                    src={token.icon || iconPlaceholder}
                    alt={token.name}
                    width={18}
                    height={18}
                    className="overflow-hidden rounded-full"
                  />
                  <span>{token.name}</span>
                  <span className="ml-2 text-xs text-[#999]">{token.fullName}</span>
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {showDefaultTokens && <DefaultTokens tokens={tokens} onSelect={handleSelectToken} />}
    </>
  )
}

export default SelectToken
