import Image from 'next/image'
import { FunctionComponent } from 'react'
import { getT } from '@/i18n/server'

const SafeAndTrust: FunctionComponent<{ lang: string }> = async ({ lang }) => {
  const { t } = await getT(lang, 'home')

  return (
    <div className="w-full bg-black">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-8 py-2 pt-20 text-white">
        <h1 className="text-[40px]">{t('home:safeAndTrust.title')}</h1>
        <Image src="/images/home/safe.png" alt="Safe" width={386} height={397} className="mt-5" />
        <div className="flex gap-10">
          <div className="flex flex-1 flex-col items-center gap-6 rounded-xl px-3 py-2 transition-colors hover:bg-[#1f1f1f]">
            <Image src="/images/home/secure-icon.svg" alt="Lock" width={78} height={78} />
            <h2 className="text-center text-[24px]">{t('home:safeAndTrust.section1.title')}</h2>
            <p className="text-sm text-[#999]">{t('home:safeAndTrust.section1.description')}</p>
          </div>
          <div className="flex flex-1 flex-col items-center gap-6 rounded-xl px-3 py-2 transition-colors hover:bg-[#1f1f1f]">
            <Image src="/images/home/reliable-icon.svg" alt="Lock" width={78} height={78} />
            <h2 className="text-center text-[24px]">{t('home:safeAndTrust.section2.title')}</h2>
            <p className="text-sm text-[#999]">{t('home:safeAndTrust.section2.description')}</p>
          </div>
          <div className="flex flex-1 flex-col items-center gap-6 rounded-xl px-3 py-2 transition-colors hover:bg-[#1f1f1f]">
            <Image src="/images/home/multi-device-icon.svg" alt="Lock" width={78} height={78} />
            <h2 className="text-center text-[24px]">{t('home:safeAndTrust.section3.title')}</h2>
            <p className="text-sm text-[#999]">{t('home:safeAndTrust.section3.description')}</p>
          </div>
        </div>
        <hr className="my-12 w-full border-t border-[#2b2b2b]" />
      </div>
    </div>
  )
}

export default SafeAndTrust
