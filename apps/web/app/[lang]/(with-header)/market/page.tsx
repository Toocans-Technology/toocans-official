'use client'

import { notification } from 'antd'
import Image from 'next/image'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@workspace/ui/components'
import { Empty } from '@/components/common'
import EditToken from '@/components/market/EditToken'
import TokenList from '@/components/market/TokenList'
import { useLogin } from '@/hooks'
import { useT } from '@/i18n'
import { useUserFavorites, useAddFavorite, useDeleteFavorite, useMarketPrices } from '@/services/market'
import { openToast } from '@/utils'

export default function Page() {
  const { t } = useT('market')
  const [activeTab, setActiveTab] = useState<'favorites' | 'markets'>('markets')
  const [isEdit, setIsEdit] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)

  const { isLoggedIn } = useLogin()
  const [searchValue, setSearchValue] = useState('')
  const tabsWrapRef = useRef<HTMLDivElement | null>(null)

  const { data: userFavorites, refetch: refetchUserFavorites } = useUserFavorites()
  const { mutate: addFavorite } = useAddFavorite()
  const { mutate: deleteFavorite } = useDeleteFavorite()
  const { mutateAsync: fetchMarketPrices, data: marketPricesData } = useMarketPrices()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('searchValue changed:', searchValue)
  }, [searchValue])

  const handleTabChange = (tab: 'favorites' | 'markets') => {
    if (tab !== activeTab) {
      setSearchValue('')
    }
    if (tab === 'favorites' && !isLoggedIn) return
    if (tab === 'markets' && !marketPricesData) {
      fetchMarketPrices({})
    }
    setActiveTab(tab)
  }

  useEffect(() => {
    // const update = () => {
    //   const wrapRect = tabsWrapRef.current?.getBoundingClientRect()
    //   const el = (activeTab === 'favorites' ? favoritesRef.current : marketsRef.current) as HTMLButtonElement | null
    //   const elRect = el?.getBoundingClientRect()
    //   if (!wrapRect || !elRect) return
    //   const INDICATOR_WIDTH = 28
    //   const left = elRect.left - wrapRect.left + (elRect.width - INDICATOR_WIDTH) / 2
    //   const width = INDICATOR_WIDTH
    //   setIndicator({ left, width })
    // }
    // update()
    if (activeTab === 'favorites') {
      setIsAdd(false)
    } else {
      setIsAdd(true)
    }
    // window.addEventListener('resize', update)
    // return () => window.removeEventListener('resize', update)
  }, [activeTab])

  const [cryptoData, setCryptoData] = useState<
    Array<{ id: number; symbolID: string; pair: string; tokenName: string; isFavorite: boolean; customOrder?: number }>
  >([])

  const sortedCryptoData = useMemo(() => {
    if (!cryptoData || cryptoData.length === 0) return [] as typeof cryptoData
    console.log([...cryptoData].sort((a, b) => (b.customOrder ?? 0) - (a.customOrder ?? 0)))
    return [...cryptoData].sort((a, b) => (b.customOrder ?? 0) - (a.customOrder ?? 0))
  }, [cryptoData])

  const filteredMarketPricesData = useMemo(() => {
    if (!marketPricesData || !Array.isArray(marketPricesData) || cryptoData.length === 0) return []
    const pairSet = new Set(cryptoData.map((c) => c.pair).filter(Boolean))
    const orderMap = new Map(cryptoData.map((c) => [c.pair, c.customOrder ?? 0]))
    return (marketPricesData ?? [])
      .filter((m) => m?.displaySymbol && pairSet.has(m.displaySymbol))
      .sort((a, b) => {
        const oa = orderMap.get(a?.displaySymbol ?? '') ?? -Infinity
        const ob = orderMap.get(b?.displaySymbol ?? '') ?? -Infinity
        return ob - oa
      })
  }, [marketPricesData, cryptoData])

  const toggleFavorite = (tokenName: string, isFavorite: boolean) => {
    if (!isLoggedIn || userFavorites?.length === 0) {
      setCryptoData((prevCryptoData) =>
        prevCryptoData.map((crypto) =>
          crypto.tokenName === tokenName ? { ...crypto, isFavorite: !isFavorite } : crypto
        )
      )
      notification.destroy()
      openToast(isFavorite ? t('market:RemovedFromFavoritesToast') : t('market:AddedToFavoritesToast'), 'success')
      return
    }

    setLoading(true)

    if (isFavorite) {
      const symbolId = tokenName
      deleteFavorite(
        { symbolIds: [symbolId] },
        {
          onSuccess: () => {
            notification.destroy()
            openToast(t('market:RemovedFromFavoritesToast'), 'success')
            refetchUserFavorites()
            setLoading(false)
          },
          onError: () => {
            setLoading(false)
            // Handle error
          },
        }
      )
    }
  }

  const filteredCryptoData = cryptoData.filter((c) => {
    if (!searchValue) return true
    const key = searchValue.trim().toLowerCase()
    const base = c.pair?.split('/')[0]?.toLowerCase() ?? ''
    return base.includes(key)
  })
  const renderCryptoRow = (rowData: typeof cryptoData) => (
    <div className="relative flex w-full flex-[0_0_auto] flex-wrap items-center gap-5 self-stretch">
      {rowData.map((crypto) => (
        <div
          key={crypto.id}
          className="relative flex h-14 w-[318px] cursor-pointer items-center justify-between rounded-[8px] bg-[#F8F8F8] p-3 transition-opacity hover:opacity-80"
          role="button"
          aria-label={`Toggle favorite ${crypto.pair}`}
          tabIndex={0}
          onClick={() => toggleFavorite(crypto.tokenName, crypto.isFavorite)}
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
              src={
                crypto.isFavorite
                  ? '/images/market/dark-action-favoourite-fill-1.svg'
                  : '/images/market/dark-action-favoourite-3.svg'
              }
              width={20}
              height={20}
            />
          </button>
        </div>
      ))}
    </div>
  )

  useEffect(() => {
    fetchMarketPrices({})
    if (isLoggedIn) {
      setActiveTab('favorites')
    }
  }, [isLoggedIn, fetchMarketPrices])
  useEffect(() => {
    if (!userFavorites) {
      setIsEmpty(true)
      return
    }
    if (userFavorites && userFavorites.length > 0) {
      const updatedCryptoData = userFavorites
        .map((favorite) => ({
          id: favorite.id ?? 0,
          pair: favorite.symbolPairConfig?.displaySymbol,
          tokenName: favorite.symbolId,
          isFavorite: true,
          customOrder: favorite.customOrder ?? 0,
          symbolID: favorite.symbolPairConfig?.id,
        }))
        .sort((a, b) => b.customOrder - a.customOrder)
      setIsEmpty(false)
      setCryptoData(
        updatedCryptoData as Array<{
          id: number
          symbolID: string
          pair: string
          tokenName: string
          isFavorite: boolean
          customOrder?: number
        }>
      )
    } else {
      setIsEmpty(true)
      setCryptoData([
        { id: 1, symbolID: '1', pair: 'BTC/USDT', tokenName: 'BTC/USDT', isFavorite: true, customOrder: 2 },
        { id: 2, symbolID: '2', pair: 'SOL/USDT', tokenName: 'SOL/USDT', isFavorite: true, customOrder: 1 },
        { id: 3, symbolID: '3', pair: 'ETH/USDT', tokenName: 'ETH/USDT', isFavorite: true, customOrder: 0 },
      ])
    }
  }, [userFavorites])

  const hasFavorite = cryptoData.some((crypto) => crypto.isFavorite)

  return (
    <main className="relative mx-auto mt-16 flex w-[1000px] flex-col gap-6">
      <header className="text-design-token-text-light-primary relative mt-[-1.00px] w-fit text-center text-[32px] font-medium leading-[normal] tracking-[0] [font-family:'Inter',Helvetica]">
        {t('market:PageTitle')}
      </header>

      <section ref={tabsWrapRef} className="relative flex w-[1000px] flex-[0_0_auto] flex-col items-start gap-4">
        <Tabs
          value={activeTab}
          onValueChange={(val) => handleTabChange(val as 'favorites' | 'markets')}
          className="flex w-full flex-row items-center justify-between"
        >
          <TabsList className="bg-transparent">
            {isLoggedIn && <TabsTrigger value="favorites">{t('market:TabFavorites')}</TabsTrigger>}
            <TabsTrigger value="markets">{t('market:TabMarkets')}</TabsTrigger>
          </TabsList>
          <TabsContent value="favorites">
            <div className="relative mb-4 flex h-5 items-center justify-end gap-7">
              <button
                className="relative aspect-[1] h-5 w-5 cursor-pointer transition-transform hover:scale-110"
                aria-label={t('market:EditAria')}
              >
                {!isAdd && !isEdit && isLoggedIn && (
                  <Image
                    className={`relative aspect-[1] h-5 w-5 ${isEmpty ? 'pointer-events-none opacity-50' : ''}`}
                    alt={t('market:EditAria')}
                    src="/images/market/dark-action-edit.svg"
                    width={20}
                    height={20}
                    onClick={() => {
                      if (!isEmpty) {
                        setIsEdit(true)
                        setActiveTab('favorites')
                        setIsAdd(false)
                        setSearchValue('')
                      }
                    }}
                  />
                )}
              </button>
              {!isEdit && (
                <div className="relative flex cursor-pointer items-center">
                  <div className="flex w-full items-center gap-3 rounded-full bg-[#f7f7f7] p-3">
                    <Image
                      className="h-5 w-5"
                      alt={t('market:SearchPlaceholder')}
                      src="/images/market/dark-action-search.svg"
                      width={20}
                      height={20}
                    />
                    <input
                      type="text"
                      className="w-full bg-transparent text-[14px] text-[#1f2937] outline-none placeholder:text-[#9ca3af]"
                      placeholder={t('market:SearchPlaceholder')}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      aria-label={t('market:SearchAria')}
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="markets">
            <div className="relative mb-4 flex h-5 items-center justify-end gap-7">
              {!isEdit && (
                <div className="relative flex cursor-pointer items-center">
                  <div className="flex w-full items-center gap-3 rounded-full bg-[#f7f7f7] p-3">
                    <Image
                      className="h-5 w-5"
                      alt={t('market:SearchPlaceholder')}
                      src="/images/market/dark-action-search.svg"
                      width={20}
                      height={20}
                    />
                    <input
                      type="text"
                      className="w-full bg-transparent text-[14px] text-[#1f2937] outline-none placeholder:text-[#9ca3af]"
                      placeholder={t('market:SearchPlaceholder')}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      aria-label={t('market:SearchAria')}
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section
        className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch"
        id="crypto-content"
        role="tabpanel"
      >
        {!isEdit && !isAdd && cryptoData.length === 0 && (
          <h2 className="relative mt-[-1.00px] self-stretch font-[Inter] text-[14px] font-normal leading-normal text-[var(--light-text-secondary,#666)]">
            {t('market:SelectCrypto')}
          </h2>
        )}

        <div className="relative flex w-full flex-[0_0_auto] flex-col items-center gap-4 self-stretch">
          {isEdit && !isAdd && (
            <EditToken
              tokens={cryptoData}
              onClose={() => {
                setSearchValue('')
                setIsEdit(false)
                refetchUserFavorites()
              }}
              searchCoin={searchValue}
            />
          )}

          {isAdd && (
            <TokenList
              onClose={() => {
                setSearchValue('')
                setIsAdd(false)
              }}
              cryptoData={userFavorites && userFavorites?.length > 0 ? sortedCryptoData : []}
              marketPricesData={marketPricesData ?? []}
              searchCoin={searchValue}
              onTokenSelect={(tokenName, isFavorite) => {
                if (!isFavorite) {
                  const token = tokenName
                  if (token) {
                    const favoriteCount = cryptoData.filter((c) => c.isFavorite).length
                    addFavorite(
                      { favorites: [{ symbolId: token as string, customOrder: favoriteCount }] },
                      {
                        onSuccess: () => {
                          notification.destroy()
                          openToast(t('market:AddedToFavoritesToast'), 'success')
                          setCryptoData((prev) =>
                            prev.map((c) => (c.tokenName === token ? { ...c, isFavorite: true } : c))
                          )
                          refetchUserFavorites()
                        },
                        onError: () => {
                          // Handle error
                        },
                      }
                    )
                  }
                } else {
                  const token = tokenName
                  if (token) {
                    deleteFavorite(
                      { symbolIds: [token] },
                      {
                        onSuccess: () => {
                          notification.destroy()
                          setCryptoData((prev) =>
                            prev.map((c) => (c.tokenName === token ? { ...c, isFavorite: false } : c))
                          )
                          openToast(t('market:RemovedFromFavoritesToast'), 'success')
                          refetchUserFavorites()
                        },
                        onError: () => {
                          // Handle error
                        },
                      }
                    )
                  }
                }
              }}
            />
          )}
          {!isEdit && !isAdd && (userFavorites?.length ?? 0) > 0 && filteredCryptoData.length > 0 && (
            <TokenList
              onClose={() => {
                setSearchValue('')
                setIsAdd(false)
              }}
              cryptoData={sortedCryptoData}
              marketPricesData={filteredMarketPricesData}
              searchCoin={searchValue}
              onTokenSelect={(tokenName, isFavorite) => {
                if (!isFavorite) {
                  const token = tokenName
                  if (token) {
                    const favoriteCount = cryptoData.filter((c) => c.isFavorite).length
                    addFavorite(
                      { favorites: [{ symbolId: token as string, customOrder: favoriteCount }] },
                      {
                        onSuccess: () => {
                          notification.destroy()
                          openToast(t('market:AddedToFavoritesToast'), 'success')
                          setCryptoData((prev) =>
                            prev.map((c) => (c.tokenName === token ? { ...c, isFavorite: true } : c))
                          )
                          refetchUserFavorites()
                        },
                        onError: () => {
                          // Handle error
                        },
                      }
                    )
                  }
                } else {
                  const token = tokenName
                  if (token) {
                    deleteFavorite(
                      { symbolIds: [token] },
                      {
                        onSuccess: () => {
                          notification.destroy()
                          setCryptoData((prev) =>
                            prev.map((c) => (c.tokenName === token ? { ...c, isFavorite: false } : c))
                          )
                          openToast(t('market:RemovedFromFavoritesToast'), 'success')
                          refetchUserFavorites()
                        },
                        onError: () => {
                          // Handle error
                        },
                      }
                    )
                  }
                }
              }}
            />
          )}
          {!isEdit && !isAdd && (userFavorites?.length ?? 0) === 0 && filteredCryptoData.length === 0 && <Empty />}
          {!isEdit &&
            !isAdd &&
            (userFavorites?.length ?? 0) === 0 &&
            filteredCryptoData.length > 0 &&
            renderCryptoRow(filteredCryptoData)}
          {!isEdit && !isAdd && userFavorites?.length === 0 && (
            <button
              className={`relative flex h-10 w-[210px] cursor-pointer items-center justify-center gap-2.5 rounded-[40px] bg-[#9cff1f] px-[127px] py-2 transition-colors hover:bg-[#8ae01b] focus:outline-none focus:ring-2 focus:ring-[#9cff1f] focus:ring-offset-2 ${!hasFavorite ? 'opacity-50' : ''}`}
              onClick={() => {
                const favoriteTokens = cryptoData.filter((crypto) => crypto.isFavorite)
                let favorites = favoriteTokens.map((favorite, index) => {
                  // const token = allTokenData?.find((t) => t.tokenId === favorite.tokenName)
                  // if (token) {
                  //   return {
                  //     symbolId: token.tokenId,
                  //     customOrder: index,
                  //   }
                  // } else {
                  return {
                    symbolId: favorite.tokenName,
                    customOrder: index,
                    // }
                  }
                })
                if (favorites.length > 0) {
                  const total = favorites.length
                  favorites = favorites.map((f, i) => ({ ...f, customOrder: total - 1 - i }))
                  setLoading(true)
                  addFavorite(
                    { favorites },
                    {
                      onSuccess: () => {
                        notification.destroy()
                        openToast(t('market:AddedToFavoritesToast'), 'success')
                        refetchUserFavorites()
                        setLoading(false)
                      },
                      onError: () => {
                        setLoading(false)
                      },
                    }
                  )
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <span className="loader" />
              ) : (
                <span className="relative ml-[-85.00px] mr-[-85.00px] mt-[-1.00px] w-fit whitespace-nowrap text-right font-[Inter] text-[16px] font-medium leading-[24px] text-[var(--dark-button-text-primary,#222)]">
                  {t('market:AddToFavoritesBtn')}
                </span>
              )}
            </button>
          )}
        </div>
      </section>
    </main>
  )
}
