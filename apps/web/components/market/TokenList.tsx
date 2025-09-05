'use client'

import Image from 'next/image'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { PaginationControls } from '@/components/common'
import { useLogin } from '@/hooks'
import { useT } from '@/i18n'
import { applyTokenPrecision } from '@/lib/utils'

const WS_SUBSCRIBE_MSG = {
  method: 'subscribe_live_price',
  sn: '1',
}

interface TokenListProps {
  onClose: () => void
  searchCoin?: string
  cryptoData: Array<{ id: number; symbolID: string; pair: string; tokenName: string; isFavorite: boolean }>
  marketPricesData: Array<{
    id: string | null
    displaySymbol: string | null
    baseToken: string | null
    quoteToken: string | null
    cexName: string | null
    channelIndex: string | null
    rulePairInfo: {
      ruleName: string | null
      roundMode?: number | null | undefined
      padWithZeros?: number | null | undefined
      displayPrecision?: number | null | undefined
    } | null
    sort?: string | null | undefined
    marketPrice?: string | null | undefined
    marketPriceChange?: string | null | undefined
    state?: number | null | undefined
  }>
  onTokenSelect?: (tokenName: string, isFavorite: boolean) => void
}

const TokenList: FunctionComponent<TokenListProps> = ({
  onClose: _onClose,
  searchCoin,
  cryptoData,
  marketPricesData,
  onTokenSelect,
}) => {
  void _onClose
  const { t } = useT('market')
  const [favoritesIds, setFavoritesIds] = useState<string[]>([])
  useEffect(() => {
    setFavoritesIds(cryptoData.filter((c) => c.isFavorite).map((c) => c.symbolID))
  }, [cryptoData])

  const [marketWSData, setMarketWSData] = useState<typeof marketPricesData>([])

  const data = useMemo(() => {
    if (marketPricesData) {
      const mapped = marketPricesData.map((item) => {
        const updatedItem = marketWSData.find((updated) => updated.id === item.id)

        return {
          id: String(item.id),
          name: item?.displaySymbol?.toUpperCase?.() ?? '--',
          price: updatedItem?.marketPrice || item?.marketPrice,
          tokenName: item?.displaySymbol,
          change: updatedItem?.marketPriceChange || item?.marketPriceChange,
          state: item?.state,
          isFavorite: favoritesIds.includes(String(item.id)),
          sort: item?.sort,
        }
      })
      return mapped
    }
    return []
  }, [marketPricesData, favoritesIds, marketWSData])

  const [sortKey, setSortKey] = useState<null | 'name' | 'price' | 'change'>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 20
  const { isLoggedIn } = useLogin()

  const toggleSort = (key: 'name' | 'price' | 'change') => {
    console.log('Toggling sort:', key)
    if (sortKey !== key) {
      setSortKey(key)
      setSortOrder('asc')
    } else if (sortOrder === 'asc') {
      setSortOrder('desc')
    } else {
      setSortKey(null)
      setSortOrder('asc')
    }
  }

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    let page = data.slice(start, end)
    if (searchCoin) {
      console.log('Filtering by searchCoin:', searchCoin)
      const key = searchCoin.trim().toLowerCase()
      page = page.filter((d) => {
        const pair = d.name || ''
        const base = typeof pair === 'string' ? (pair.split('/')[0]?.toLowerCase() ?? '') : ''
        return base.includes(key)
      })
    }
    if (sortKey) {
      page = [...page].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
          return sortOrder === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
        }
        const cmp = String(aVal).localeCompare(String(bVal))
        return sortOrder === 'asc' ? cmp : -cmp
      })
    }
    return page
  }, [data, currentPage, searchCoin, sortKey, sortOrder, pageSize])

  const displayData = useMemo(() => data, [data])

  const totalPages = useMemo(() => Math.ceil(displayData.length / pageSize), [displayData])

  const getSortIcon = (key: 'name' | 'price' | 'change') => {
    if (sortKey !== key) return '/images/market/normal.svg'
    return sortOrder === 'asc' ? '/images/market/asc.svg' : '/images/market/desc.svg'
  }
  const handleTokenSelect = (tokenId: string, tokenName: string, isFavorite: boolean) => {
    if (typeof onTokenSelect === 'function') {
      onTokenSelect(tokenName, isFavorite)
    }
  }
  const isTokenSelected = (tokenId: string) => {
    return favoritesIds.includes(tokenId)
  }

  const formatAmount = (val: number | string | BigNumber, coinName: string) => {
    try {
      const str = applyTokenPrecision(
        marketPricesData?.find((token) => token.displaySymbol?.toUpperCase() === coinName?.toUpperCase())?.rulePairInfo,
        val
      )
      return str
    } catch {
      return '--'
    }
  }
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_QUOTATION_WSS
    if (!wsUrl || !marketPricesData) {
      return
    }
    const ws = new window.WebSocket(wsUrl)

    ws.onopen = () => {
      ws.send(JSON.stringify(WS_SUBSCRIBE_MSG))
    }

    ws.onmessage = (event) => {
      try {
        const wsData = JSON.parse(event.data)
        const payloads = wsData.payloads
        if (Array.isArray(payloads) && marketPricesData) {
          const updatedData = [...marketPricesData]
          payloads.forEach((payload) => {
            const index = updatedData.findIndex(
              (token) => token.displaySymbol?.split('/')[0]?.toUpperCase() === payload.baseTokenId?.toUpperCase()
            )
            if (index !== -1 && updatedData[index]) {
              updatedData[index].marketPrice = payload.marketPrice
              updatedData[index].marketPriceChange = payload.marketPriceChange
            }
          })
          setMarketWSData(updatedData)
        }
      } catch (err) {
        console.error('Error parsing WebSocket data:', err)
      }
    }

    ws.onclose = () => {
      console.log('WSS closed')
    }
    ws.onerror = (err) => {
      console.log('WSSSSmarketPricesData:', marketPricesData)
      console.error('WSS error:', err)
    }
  }, [marketPricesData])

  return (
    <div className="relative flex w-[1000px] flex-col items-start gap-4">
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch">
          <div
            className="relative self-stretch"
            style={{ borderBottom: '1px solid #F4F4F4', paddingBottom: '8px', display: 'flex', gap: '222px' }}
          >
            <div className="relative flex h-[22px] w-[130px] items-center gap-1 px-0 py-2.5">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#999)]">
                  {t('market:NameColumn')}
                </span>
              </div>
              <button className="mt-1.5 h-4 w-4" aria-label={t('market:SortByName')} onClick={() => toggleSort('name')}>
                <Image
                  alt={t('market:SortByName')}
                  className="cursor-pointer"
                  src={getSortIcon('name')}
                  width={16}
                  height={16}
                />
              </button>
            </div>

            <div className="relative flex h-[22px] w-[130px] items-center gap-1">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#999)]">
                  {t('market:PriceColumn')}
                </span>
              </div>
              <button
                className="mt-1.5 h-4 w-4"
                aria-label={t('market:SortByPrice')}
                onClick={() => toggleSort('price')}
              >
                <Image
                  alt={t('market:SortByPrice')}
                  className="cursor-pointer"
                  src={getSortIcon('price')}
                  width={16}
                  height={16}
                />
              </button>
            </div>

            <div className="relative flex h-[22px] w-[130px] items-center gap-1">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#999)]">
                  {t('market:Change24hColumn')}
                </span>
              </div>
              <button
                className="mt-1.5 h-4 w-4"
                aria-label={t('market:SortByChange')}
                onClick={() => toggleSort('change')}
              >
                <Image
                  alt={t('market:SortByChange')}
                  className="cursor-pointer"
                  src={getSortIcon('change')}
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
          {displayData.length === 0 || pagedData.length === 0 ? (
            <div>
            </div>
          ) : (
            <>
              {pagedData.map((token) => (
                <div
                  key={token.id}
                  className="relative flex w-full self-stretch border-b border-[#F4F4F4]"
                  style={{ flexDirection: 'row', alignItems: 'center', gap: '222px' }}
                >
                  <div className="relative flex h-[72px] w-[130px] items-center justify-between self-stretch">
                    <div className="relative flex h-[22px] w-24 items-center gap-2">
                      {isLoggedIn && (
                        <button
                          onClick={() => handleTokenSelect(token.id, token.tokenName as string, token.isFavorite)}
                          className="relative aspect-[1] h-5 w-5 cursor-pointer"
                          aria-label={t('market:AriaSelectToken', { pair: token.name })}
                        >
                          <Image
                            alt={
                              !isTokenSelected(token.id) ? t('market:CheckboxSelected') : t('market:CheckboxUnselected')
                            }
                            src={
                              !isTokenSelected(token.id)
                                ? '/images/market/dark-action-favoourite-3.svg'
                                : '/images/market/dark-action-favoourite-fill-1.svg'
                            }
                            width={20}
                            height={20}
                          />
                        </button>
                      )}

                      <div
                        onClick={() => handleTokenSelect(token.id, token.tokenName as string, token.isFavorite)}
                        className={`text-[var(--light-text-primary,#222)]} relative w-fit cursor-pointer text-center font-[Inter] text-[14px] font-normal leading-normal`}
                      >
                        {token.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-[130px] items-center justify-between font-[Inter] text-[14px] font-normal leading-normal text-[var(--light-text-primary,#222)]">
                    {formatAmount(Number(token.price), token.name as string)}
                  </div>
                  <div
                    className={`flex w-[130px] items-center justify-between font-[Inter] text-[14px] font-normal leading-normal ${
                      Number(token.change) > 0 ? 'text-[#1ACA75]' : 'text-[#FF476F]'
                    }`}
                  >
                    {Number(token.change) > 0
                      ? `+${Number(token.change).toFixed(2)}%`
                      : `${Number(token.change).toFixed(2)}%`}
                  </div>
                </div>
              ))}
              <div className="mt-4 flex w-full justify-end">
                <PaginationControls totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TokenList
