import { SearchOutlined } from '@ant-design/icons'
import { Dropdown, Input, Form, Spin } from 'antd'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import i18next from '@/i18n'
import { useT } from '@/i18n'
import { getCountryList } from '@/services/login'
import { useLoginContext } from '../../LoginContext'
import styles from '../../assets/style.module.scss'

const CountryList = () => {
  const { t } = useT('login')

  const { data: countrys, isLoading } = getCountryList()
  const { seconds, formData, cuntrysVisible, setCuntrysVisible } = useLoginContext()

  const [nationalCode, setNationalCode] = useState<string>('1')
  const [searchVal, setSearchVal] = useState<string>('')

  const filterCountrys = useMemo(
    () =>
      countrys?.filter((item: any) => {
        const name = i18next.language.includes('zh') ? item.countryName : item.countryEnName
        return name.toLowerCase().includes(searchVal.toLowerCase()) || item.nationalCode.includes(searchVal)
      }),
    [countrys, searchVal]
  )

  useEffect(() => {
    formData.setFieldValue('nationalCode', nationalCode)
  }, [nationalCode])

  const handleCuntryClick = useCallback((item: any) => {
    setNationalCode(item.nationalCode)
    setCuntrysVisible(false)
  }, [])

  return (
    <div className={`absolute left-2 top-[10px] z-10 h-5 w-12 ${styles.searchDropdown}`}>
      <Dropdown
        menu={{ items: countrys as any }}
        overlayStyle={{
          left: '-8px',
          top: '30px',
        }}
        open={cuntrysVisible}
        trigger={['click']}
        onOpenChange={(value) => {
          if (seconds < 60) return
          const phoneVal = formData.getFieldValue('phone')
          if (value) {
            formData.setFieldValue('phone', phoneVal)
            setSearchVal('')
          }
          setCuntrysVisible(value)
        }}
        getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentElement as HTMLElement}
        popupRender={() => {
          return (
            <div
              className="flex w-96 flex-col items-center rounded-lg bg-white p-[10px]"
              style={{
                boxShadow: '0px 9px 28px 8px rgba(0, 0, 0, 0.10)',
              }}
            >
              <Input
                prefix={<SearchOutlined />}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder={t('login:search')}
              />
              <div className="mt-2 max-h-[200px] overflow-y-scroll">
                {filterCountrys?.map((item: any) => {
                  return (
                    <div
                      className="flex h-[48px] w-[360px] cursor-pointer items-center justify-between rounded-lg pl-[10px] pr-[10px] hover:bg-[#f0f8ff]"
                      key={item.countryEnName}
                      onClick={() => handleCuntryClick(item)}
                    >
                      <div className="flex items-center">
                        <img src={item.flagUrls?.[0].url} width={20} className="mr-2" />
                        {i18next.language.includes('zh') ? item.countryName : item.countryEnName}
                      </div>
                      <div>+{item.nationalCode}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }}
      >
        <div className={cn('flex items-center', seconds < 60 ? 'cursor-not-allowed' : 'cursor-pointer')}>
          <Form.Item label={null} style={{ display: 'none' }}></Form.Item>
          {isLoading ? <Spin /> : <div className="min-w-[35px] text-center">+{nationalCode}</div>}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className={cn(cuntrysVisible && 'rotate-180', 'pointer-events-none ml-auto')}
            fill="none"
          >
            <path
              opacity="0.6"
              d="M9.33857 10.3092C8.94583 10.9282 8.04252 10.9282 7.64978 10.3092L5.66188 7.17585C5.23948 6.51007 5.71781 5.64014 6.50628 5.64014L10.4821 5.64014C11.2705 5.64014 11.7489 6.51007 11.3265 7.17585L9.33857 10.3092Z"
              fill="#666666"
            />
          </svg>
        </div>
      </Dropdown>
    </div>
  )
}

export default CountryList
