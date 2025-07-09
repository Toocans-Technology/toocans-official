'use client'

import Image from 'next/image'
import { FunctionComponent, useMemo } from 'react'
import { Button } from '@workspace/ui/components'
import { Token } from '@/services/basicConfig'

const iconPlaceholder = 'https://dummyimage.com/18x18/999999/0011ff'

interface Props {
  tokens?: Token[]
  onSelect: (token: string) => void
}

const DefaultTokens: FunctionComponent<Props> = ({ onSelect, tokens }) => {
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

  const usdtToken = useMemo(() => tokenList?.find((token) => token.name === 'USDT'), [tokenList])
  const btcToken = useMemo(() => tokenList?.find((token) => token.name === 'BTC'), [tokenList])
  const ethToken = useMemo(() => tokenList?.find((token) => token.name === 'ETH'), [tokenList])

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        rounded="sm"
        className="h-[34px] bg-[#f8f8f8] px-2"
        onClick={() => onSelect(usdtToken?.name || 'USDT')}
      >
        <Image
          src={usdtToken?.icon || iconPlaceholder}
          alt={usdtToken?.name || ''}
          width={16}
          height={16}
          className="overflow-hidden rounded-full"
        />
        {usdtToken?.name ?? 'USDT'}
      </Button>
      <Button
        variant="secondary"
        rounded="sm"
        className="h-[34px] bg-[#f8f8f8] px-2"
        onClick={() => onSelect(btcToken?.name || 'BTC')}
      >
        <Image
          src={btcToken?.icon || iconPlaceholder}
          alt={btcToken?.name || ''}
          width={16}
          height={16}
          className="overflow-hidden rounded-full"
        />
        {btcToken?.name ?? 'BTC'}
      </Button>
      <Button
        variant="secondary"
        rounded="sm"
        className="h-[34px] bg-[#f8f8f8] px-2"
        onClick={() => onSelect(ethToken?.name || 'ETH')}
      >
        <Image
          src={ethToken?.icon || iconPlaceholder}
          alt={ethToken?.name || ''}
          width={16}
          height={16}
          className="overflow-hidden rounded-full"
        />
        {ethToken?.name ?? 'ETH'}
      </Button>
    </div>
  )
}

export default DefaultTokens
