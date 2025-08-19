'use client'

import Image from 'next/image'
import { FunctionComponent, useState } from 'react'
import ConfirmModal from '@/components/market/ConfirmModal'

interface EditTokenProps {
  tokenname: string
  onClose: () => void
}

const EditToken: FunctionComponent<EditTokenProps> = ({ tokenname, onClose }) => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)

  const tokenData = [
    { id: 'btc-usdt-1', name: 'BTC/USDT' },
    { id: 'eth-usdt', name: 'ETH/USDT' }, 
    { id: 'sol-usdt', name: 'SOL/USDT' },
    { id: 'doge-usdt', name: 'DOGE/USDT' },
    { id: 'btc-usdt-2', name: 'BTC/USDT' },
  ]

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

  const isTokenSelected = (tokenId: string) => selectedTokens.includes(tokenId)
  const isAllSelected = selectedTokens.length === tokenData.length

  return (
    <div className="relative flex w-[1000px] flex-col items-start gap-4" data-model-id="2708:1805">
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch">
          <div className="relative flex w-full flex-[0_0_auto] items-center justify-between self-stretch">
            <div className="relative flex h-[22px] w-24 items-center gap-2.5 px-0 py-2.5">
              <div className="font-12-caption-regular-second text-collection-1-light-text-third relative mb-[-8.00px] mt-[-10.00px] w-fit whitespace-nowrap text-[length:var(--12-caption-regular-second-font-size)] font-[number:var(--12-caption-regular-second-font-weight)] leading-[var(--12-caption-regular-second-line-height)] tracking-[var(--12-caption-regular-second-letter-spacing)] [font-style:var(--12-caption-regular-second-font-style)]">
                Token
              </div>
            </div>

            <div className="relative flex h-[22px] w-[120px] items-center gap-5">
              <div className="font-12-caption-regular-second text-collection-1-light-text-third relative w-12 text-right text-[length:var(--12-caption-regular-second-font-size)] font-[number:var(--12-caption-regular-second-font-weight)] leading-[var(--12-caption-regular-second-line-height)] tracking-[var(--12-caption-regular-second-letter-spacing)] [font-style:var(--12-caption-regular-second-font-style)]">
                Top
              </div>

              <div className="font-12-caption-regular-second text-collection-1-light-text-third relative w-12 text-right text-[length:var(--12-caption-regular-second-font-size)] font-[number:var(--12-caption-regular-second-font-weight)] leading-[var(--12-caption-regular-second-line-height)] tracking-[var(--12-caption-regular-second-letter-spacing)] [font-style:var(--12-caption-regular-second-font-style)]">
                Drag
              </div>
            </div>
          </div>

     
        </div>

        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
          {tokenData.map((token) => (
            <div
              key={token.id}
              className="relative flex w-full flex-[0_0_auto] flex-col items-start justify-center self-stretch"
            >
              <div className="relative flex h-[72px] w-full items-center justify-between self-stretch">
                <div className="relative flex h-[22px] w-24 items-center gap-2">
                  <button
                    onClick={() => handleTokenSelect(token.id)}
                    className="relative aspect-[1] h-4 w-4 cursor-pointer"
                    aria-label={`Select ${token.name}`}
                  >
                    <Image
                      alt={isTokenSelected(token.id) ? 'Checkbox selected' : 'Checkbox unselect'}
                      src={
                        isTokenSelected(token.id)
                          ? '/images/market/frame-2131328381.svg'
                          : '/images/market/checkbox-unselect-4.svg'
                      }
                      width={16}
                      height={16}
                    />
                  </button>

                  <div
                    className={`font-14-body-regular-second text-collection-1-light-text-primary relative w-fit text-center text-[length:var(--14-body-regular-second-font-size)] font-[number:var(--14-body-regular-second-font-weight)] leading-[var(--14-body-regular-second-line-height)] tracking-[var(--14-body-regular-second-letter-spacing)] [font-style:var(--14-body-regular-second-font-style)] ${token.name === 'DOGE/USDT' ? 'mr-[-11.00px]' : ''}`}
                  >
                    {token.name}
                  </div>
                </div>

                <Image
                  className="relative w-[120px]"
                  alt="Frame"
                  src="/images/market/frame-2131328914-4.svg"
                  width={120}
                  height={20}
                />
              </div>

            </div>
          ))}
        </div>
      </div>

      <div className="relative flex w-[1000px] flex-[0_0_auto] items-center justify-between">
        <div className="relative inline-flex flex-[0_0_auto] items-center gap-3">
          <div className="relative inline-flex flex-[0_0_auto] items-end gap-2">
            <button
              onClick={handleSelectAll}
              className="relative inline-flex flex-[0_0_auto] cursor-pointer items-end gap-2"
              aria-label={isAllSelected ? 'Deselect all' : 'Select all'}
            >
              <Image
                className="relative aspect-[1] h-4 w-4"
                alt="Frame"
                src={
                  isAllSelected
                    ? '/images/market/frame-2131328381.svg'
                    : '/images/market/checkbox-unselect-4.svg'
                }
                width={16}
                height={16}
              />

              <div className="font-14-body-regular-second text-collection-1-light-text-primary relative mt-[-1.00px] w-fit text-center text-[length:var(--14-body-regular-second-font-size)] font-[number:var(--14-body-regular-second-font-weight)] leading-[var(--14-body-regular-second-line-height)] tracking-[var(--14-body-regular-second-letter-spacing)] [font-style:var(--14-body-regular-second-font-style)]">
                Select all
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
            aria-label="Delete selected tokens"
          >
            <Image
              className="relative h-5 w-5"
              alt="Dark action delete"
              src="/images/market/dark-action-delete.svg"
              width={20}
              height={20}
            />

            <div className="font-14-body-regular-second text-collection-1-light-text-primary relative w-fit text-center text-[length:var(--14-body-regular-second-font-size)] font-[number:var(--14-body-regular-second-font-weight)] leading-[var(--14-body-regular-second-line-height)] tracking-[var(--14-body-regular-second-letter-spacing)] [font-style:var(--14-body-regular-second-font-style)]">
              Delete
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="font-14-body-regular-second text-collection-1-dark-status-link relative w-fit cursor-pointer text-center text-[length:var(--14-body-regular-second-font-size)] font-[number:var(--14-body-regular-second-font-weight)] leading-[var(--14-body-regular-second-line-height)] tracking-[var(--14-body-regular-second-letter-spacing)] [font-style:var(--14-body-regular-second-font-style)]"
        >
          Done
        </button>
      </div>
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete all"
        description="Are you sure to delete all the data"
        cancelText="Cancel"
        confirmText="Deltete"
        onConfirm={() => {
          setSelectedTokens([])
        }}
      />
    </div>
  )
}

export default EditToken
