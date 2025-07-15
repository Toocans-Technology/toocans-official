import { FunctionComponent } from 'react'
import { getT } from '@/i18n/server'
import Link from '../common/Link'

const Footer: FunctionComponent<{ lang: string }> = async ({ lang }) => {
  const { t } = await getT(lang, 'common')

  return (
    <div className="w-full bg-black">
      <div className="mx-auto flex items-center justify-center py-4 text-[#666]">
        <span>@{t('common:footer.toocans')}</span>
        <div className="ml-10 flex items-center gap-3">
          <Link href="/agreement">{t('common:footer.userAgreement')}</Link>
          <span>|</span>
          <Link href="/privacy">{t('common:footer.privacyPolicy')}</Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
