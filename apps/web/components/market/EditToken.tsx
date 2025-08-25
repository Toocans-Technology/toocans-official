'use client'
import { notification } from 'antd'

import Image from 'next/image'
import { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { Empty } from '@/components/common'
import ConfirmModal from '@/components/market/ConfirmModal'
import { useT } from '@/i18n'
import { openToast } from '@/utils'

interface EditTokenProps {
  tokens: Array<{ id: string | number; pair: string }>
  onClose: () => void
  searchCoin?: string
}

const EditToken: FunctionComponent<EditTokenProps> = ({ tokens, onClose, searchCoin }) => {
  const { t } = useT('market')
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [orderedTokens, setOrderedTokens] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    const incoming = tokens.map((t) => ({ id: String(t.id), name: t.pair }))
    setOrderedTokens((prev) => {
      if (prev.length === 0) return incoming
      const incomingIds = new Set(incoming.map((i) => i.id))
      const filteredPrev = prev.filter((p) => incomingIds.has(p.id))
      const existingIds = new Set(filteredPrev.map((p) => p.id))
      const additions = incoming.filter((i) => !existingIds.has(i.id))
      return [...filteredPrev, ...additions]
    })
  }, [tokens])

  const tokenData = useMemo(
    () =>
      orderedTokens.filter((t) => {
        if (!searchCoin) return true
        const key = searchCoin.trim().toLowerCase()
        const pair: string = t.name || ''
        const base = pair ? (pair.split('/')[0]?.toLowerCase() ?? '') : ''
        return base.includes(key)
      }),
    [orderedTokens, searchCoin]
  )

  useEffect(() => {
    setSelectedTokens([])
  }, [searchCoin])

  const handleTokenSelect = (tokenId: string) => {
    setSelectedTokens((prev) => (prev.includes(tokenId) ? prev.filter((id) => id !== tokenId) : [...prev, tokenId]))
  }

  const handleSelectAll = () => {
    if (selectedTokens.length === tokenData.length) {
      setSelectedTokens([])
    } else {
      setSelectedTokens(tokenData.map((token) => token.id))
    }
  }

  const handleDelete = () => {
    setConfirmOpen(true)
  }

  const handlePin = (tokenId: string) => {
    notification.destroy()
    setOrderedTokens((prev) => {
      const idx = prev.findIndex((t) => t.id === tokenId)
      if (idx <= 0) return prev
      const next = [...prev]
      const [item] = next.splice(idx, 1)
      if (!item) return prev
      next.unshift(item)
      return next
    })
    openToast(t('market:PinSuccess'), 'success')
  }

  const isTokenSelected = (tokenId: string) => selectedTokens.includes(tokenId)
  const isAllSelected = tokenData.length > 0 && selectedTokens.length === tokenData.length

  return (
    <div className="relative flex w-[1000px] flex-col items-start gap-4">
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch">
          <div
            className="relative flex w-full flex-[0_0_auto] items-center justify-between self-stretch"
            style={{ borderBottom: '1px solid #F4F4F4', paddingBottom: '8px' }}
          >
            <div className="relative flex h-[22px] w-24 items-center gap-2.5 px-0 py-2.5">
              <div className="font-12-caption-regular-second text-collection-1-light-text-third relative mb-[-8.00px] mt-[-10.00px] w-fit whitespace-nowrap font-[number:var(--12-caption-regular-second-font-weight)] leading-[var(--12-caption-regular-second-line-height)] tracking-[var(--12-caption-regular-second-letter-spacing)] [font-style:var(--12-caption-regular-second-font-style)]">
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#999)]">
                  {t('market:TokenColumn')}
                </span>
              </div>
            </div>

            <div className="relative flex h-[22px] w-[120px] items-center gap-5">
              <div className="font-12-caption-regular-second text-collection-1-light-text-third relative w-12 text-right font-[number:var(--12-caption-regular-second-font-weight)] leading-[var(--12-caption-regular-second-line-height)] tracking-[var(--12-caption-regular-second-letter-spacing)] [font-style:var(--12-caption-regular-second-font-style)]">
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#999)]">
                  {t('market:TopColumn')}
                </span>
              </div>

              <div className="font-12-caption-regular-second text-collection-1-light-text-third relative w-12 text-right font-[number:var(--12-caption-regular-second-font-weight)] leading-[var(--12-caption-regular-second-line-height)] tracking-[var(--12-caption-regular-second-letter-spacing)] [font-style:var(--12-caption-regular-second-font-style)]">
                <span className="font-[Inter] text-[12px] font-normal leading-[20px] text-[var(--light-text-third,#999)]">
                  {t('market:DragColumn')}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
          {tokenData.length === 0 ? (
            <div className="w-full py-10">
              <Empty />
            </div>
          ) : (
            tokenData.map((token) => (
              <div
                key={token.id}
                className="relative flex w-full flex-[0_0_auto] flex-col items-start justify-center self-stretch border-b border-[#F4F4F4]"
              >
                <div className="relative flex h-[72px] w-full items-center justify-between self-stretch">
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
                            ? '/images/market/frame-2131328381.svg'
                            : '/images/market/checkbox-unselect-4.svg'
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

                  <div className="relative flex h-[22px] w-[120px] items-center gap-5">
                    <div className="flex w-12 justify-end text-right">
                      <button
                        type="button"
                        onClick={() => handlePin(token.id)}
                        className="inline-flex"
                        aria-label={t('market:TopColumn')}
                      >
                        <Image
                          className="w-[20px] cursor-pointer"
                          alt={t('market:TopColumn')}
                          src="/images/market/top.svg"
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>

                    <div className="flex w-12 justify-end text-right">
                      <Image
                        className="w-[20px] cursor-pointer"
                        alt="Frame"
                        src="/images/market/drag.svg"
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="relative flex w-[1000px] flex-[0_0_auto] items-center justify-between">
        <div className="relative flex flex-[0_0_auto] items-center gap-3">
          <div className="relative flex flex-[0_0_auto] items-end gap-2">
            <button
              disabled={tokenData.length === 0}
              onClick={handleSelectAll}
              className={`relative flex flex-[0_0_auto] cursor-pointer items-center gap-2 ${tokenData.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
              aria-label={isAllSelected ? t('market:AriaDeselectAll') : t('market:AriaSelectAll')}
            >
              <Image
                className="relative aspect-[1] h-4 w-4 cursor-pointer"
                alt="Select all"
                src={isAllSelected ? '/images/market/frame-2131328381.svg' : '/images/market/checkbox-unselect-4.svg'}
                width={16}
                height={16}
              />

              <div className="relative mt-[-1.00px] w-fit text-center font-[Inter] text-[14px] font-normal leading-normal text-[var(--light-text-primary,#222)]">
                {isAllSelected ? t('market:DeselectAll') : t('market:SelectAll')}
              </div>
            </button>
          </div>

          <Image
            className="relative h-[11.5px] w-px"
            alt="Vector"
            src="/images/market/vector-4627.svg"
            width={1}
            height={12}
          />

          <button
            onClick={handleDelete}
            disabled={selectedTokens.length === 0}
            className={`relative inline-flex flex-[0_0_auto] cursor-pointer items-center gap-2 ${selectedTokens.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-label={t('market:AriaDeleteSelected')}
          >
            <Image
              className="relative h-5 w-5"
              alt="Dark action delete"
              src="/images/market/dark-action-delete.svg"
              width={20}
              height={20}
            />

            <div className="relative w-fit text-center font-[Inter] text-[14px] font-normal leading-normal text-[var(--light-text-primary,#222)]">
              {t('market:DeleteAction')}
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="relative w-fit cursor-pointer text-center font-[Inter] text-[14px] font-normal leading-normal text-[var(--dark-status-link,#3C7BF4)]"
        >
          {t('market:DoneAction')}
        </button>
      </div>
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('market:DeleteAllTitle')}
        description={t('market:DeleteAllDesc')}
        cancelText={t('market:Cancel')}
        confirmText={t('market:DeleteAction')}
        onConfirm={() => {
          setSelectedTokens([])
        }}
      />
    </div>
  )
}

export default EditToken
