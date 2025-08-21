'use client'

import Image from 'next/image'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { PaginationControls } from '@/components/common'

const BASE_PAIRS = [
  'BTC/USDT',
  'ETH/USDT',
  'SOL/USDT',
  'DOGE/USDT',
  'BNB/USDT',
  'XRP/USDT',
  'ADA/USDT',
  'TRX/USDT',
  'LINK/USDT',
  'TON/USDT',
]

interface TokenListProps {
  onClose: () => void
}

const TokenList: FunctionComponent<TokenListProps> = ({ onClose: _onClose }) => {
  // mark prop as intentionally unused for now
  void _onClose
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const randPrice = () => Number((Math.random() * (50000 - 1) + 1).toFixed(2))
  const randChange = () => Number((Math.random() * 20 - 10).toFixed(2))

  const data = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: `t${i + 1}`,
        name: BASE_PAIRS[i % BASE_PAIRS.length],
        price: randPrice(),
        change: randChange(),
      })),
    []
  )

  const [sortKey, setSortKey] = useState<null | 'name' | 'price' | 'change'>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 5

  const toggleSort = (key: 'name' | 'price' | 'change') => {
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

  const displayData = useMemo(() => {
    if (!sortKey) return data
    const sorted = [...data]
    sorted.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortOrder === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [data, sortKey, sortOrder])

  useEffect(() => {
    setCurrentPage(1)
  }, [sortKey, sortOrder])

  const totalPages = useMemo(() => Math.ceil(displayData.length / pageSize), [displayData])
  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return displayData.slice(start, end)
  }, [displayData, currentPage])

  const getSortIcon = (key: 'name' | 'price' | 'change') => {
    if (sortKey !== key) return '/images/market/normal.png'
    return sortOrder === 'asc' ? '/images/market/asc.png' : '/images/market/desc.png'
  }
  const handleTokenSelect = (tokenId: string) => {
    setSelectedTokens((prev) => (prev.includes(tokenId) ? prev.filter((id) => id !== tokenId) : [...prev, tokenId]))
  }
  const isTokenSelected = (tokenId: string) => selectedTokens.includes(tokenId)

  return (
    <div className="relative flex w-[1000px] flex-col items-start gap-4" data-model-id="2708:1805">
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch">
          <div
            className="relative self-stretch"
            style={{ borderBottom: '1px solid #F4F4F4', paddingBottom: '8px', display: 'flex', gap: '222px' }}
          >
            <div className="relative flex h-[22px] w-[130px] items-center gap-1 px-0 py-2.5">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#999)]">
                  Name
                </span>
              </div>
              <button className="mt-1.5 h-4 w-4" aria-label="Sort by name" onClick={() => toggleSort('name')}>
                <Image alt="Sort by name" className="cursor-pointer" src={getSortIcon('name')} width={16} height={16} />
              </button>
            </div>

            <div className="relative flex h-[22px] w-[130px] items-center gap-1">
              <div>
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#999)]">
                  Price
                </span>
              </div>
              <button className="mt-1.5 h-4 w-4" aria-label="Sort by price" onClick={() => toggleSort('price')}>
                <Image
                  alt="Sort by price"
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
                  24h change
                </span>
              </div>
              <button className="mt-1.5 h-4 w-4" aria-label="Sort by change" onClick={() => toggleSort('change')}>
                <Image
                  alt="Sort by change"
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
          {pagedData.map((token) => (
            <div
              key={token.id}
              className="relative flex w-full self-stretch border-b border-[#F4F4F4]"
              style={{ flexDirection: 'row', alignItems: 'center', gap: '222px' }}
            >
              <div className="relative flex h-[72px] w-[130px] items-center justify-between self-stretch">
                <div className="relative flex h-[22px] w-24 items-center gap-2">
                  <button
                    onClick={() => handleTokenSelect(token.id)}
                    className="relative aspect-[1] h-5 w-5 cursor-pointer"
                    aria-label={`Select ${token.name}`}
                  >
                    <Image
                      alt={isTokenSelected(token.id) ? 'Checkbox selected' : 'Checkbox unselect'}
                      src={
                        isTokenSelected(token.id)
                          ? '/images/market/dark-action-favoourite-3.svg'
                          : '/images/market/dark-action-favoourite-fill-1.svg'
                      }
                      width={20}
                      height={20}
                    />
                  </button>

                  <div
                    onClick={() => handleTokenSelect(token.id)}
                    className={`relative w-fit cursor-pointer text-center font-[Inter] text-[14px] font-normal leading-normal text-[var(--light-text-primary,#222)] ${token.name === 'DOGE/USDT' ? 'mr-[-11.00px]' : ''}`}
                  >
                    {token.name}
                  </div>
                </div>
              </div>
              <div className="flex w-[130px] items-center justify-between font-[Inter] text-[14px] font-normal leading-normal text-[var(--light-text-primary,#222)]">
                {token.price}
              </div>
              <div
                className={`flex w-[130px] items-center justify-between font-[Inter] text-[14px] font-normal leading-normal ${
                  token.change > 0 ? 'text-[#1ACA75]' : 'text-[#FF476F]'
                }`}
              >
                {token.change > 0 ? `+${token.change}%` : `${token.change}%`}
              </div>
            </div>
          ))}
          <div className="mt-4 flex w-full justify-end">
            <PaginationControls totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenList
