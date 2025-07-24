import { Select } from 'antd'
import { sortBy } from 'es-toolkit'
import Image from 'next/image'
import { FunctionComponent, useMemo } from 'react'
import { useAllToken } from '@/hooks'
import { useT } from '@/i18n'

interface Props {
  onSelect?: (value: string) => void
}

const SelectToken: FunctionComponent<Props> = ({ onSelect }) => {
  const { t } = useT('common')
  const { tokens } = useAllToken()
  const allToken = { id: 'all', icon: '', name: t('common:all') }

  const tokenList = useMemo(() => {
    if (!tokens) {
      return [allToken]
    }

    const list = tokens?.map((token) => ({
      id: token.tokenId,
      icon: token.icon,
      name: token.tokenName,
    }))
    return [allToken, ...sortBy(list, ['name'])]
  }, [tokens])

  const options = useMemo(() => {
    return tokenList.map((token) => ({
      value: token.id,
      name: token.name,
      label: (
        <div className="flex items-center gap-2">
          <Image
            src={token.icon || '/images/symbol-placeholder.png'}
            width={16}
            height={16}
            alt={token.name}
            className="overflow-hidden rounded-full"
          />
          <span>{token.name}</span>
        </div>
      ),
    }))
  }, [tokenList])

  return (
    <Select
      className="w-40"
      showSearch
      optionFilterProp="name"
      placeholder={t('common:selectToken')}
      defaultValue={allToken.id}
      onChange={onSelect}
      options={options}
    />
  )
}

export default SelectToken
