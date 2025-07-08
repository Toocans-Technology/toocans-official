import { SearchOutlined } from '@ant-design/icons'
import { Dropdown, Input, Form, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { getCountrys } from '@/services/login'
import { useLoginContext } from '../../LoginContext'
import styles from '../../assets/style.module.css'

const CountryList = () => {
  const { t } = useT('login')
  const { data: countrys, isLoading } = getCountrys()
  const { seconds, formData, cuntrysVisible, setCuntrysVisible, phoneCheckState, setPhoneCheckState } =
    useLoginContext()

  const [nationalCode, setNationalCode] = useState<string | undefined | null>(undefined)
  const [searchVal, setSearchVal] = useState<string>('')

  useEffect(() => {
    setNationalCode(countrys?.[0]?.nationalCode)
  }, [countrys])

  useEffect(() => {
    formData.setFieldValue('nationalCode', nationalCode)
  }, [nationalCode])

  return (
    <div className={`absolute left-2 top-[10px] z-10 h-5 w-12 ${styles.searchDropdown}`}>
      <Dropdown
        menu={{ items: countrys as any }}
        overlayStyle={{
          left: '-8px',
          top: '40px',
        }}
        open={cuntrysVisible}
        trigger={['click']}
        onOpenChange={() => {
          if (seconds < 60) return
          setCuntrysVisible(!cuntrysVisible)
        }}
        getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
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
                placeholder={t('search')}
              />
              <div className="max-h-[200px] overflow-y-scroll">
                {countrys
                  ?.filter(
                    (item: any) =>
                      item.countryEnName.toLowerCase().includes(searchVal) || item.nationalCode.includes(searchVal)
                  )
                  ?.map((item: any) => {
                    return (
                      <div
                        className="flex h-[48px] w-[360px] cursor-pointer items-center justify-between pl-[10px] pr-[10px]"
                        key={item.countryEnName}
                        onClick={() => {
                          setNationalCode(item.nationalCode)
                          setCuntrysVisible(false)
                        }}
                      >
                        <div className="flex items-center">
                          <img src={item.flagUrls?.[0].url} alt={item.countryEnName} width={20} className="mr-2" />
                          {item.countryEnName}
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
          <Form.Item name="nationalCode" label={null} style={{ display: 'none' }}></Form.Item>
          {isLoading ? <Spin /> : <div>+{nationalCode}</div>}
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
