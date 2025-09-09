'use client'

import dayjs from 'dayjs'
import { Loader2Icon } from 'lucide-react'
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components'
import { Empty } from '@/components/common'
import { useT } from '@/i18n'
import { useWithdrawAddressList, WithdrawAddressParams } from '@/services/wallet'
import { AddressType, ChargeType } from '@/types/withdraw'
import {
  AddWithdrawAddressModal,
  BatchDeleteWithdrawAddressModal,
  DeleteWithdrawAddressModal,
  UpdateWithdrawAddressModal,
} from '../modals'
import Filter, { FilterParams } from './Filter'

const addressTypes = [AddressType.UID, AddressType.Email, AddressType.Phone].join(',')

interface Props {
  chargeType?: string
  onSuccess?: (addressType: AddressType) => void
}

const InternalTransferAddresses: FunctionComponent<Props> = ({ chargeType, onSuccess }) => {
  const { t } = useT(['withdrawAddress', 'common'])
  const [params, setParams] = useState<WithdrawAddressParams>({
    tokenId: '',
    addressTypes,
  })
  const { data, refetch, isLoading } = useWithdrawAddressList(params, false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filterParams, setFilterParams] = useState<FilterParams>({
    tokenId: '',
    keyword: '',
  })

  useEffect(() => {
    if (chargeType === ChargeType.Internal.toString()) {
      refetch()
    }
  }, [chargeType, refetch, params?.tokenId])

  const addressesList = useMemo(() => {
    return data?.filter((item) =>
      [item.address, item.addressName].some((item) =>
        item?.toLocaleLowerCase().includes(filterParams?.keyword?.toLocaleLowerCase() || '')
      )
    )
  }, [data, filterParams])

  const handleChange = useCallback((filterParams: FilterParams) => {
    setFilterParams(filterParams)
    setParams({ tokenId: filterParams.tokenId, addressTypes })
    setSelectedIds([])
  }, [])

  const getRecipientType = useCallback(
    (addressType: AddressType) => {
      if (addressType === AddressType.Email) {
        return t('withdrawAddress:email')
      } else if (addressType === AddressType.Phone) {
        return t('withdrawAddress:phone')
      } else {
        return t('withdrawAddress:uid')
      }
    },
    [t]
  )

  const handleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      return [...prev, id]
    })
  }, [])

  const checkedAll = useMemo(() => {
    return data?.length ? selectedIds.length === data?.length : false
  }, [data, selectedIds])

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(checked ? data?.map((item) => item.id) || [] : [])
    },
    [data]
  )

  const handleSuccess = useCallback(
    (addressType: AddressType) => {
      onSuccess?.(addressType)
      refetch()
    },
    [onSuccess, refetch]
  )

  return (
    <>
      <div className="flex justify-between">
        <Filter showSelectToken={false} onChange={handleChange} />
        <AddWithdrawAddressModal chargeType={chargeType} onSuccess={handleSuccess} />
      </div>
      <Table className="mt-4">
        <TableHeader className="bg-[#f8f8f8]">
          <TableRow className="border-none">
            <TableHead className="text-[#666]">
              <Checkbox checked={checkedAll} onCheckedChange={handleSelectAll} />
            </TableHead>
            <TableHead className="text-[#666]">{t('withdrawAddress:recipientType')}</TableHead>
            <TableHead className="text-[#666]">{t('withdrawAddress:recipient')}</TableHead>
            <TableHead className="text-[#666]">{t('withdrawAddress:recipientName')}</TableHead>
            <TableHead className="text-[#666]">{t('withdrawAddress:updated')}</TableHead>
            <TableHead className="text-[#666]">{t('withdrawAddress:action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addressesList?.length ? (
            addressesList?.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="py-3 font-medium">
                  <Checkbox
                    id={record.id}
                    checked={selectedIds.includes(record.id)}
                    onCheckedChange={() => handleSelect(record.id)}
                  />
                </TableCell>
                <TableCell className="py-3">{getRecipientType(record.addressType as AddressType)}</TableCell>
                <TableCell className="py-3">{record.address ?? '-'}</TableCell>
                <TableCell className="py-3">{record.addressName ?? '-'}</TableCell>
                <TableCell className="py-3">{dayjs(Number(record.updated)).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-1">
                    <UpdateWithdrawAddressModal data={record} onSuccess={refetch} />
                    <DeleteWithdrawAddressModal data={record} onSuccess={refetch} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="py-8 text-center">
                {isLoading ? (
                  <div className="flex w-full justify-center">
                    <Loader2Icon className="animate-spin" color="#86FC70" />
                  </div>
                ) : (
                  <Empty />
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {selectedIds.length !== 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-3">
                <div className="flex items-center justify-between">
                  <span>
                    ({selectedIds.length}/{data?.length}) {t('withdrawAddress:selected')}
                  </span>
                  <BatchDeleteWithdrawAddressModal ids={selectedIds} onSuccess={refetch} />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableFooter>
      </Table>
    </>
  )
}

export default InternalTransferAddresses
