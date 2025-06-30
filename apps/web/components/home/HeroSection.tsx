import Image from 'next/image'
import { FunctionComponent } from 'react'
import { Button, Input } from '@workspace/ui/components'
import { getT } from '@/i18n/server'
import Link from '../Link'

const HeroSection: FunctionComponent<{ lang: string }> = async ({ lang }) => {
  const { t } = await getT(lang, 'home')

  return (
    <div className="w-full bg-black">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-16 text-white">
        <div className="inline-flex flex-col gap-10">
          <p className="max-w-[560px] text-[40px]">{t('home:hero.description')}</p>
          <div className="flex max-w-80 items-center rounded-full border border-[#666] p-1">
            <Input
              placeholder={t('home:hero.inputPlaceholder')}
              className="focus-visible:ring--0 border-none focus-visible:outline-none"
            />
            <Button rounded="full" className="text-[#222]">
              {t('home:startNow')}
            </Button>
          </div>
          <div className="flex flex-col">
            <p className="text-[#999]">{t('home:continueWith')}</p>
            <div className="mt-2 flex gap-3">
              <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#4E4E4E]">
                <Image src="/images/home/google.svg" alt="Google" width={16} height={16} />
              </Link>
              <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#4E4E4E]">
                <Image src="/images/home/app-store.svg" alt="Apple" width={16} height={16} />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Image src="/images/home/home-bitcoin.png" alt="Bitcoin" width={290} height={314} />
        </div>
      </div>
    </div>
  )
}

export default HeroSection
