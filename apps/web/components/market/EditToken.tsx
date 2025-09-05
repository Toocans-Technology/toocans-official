'use client'

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { notification } from 'antd'
import Image from 'next/image'
import { FunctionComponent, useState, useEffect, useMemo, useRef } from 'react'
import { Empty } from '@/components/common'
import ConfirmModal from '@/components/market/ConfirmModal'
import { useT } from '@/i18n'
import { useDeleteFavorite } from '@/services/market/deleteFavorite'
import { useUpdateFavoriteOrder } from '@/services/market/updateFavoriteOrder'
import { openToast } from '@/utils'

interface EditTokenProps {
  tokens: Array<{ id: string | number; pair: string; tokenName: string }>
  onClose: () => void
  onClearAll: () => void
  searchCoin?: string
}

const EditToken: FunctionComponent<EditTokenProps> = ({ tokens, onClose, onClearAll, searchCoin }) => {
  const { t } = useT('market')
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [orderedTokens, setOrderedTokens] = useState<Array<{ id: string; name: string; tokenName: string }>>([])
  const dragStartOrderRef = useRef<string[] | null>(null)
  const { mutate: deleteFavorite } = useDeleteFavorite()
  const { mutate: updateFavoriteOrder } = useUpdateFavoriteOrder()

  useEffect(() => {
    const incoming = tokens.map((t) => ({ id: String(t.id), name: t.pair, tokenName: t.tokenName }))
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
        const pair: string = t.tokenName || ''
        const base = pair ? (pair.toLowerCase() ?? '') : ''
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
    // openToast(t('market:PinSuccess'), 'success')
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const handleDragStartDnd = () => {
    dragStartOrderRef.current = orderedTokens.map((t) => t.id)
    setIsDraggingAny(true)
  }

  const handleDragEndDnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      dragStartOrderRef.current = null
      setIsDraggingAny(false)
      return
    }

    setOrderedTokens((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id)
      const newIndex = prev.findIndex((t) => t.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return arrayMove(prev, oldIndex, newIndex)
    })
    if (dragStartOrderRef.current) {
      const endOrder = orderedTokens.map((t) => t.id)
      if (JSON.stringify(endOrder) !== JSON.stringify(dragStartOrderRef.current)) {
        // openToast(t('market:MoveSuccess'), 'success')
      }
    }
    dragStartOrderRef.current = null
    setIsDraggingAny(false)
  }

  const handleDragCancelDnd = () => {
    dragStartOrderRef.current = null
    setIsDraggingAny(false)
  }

  const [isDraggingAny, setIsDraggingAny] = useState(false)

  const SortableTokenRow: FunctionComponent<{ token: { id: string; name: string; tokenName: string } }> = ({
    token,
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: token.id })

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      background: isDragging ? '#9cff1f' : undefined,
      opacity: isDragging ? 0.5 : 1,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`relative flex w-full flex-[0_0_auto] flex-col items-start justify-center self-stretch ${!isDraggingAny ? 'border-b border-[#F4F4F4]' : ''}`}
        role="option"
      >
        <div className="relative flex h-[72px] w-full items-center justify-between self-stretch">
          <div className="relative flex h-[22px] w-24 items-center gap-2">
            <button
              onClick={() => handleTokenSelect(token.id)}
              className="relative aspect-[1] h-5 w-5 cursor-pointer"
              aria-label={`Select ${token.name}`}
              type="button"
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
              className={`text-[var(--light-text-primary,#222)]} relative w-fit cursor-pointer text-center font-[Inter] text-[14px] font-normal leading-normal`}
            >
              {token.name}
            </div>
          </div>

          <div className="relative flex h-[22px] w-[120px] select-none items-center gap-5">
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

            <div className="flex w-12 justify-end text-right" {...attributes} {...listeners}>
              <Image
                className="w-[20px] cursor-move"
                alt={t('market:DragColumn')}
                src="/images/market/drag.svg"
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
    )
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStartDnd}
              onDragEnd={handleDragEndDnd}
              onDragCancel={handleDragCancelDnd}
            >
              <SortableContext items={tokenData.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                {tokenData.map((token) => (
                  <SortableTokenRow key={token.id} token={token} />
                ))}
              </SortableContext>
            </DndContext>
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

        <div style={{ display: 'flex', gap: '24px' }}>
          <button
            onClick={() => {
              notification.destroy()
              onClose()
            }}
            className="relative w-fit cursor-pointer text-center font-[Inter] text-[14px] font-normal leading-normal text-[var(--dark-status-link,#3C7BF4)]"
          >
            {t('market:Cancel')}
          </button>
          {tokenData.length > 0 && (
            <button
              onClick={() => {
                if (!tokenData || tokenData.length === 0) {
                  notification.destroy()
                  onClose()
                  return
                }

                const total = tokenData.length
                const orders = tokenData.map((token, index) => ({
                  symbolId: token.tokenName,
                  customOrder: total - 1 - index,
                }))

                updateFavoriteOrder(
                  { orders },
                  {
                    onSuccess: () => {
                      notification.destroy()
                      openToast(t('market:UpdateOrderSuccess'), 'success')
                      onClose()
                    },
                    onError: () => {},
                  }
                )
              }}
              className="relative w-fit cursor-pointer text-center font-[Inter] text-[14px] font-normal leading-normal text-[var(--dark-status-link,#3C7BF4)]"
            >
              {t('market:DoneAction')}
            </button>
          )}
        </div>
      </div>
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('market:DeleteAllTitle')}
        description={t('market:DeleteAllDesc')}
        cancelText={t('market:Cancel')}
        confirmText={t('market:DeleteAction')}
        onConfirm={() => {
          if (selectedTokens.length > 0) {
            const selectedTokenNames = selectedTokens
              .map((id) => {
                const token = tokenData.find((t) => t.id === id)
                return token ? token.tokenName : null
              })
              .filter((tokenName) => tokenName !== null)

            const remainingCount = orderedTokens.filter((t) => !selectedTokens.includes(t.id)).length

            deleteFavorite(
              { symbolIds: selectedTokenNames },
              {
                onSuccess: () => {
                  notification.destroy()
                  openToast(t('market:RemovedFromFavoritesToast'), 'success')
                  if (remainingCount === 0) {
                    onClearAll()
                  } else {
                    setOrderedTokens((prev) => prev.filter((t) => !selectedTokens.includes(t.id)))
                  }
                },
                onError: () => {},
              }
            )
          }
          setSelectedTokens([])
        }}
      />
    </div>
  )
}

export default EditToken
