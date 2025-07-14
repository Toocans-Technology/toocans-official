'use client'

import { Form, Checkbox } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import styles from '../assets/style.module.scss'

const CheckComp = (_props: any, ref: any) => {
  const { t } = useT('login')
  const [shak, setShak] = useState(0)

  useImperativeHandle(ref, () => ({
    openShak1() {
      setShak(1)
      setTimeout(() => setShak(0), 500)
    },
    openShak2() {
      setShak(2)
      setTimeout(() => setShak(0), 500)
    },
  }))

  return (
    <>
      <div className={cn('mt-2', shak == 1 && styles.shake)}>
        <label className="flex items-baseline">
          <Form.Item name="unregisteredTip" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <p className="ml-2 w-[85%] cursor-pointer leading-[18px] text-[#666]">{t('unregisteredTip')}</p>
        </label>
      </div>

      <div className={cn('mt-2', shak == 2 && styles.shake)}>
        <label className="flex items-baseline">
          <Form.Item name="userAgreement" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <p className="ml-2 w-[85%] cursor-pointer leading-[18px] text-[#666]">
            {t('agreedTip')}
            <a type="link" href="#" className="text-[#3c7bf4]">
              {' '}
              {t('name')} {t('userAgreement')}{' '}
            </a>
            {t('and')}
            <a type="link" href="#" className="text-[#3c7bf4]">
              {' '}
              {t('privacyPolicy')}
            </a>
          </p>
        </label>
      </div>
    </>
  )
}

export default forwardRef(CheckComp)
