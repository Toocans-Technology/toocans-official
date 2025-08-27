'use client'

import { ChangeEvent, FunctionComponent } from 'react'
import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'
import InternalTransfer from './InternalTransfer'
import OnChain from './OnChain'

interface Props {
  token: Token
  address: string
  selectedNetwork?: Token
  handleSelectNetwork: (value: string) => void
  handleAddressChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const SetDestination: FunctionComponent<Props> = ({
  token,
  address,
  selectedNetwork,
  handleSelectNetwork,
  handleAddressChange,
}) => {
  const { t } = useT('withdrawal')

  return (
    <div className="mt-4">
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="-mx-2 h-8 bg-transparent p-0">
          <TabsTrigger value="deposit">{t('withdrawal:onChain')}</TabsTrigger>
          <TabsTrigger value="withdraw">{t('withdrawal:internalTransfer')}</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="deposit" className="mt-2">
          <OnChain
            token={token}
            address={address}
            selectedNetwork={selectedNetwork}
            handleSelectNetwork={handleSelectNetwork}
            handleAddressChange={handleAddressChange}
          />
        </TabsContent>
        <TabsContent value="withdraw" className="mt-2">
          <InternalTransfer />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SetDestination
