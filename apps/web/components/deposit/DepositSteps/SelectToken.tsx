'use client'

import { BigNumber } from 'bignumber.js'
import { sortBy } from 'es-toolkit'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { FunctionComponent, useCallback, useMemo, useState } from 'react'
import {
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { Empty } from '@/components/common'
import { useAssetAll } from '@/hooks'
import { useAllToken } from '@/hooks/useAllToken'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'
import DefaultTokens from './DefaultTokens'

interface Props {
  showAvailable?: boolean
  showDefaultTokens?: boolean
  onSelect?: (token: Token) => void
}

const SelectToken: FunctionComponent<Props> = ({ onSelect, showDefaultTokens = true, showAvailable = false }) => {
  const { t } = useT('common')
  const { tokens } = useAllToken()
  const { data } = useAssetAll()
  const [open, setOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Token>()

  const tokenList = useMemo(() => {
    if (!tokens) {
      return []
    }

    let list = []
    const availableTokens = data?.filter((item) => BigNumber(item.assetTotal || 0).gt(0)).map((item) => item.tokenId)

    if (showAvailable) {
      list = tokens
        ?.filter((token) => availableTokens?.includes(token.tokenId))
        .map((token) => {
          const asset = data?.find((item) => item.tokenId === token.tokenId)
          return {
            id: token.id,
            icon: token.icon,
            name: token.tokenName,
            fullName: token.tokenFullName,
            amount: asset?.assetTotal,
            availableBalance: Number(asset?.availableAssetTotal || 0),
          }
        })

      return sortBy(list, ['availableBalance']).reverse()
    } else {
      list = tokens?.map((token) => ({
        id: token.id,
        icon: token.icon,
        name: token.tokenName,
        fullName: token.tokenFullName,
        amount: '',
        availableBalance: '',
      }))

      return sortBy(list, ['name'])
    }
  }, [tokens, data])

  const handleSelectToken = useCallback(
    (value: string) => {
      const selectedToken = tokens?.find((item) => item.tokenName === value)

      if (!selectedToken) {
        return
      }

      setOpen(false)
      setSelectedToken(selectedToken)
      onSelect?.(selectedToken)
    },
    [tokens]
  )

  return (
    <>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            rounded="sm"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="hover:border-brand focus:border-brand h-11 w-[518px] justify-between border-[#f8f8f8] bg-[#f8f8f8] px-3"
          >
            <div className="flex items-center gap-2">
              {selectedToken ? (
                <>
                  <Image
                    src={selectedToken?.icon || '/images/symbol-placeholder.png'}
                    width={16}
                    height={16}
                    alt={selectedToken?.tokenName ?? ''}
                  />
                  <div className="text-sm text-[#333]">{selectedToken?.tokenName}</div>
                </>
              ) : (
                <span className="text-xs text-[#999]">{t('common:searchToken')}</span>
              )}
            </div>
            <ChevronDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[518px] border-none p-0 shadow-lg" align="start">
          <Command
            className="p-3"
            filter={(value, search) => {
              if (value.toLowerCase().includes(search.toLowerCase())) return 1
              return 0
            }}
          >
            <CommandInput placeholder={t('common:search')} />
            <CommandList className="pt-2">
              <CommandEmpty>
                <Empty />
              </CommandEmpty>
              {tokenList?.map((token) => (
                <CommandItem
                  key={token.id}
                  value={token.name}
                  onSelect={handleSelectToken}
                  keywords={[token.name]}
                  className={cn(
                    'flex justify-between py-3',
                    selectedToken?.tokenName === token.name && 'data-[selected=true]:bg-[#f4f4f4]'
                  )}
                >
                  <div className="flex flex-1 items-center gap-2">
                    <Image
                      width={16}
                      height={16}
                      alt={token.name ?? ''}
                      src={token.icon || '/images/symbol-placeholder.png'}
                      className="max-h-4 rounded-full"
                    />
                    <div className="text-sm text-[#333]">{token.name}</div>
                    <span className="text-[#999]">{token.fullName}</span>
                  </div>
                  {showAvailable && (
                    <>
                      <span className="text-[#999]">{token.amount}</span>
                    </>
                  )}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {showDefaultTokens && <DefaultTokens tokens={tokens} onSelect={handleSelectToken} />}
    </>
  )
}

export default SelectToken
