'use client'

import { FunctionComponent, useCallback, useState } from 'react'
import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { AddressType, ChargeType } from '@/types/withdraw'
import InternalTransferAddresses from './InternalTransferAddresses'
import OnChainAddresses from './OnChainAddresses'

const ManageAddresses: FunctionComponent = () => {
  const { t } = useT(['withdrawal', 'withdrawAddress'])
  const [chargeType, setChargeType] = useState<string>(ChargeType.OnChain.toString())

  const handleSuccess = useCallback((addressType: AddressType) => {
    if (addressType === AddressType.OnChain) {
      setChargeType(ChargeType.OnChain.toString())
    } else {
      setChargeType(ChargeType.Internal.toString())
    }
  }, [])

  return (
    <div className="mt-3 flex w-full gap-10 rounded-[10px] bg-white p-6">
      <Tabs className="w-full" value={chargeType.toString()} onValueChange={setChargeType}>
        <TabsList className="-mx-2 h-8 bg-transparent p-0">
          <TabsTrigger value={ChargeType.OnChain.toString()}>{t('withdrawal:onChain')}</TabsTrigger>
          <TabsTrigger value={ChargeType.Internal.toString()}>{t('withdrawal:internalTransfer')}</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value={ChargeType.OnChain.toString()} className="mt-2">
          <OnChainAddresses chargeType={chargeType} onSuccess={handleSuccess} />
        </TabsContent>
        <TabsContent value={ChargeType.Internal.toString()} className="mt-2">
          <InternalTransferAddresses chargeType={chargeType} onSuccess={handleSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ManageAddresses
