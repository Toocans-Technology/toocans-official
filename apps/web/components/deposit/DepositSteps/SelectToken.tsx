'use client'

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

  console.log('data', data)

  const tokenList = useMemo(() => {
    if (!tokens) {
      return []
    }

    let list = []
    const availableTokens = data?.map((item) => item.tokenId)

    if (showAvailable) {
      list = tokens
        ?.filter((token) => availableTokens?.includes(token.tokenId))
        .map((token) => ({
          id: token.id,
          icon: token.icon,
          name: token.tokenName,
          fullName: token.tokenFullName,
        }))
    } else {
      list = tokens?.map((token) => ({
        id: token.id,
        icon: token.icon,
        name: token.tokenName,
        fullName: token.tokenFullName,
      }))
    }

    return sortBy(list, ['name'])
  }, [tokens])

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
            className="hover:border-primary focus:border-primary h-11 w-[456px] justify-between border-[#f8f8f8] bg-[#f8f8f8] px-3"
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
          <Command className="p-3">
            <CommandInput placeholder={t('common:search')} />
            <CommandList className="pt-2">
              <CommandEmpty>{t('common:noData')}</CommandEmpty>
              {tokenList?.map((token) => (
                <CommandItem
                  key={token.id}
                  value={token.name}
                  onSelect={handleSelectToken}
                  keywords={[token.name]}
                  className={cn('py-3', selectedToken?.tokenName === token.name && 'data-[selected=true]:bg-[#f4f4f4]')}
                >
                  <Image
                    width={16}
                    height={16}
                    alt={token.name ?? ''}
                    src={token.icon || '/images/symbol-placeholder.png'}
                    className="max-h-4 rounded-full"
                  />
                  <div className="text-sm text-[#333]">{token.name}</div>
                  <span className="ml-3 text-[#999]">{token.fullName}</span>
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
