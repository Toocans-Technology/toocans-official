'use client'

import { Tooltip } from 'antd'
import { useT } from '@/i18n'
import styles from '../assets/style.module.css'

const NotCode = () => {
  const { t } = useT('login')

  return (
    <div className={styles.tooltipParent + ' ml-auto'}>
      <Tooltip
        placement="bottom"
        color="white"
        getPopupContainer={(current: any) => current.parentElement}
        overlay={
          <>
            <p className="text-base text-black">{t('notCode.tip2')}</p>
            <ul className="list-disc pl-4 text-sm text-[#666]">
              <li>{t('notCode.step1')}</li>
              <li>{t('notCode.step2')}</li>
            </ul>
          </>
        }
      >
        <span className="ml-auto text-xs text-[#a9a9a9]">{t('notCode.tip1')}</span>
      </Tooltip>
    </div>
  )
}

export default NotCode
