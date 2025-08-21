'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import EditToken from '@/components/market/EditToken'
import TokenList from '@/components/market/TokenList'

export default function Page() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'markets'>('favorites')
  const [isEdit, setIsEdit] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const tabsWrapRef = useRef<HTMLDivElement | null>(null)
  const favoritesRef = useRef<HTMLButtonElement | null>(null)
  const marketsRef = useRef<HTMLButtonElement | null>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

  useEffect(() => {
    const update = () => {
      const wrapRect = tabsWrapRef.current?.getBoundingClientRect()
      const el = (activeTab === 'favorites' ? favoritesRef.current : marketsRef.current) as HTMLButtonElement | null
      const elRect = el?.getBoundingClientRect()
      if (!wrapRect || !elRect) return
      const INDICATOR_WIDTH = 28
      const left = elRect.left - wrapRect.left + (elRect.width - INDICATOR_WIDTH) / 2
      const width = INDICATOR_WIDTH
      setIndicator({ left, width })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [activeTab])

  const cryptoData = [
    {
      id: 1,
      pair: 'BTC/USDT',
      isFavorite: false,
      favoriteIcon: '/images/market/dark-action-favoourite-3.svg',
    },
    {
      id: 2,
      pair: 'ETH/USDT',
      isFavorite: true,
      favoriteIcon: '/images/market/dark-action-favoourite-fill-1.svg',
    },
    {
      id: 3,
      pair: 'SOL/USDT',
      isFavorite: false,
      favoriteIcon: '/images/market/dark-action-favoourite-5.svg',
    },
    {
      id: 4,
      pair: 'DOGE/USDT',
      isFavorite: false,
      favoriteIcon: '/images/market/dark-action-favoourite-5.svg',
    },
  ]

  const renderCryptoRow = (rowData: typeof cryptoData) => (
    <div className="relative flex w-full flex-[0_0_auto] items-center gap-6 self-stretch">
      {rowData.map((crypto) => (
        <div
          key={crypto.id}
          className="bg-collection-1-light-bg-lv1 relative flex h-14 w-[232px] items-center justify-between rounded-lg p-3 transition-opacity hover:opacity-80"
          role="button"
          aria-label={`Select ${crypto.pair} trading pair`}
          tabIndex={0}
        >
          <span className="relative w-fit text-center font-[Inter] text-[14px] font-normal leading-normal text-[var(--light-text-primary,#222)]">
            {crypto.pair}
          </span>

          <button
            className="relative h-5 w-5 cursor-pointer transition-transform hover:scale-110"
            aria-label={crypto.isFavorite ? `Remove ${crypto.pair} from favorites` : `Add ${crypto.pair} to favorites`}
          >
            <Image
              className="relative h-5 w-5"
              alt={crypto.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              src={crypto.favoriteIcon}
              width={20}
              height={20}
            />
          </button>
        </div>
      ))}
    </div>
  )

  return (
    <main className="relative mx-auto mt-16 flex w-[1000px] flex-col gap-6">
      <header className="text-design-token-text-light-primary relative mt-[-1.00px] w-fit text-center text-[32px] font-medium leading-[normal] tracking-[0] [font-family:'Inter',Helvetica]">
        Market
      </header>

      <section ref={tabsWrapRef} className="relative flex w-[1000px] flex-[0_0_auto] flex-col items-start gap-4">
        <nav className="relative flex w-full flex-[0_0_auto] items-center justify-between self-stretch" role="tablist">
          <div className="relative inline-flex flex-[0_0_auto] items-center gap-[23px]">
            <button
              className={`relative mt-[-1.00px] w-fit whitespace-nowrap text-center font-[Inter] text-[16px] font-medium leading-normal ${
                activeTab === 'favorites'
                  ? 'text-[var(--light-brand-lv1,#1ACA75)]'
                  : 'text-[var(--light-brand-lv1,#666)]'
              } cursor-pointer transition-colors hover:opacity-80`}
              ref={favoritesRef}
              onClick={() => {
                setActiveTab('favorites')
              }}
              role="tab"
              aria-selected={activeTab === 'favorites'}
              aria-controls="crypto-content"
            >
              Favorites
            </button>
            <button
              className={`relative mt-[-1.00px] w-fit whitespace-nowrap text-center font-[Inter] text-[16px] ${
                activeTab === 'markets' ? 'text-[var(--light-brand-lv1,#1ACA75)]' : 'text-[var(--light-brand-lv1,#666)]'
              } cursor-pointer transition-colors hover:opacity-80`}
              ref={marketsRef}
              onClick={() => {
                setActiveTab('markets')
              }}
              role="tab"
              aria-selected={activeTab === 'markets'}
              aria-controls="crypto-content"
            >
              Markets
            </button>
          </div>

          <div className="relative flex h-5 items-center gap-7">
            <button
              className="relative aspect-[1] h-5 w-5 cursor-pointer transition-transform hover:scale-110"
              aria-label="Edit settings"
            >
              <Image
                className="relative aspect-[1] h-5 w-5"
                alt="Edit settings"
                src="/images/market/dark-action-edit.svg"
                width={20}
                height={20}
                onClick={() => { setIsEdit(!isEdit); setIsAdd(false); }}
              />
            </button>

            {isSearchOpen ? (
              <div className="relative flex cursor-pointer items-center">
                <div className="flex w-full items-center gap-3 rounded-full bg-[#f7f7f7] p-3">
                  <Image
                    className="h-5 w-5"
                    alt="search"
                    src="/images/market/dark-action-search.svg"
                    width={20}
                    height={20}
                    onClick={() => setIsSearchOpen((v) => !v)}
                  />
                  <input
                    type="text"
                    className="w-full bg-transparent text-[14px] text-[#1f2937] outline-none placeholder:text-[#9ca3af]"
                    placeholder="label"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    aria-label="Search markets input"
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              <button
                className="relative h-5 w-5 cursor-pointer transition-transform hover:scale-110"
                aria-label="Search markets"
              >
                <Image
                  className="relative h-5 w-5"
                  alt="Search markets"
                  src="/images/market/dark-action-search.svg"
                  width={20}
                  height={20}
                  onClick={() => setIsSearchOpen((v) => !v)}
                />
              </button>
            )}
          </div>
        </nav>

        <div className="relative h-[1px] w-[1000px] bg-[#F4F4F4]">
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${indicator.left}px`,
              width: `${indicator.width}px`,
              height: '2px',
              background: 'var(--light-brand-lv1, #1ACA75)',
              flexShrink: 0,
              transition: 'left 200ms ease, width 200ms ease',
            }}
          />
        </div>
      </section>

      <section
        className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch"
        id="crypto-content"
        role="tabpanel"
      >
        {(!isEdit && !isAdd) && (
          <h2 className="relative mt-[-1.00px] self-stretch font-[Inter] text-[14px] font-normal leading-normal text-[var(--light-text-secondary,#666)]">
            Select crypto
          </h2>
        )}

        <div className="relative flex w-full flex-[0_0_auto] flex-col items-center gap-4 self-stretch">
          {(!isAdd && isEdit) && <EditToken tokens={cryptoData} onClose={() => setIsEdit(false)} />}

          {(isAdd && !isEdit) && <TokenList onClose={() => setIsAdd(false)} />}

          {(!isEdit && !isAdd) && (
            renderCryptoRow(cryptoData)
          )}
          {(!isEdit && !isAdd) && (
            <button
              className="relative flex h-10 w-[210px] cursor-pointer items-center justify-center gap-2.5 rounded-[40px] bg-[#9cff1f] px-[127px] py-2 transition-colors hover:bg-[#8ae01b] focus:outline-none focus:ring-2 focus:ring-[#9cff1f] focus:ring-offset-2"
              onClick={() => setIsAdd(true)}
            >
              <span className="relative ml-[-85.00px] mr-[-85.00px] mt-[-1.00px] w-fit whitespace-nowrap text-right font-[Inter] text-[16px] font-medium leading-[24px] text-[var(--dark-button-text-primary,#222)]">
                Add to Favorites
              </span>
            </button>
          )}
        </div>
      </section>
    </main>
  )
}
