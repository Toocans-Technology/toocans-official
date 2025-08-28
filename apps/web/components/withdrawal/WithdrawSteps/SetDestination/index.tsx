'use client'

import { ChangeEvent, FunctionComponent } from 'react'
import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'
import { User } from '@/services/wallet/searchUser'
import { ChargeType, InternalTransferType } from '@/types/withdraw'
import InternalTransfer from './InternalTransfer'
import OnChain from './OnChain'

interface Props {
  token: Token
  address: string
  selectedNetwork?: Token
  chargeType: ChargeType
  onTabChange?: (value: string) => void
  onSelectNetwork: (value: string) => void
  onTransferTabChange?: (type: InternalTransferType) => void
  onAddressChange: (event: ChangeEvent<HTMLInputElement>) => void
  onInternalTransferChange: (data?: User) => void
}

const SetDestination: FunctionComponent<Props> = ({
  token,
  address,
  selectedNetwork,
  chargeType,
  onTabChange,
  onSelectNetwork,
  onAddressChange,
  onTransferTabChange,
  onInternalTransferChange,
}) => {
  const { t } = useT('withdrawal')

  return (
    <div className="mt-4">
      <Tabs value={chargeType.toString()} className="w-full" onValueChange={onTabChange}>
        <TabsList className="-mx-2 h-8 bg-transparent p-0">
          <TabsTrigger value={ChargeType.OnChain.toString()}>{t('withdrawal:onChain')}</TabsTrigger>
          <TabsTrigger value={ChargeType.Internal.toString()}>{t('withdrawal:internalTransfer')}</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value={ChargeType.OnChain.toString()} className="mt-2">
          <OnChain
            token={token}
            address={address}
            selectedNetwork={selectedNetwork}
            onSelectNetwork={onSelectNetwork}
            onAddressChange={onAddressChange}
          />
        </TabsContent>
        <TabsContent value={ChargeType.Internal.toString()} className="mt-2">
          <InternalTransfer onChange={onInternalTransferChange} onTransferTabChange={onTransferTabChange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SetDestination
