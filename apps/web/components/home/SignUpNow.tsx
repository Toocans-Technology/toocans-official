import { FunctionComponent } from 'react'
import { Button } from '@workspace/ui/components'
import { getT } from '@/i18n/server'
import Link from '../Link'

const SignUpNow: FunctionComponent<{ lang: string }> = async ({ lang }) => {
  const { t } = await getT(lang, 'home')

  return (
    <div className="w-full bg-black">
      <div className="mx-auto flex max-w-[762px] flex-col items-center px-6 pb-10 pt-14 text-white lg:px-8">
        <h1 className="text-center text-[32px] text-[#f6f6f6]">{t('home:signUpNowDescription')}</h1>
        <Link href="/signup" className="mt-8">
          <Button className="text-[#222]" rounded="full">
            {t('home:signUpNow')}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default SignUpNow
