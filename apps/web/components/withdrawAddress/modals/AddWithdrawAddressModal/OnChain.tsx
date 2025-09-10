'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { sortBy } from 'es-toolkit'
import { Loader2Icon } from 'lucide-react'
import { FunctionComponent, useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import {
  Button,
  DialogFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  toast,
} from '@workspace/ui/components'
import { Input } from '@/components/common'
import SelectNetwork, { NetworkItem } from '@/components/deposit/DepositSteps/SelectNetwork'
import SelectToken from '@/components/deposit/DepositSteps/SelectToken'
import { useT } from '@/i18n'
import { Token } from '@/services/basicConfig'
import { useAddWithdrawAddress } from '@/services/wallet'
import { HttpError } from '@/types/http'
import { AllowWithdraw } from '@/types/token'
import { AddressType, addressTypeSchema } from '@/types/withdraw'

interface Props {
  onSuccess?: (addressType: AddressType) => void
}

const OnChain: FunctionComponent<Props> = ({ onSuccess }) => {
  const { t } = useT(['withdrawAddress', 'common'])
  const [networkList, setNetworkList] = useState<NetworkItem[]>([])
  const { mutateAsync: addWithdrawAddress, isPending } = useAddWithdrawAddress()

  const FormSchema = useMemo(
    () =>
      z.object({
        addressType: addressTypeSchema,
        addressName: z.optional(z.string()),
        tokenId: z.string({ message: t('withdrawAddress:tokenError') }),
        address: z.string({ message: t('withdrawAddress:addressError') }),
        tokenNetWork: z.string({ message: t('withdrawAddress:networkError') }),
      }),
    [t]
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      addressName: '',
      addressType: AddressType.OnChain,
    },
  })
  const { handleSubmit, setValue, formState } = form

  const handleSelectToken = useCallback(
    (token: Token) => {
      setValue('tokenId', token.tokenId)
      const tokenList = token.subTokenList.map((item) => ({
        id: item.chainTokenId,
        name: item.chainName,
        icon: item.chainIcon || '/images/symbol-placeholder.png',
        protocolName: item.protocolName,
        disabled: item.tokenSetting?.allowWithdraw === AllowWithdraw.disabled,
      }))
      setNetworkList(sortBy(tokenList, ['name']))
    },
    [setValue]
  )

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        await addWithdrawAddress({
          ...data,
          addressType: AddressType.OnChain,
        })
        toast.success(t('withdrawAddress:addSuccess'))
        onSuccess?.(AddressType.OnChain)
      } catch (error) {
        toast.error((error as HttpError).message)
      }
    },
    [addWithdrawAddress, onSuccess, t]
  )

  return (
    <Form {...form}>
      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="tokenId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="before:text-destructive gap-1 before:inline-block before:content-['*']">
                {t('withdrawAddress:token')}
              </FormLabel>
              <FormControl>
                <SelectToken
                  {...field}
                  showDefaultTokens={false}
                  onSelect={handleSelectToken}
                  popoverClassName="w-[375px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="before:text-destructive gap-1 before:inline-block before:content-['*']">
                {t('withdrawAddress:address')}
              </FormLabel>
              <FormControl>
                <Input {...field} autoCapitalize="off" placeholder={t('withdrawAddress:addressPlaceholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tokenNetWork"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="before:text-destructive gap-1 before:inline-block before:content-['*']">
                {t('withdrawAddress:network')}
              </FormLabel>
              <FormControl>
                <SelectNetwork value={field.value || ''} networks={networkList} onValueChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('withdrawAddress:name')}({t('withdrawAddress:optional')})
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  maxLength={20}
                  autoCapitalize="off"
                  placeholder={t('withdrawAddress:remarkPlaceholder')}
                  endContent={
                    <span className="text-sm">
                      {field.value?.length || 0}/{20}
                    </span>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <DialogFooter className="mt-4">
        <Button rounded="full" disabled={!formState.isValid || isPending} onClick={handleSubmit(onSubmit)}>
          {isPending && <Loader2Icon className="animate-spin" />}
          {t('common:save')}
        </Button>
      </DialogFooter>
    </Form>
  )
}

export default OnChain
