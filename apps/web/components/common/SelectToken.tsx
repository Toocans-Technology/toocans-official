import { Select } from 'antd'
import { sortBy } from 'es-toolkit'
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

  return (
    <Select
      className="w-40"
      showSearch
      optionFilterProp="label"
      placeholder={t('common:selectToken')}
      defaultValue={allToken.id}
      onChange={onSelect}
      options={tokenList?.map((token) => ({
        value: token.id,
        label: token.name,
        icon: token.icon,
      }))}
    />
  )
}

export default SelectToken
