import Image from 'next/image'
import { FunctionComponent } from 'react'
import { getT } from '@/i18n/server'

const AssetsAndMarkets: FunctionComponent<{ lang: string }> = async ({ lang }) => {
  const { t } = await getT(lang, 'home')

  return (
    <div className="w-full bg-black">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-8 pb-6 text-white">
        <div className="flex justify-between gap-10">
          <div className="hover:border-primary flex flex-1 gap-6 rounded-[12px] border border-transparent bg-[#0f0f0f] px-7 pt-8">
            <div className="flex-1">
              <h2 className="text-[32px]">{t('home:assetsAndMarkets.section1.title')}</h2>
              <p className="text-sm">{t('home:assetsAndMarkets.section1.description')}</p>
            </div>
            <Image src="/images/home/home-assets.png" alt="Assets" width={164} height={218} />
          </div>
          <div className="hover:border-primary flex flex-1 gap-6 rounded-[12px] border border-transparent bg-[#0f0f0f] px-7 pt-8">
            <div className="flex-1">
              <h2 className="text-[32px]">{t('home:assetsAndMarkets.section2.title')}</h2>
              <p className="text-sm">{t('home:assetsAndMarkets.section2.description')}</p>
            </div>
            <Image src="/images/home/home-markets.png" alt="Assets" width={164} height={218} />
          </div>
        </div>
        <div className="hover:border-primary pb-18 relative mt-11 flex w-full overflow-hidden rounded-[12px] border border-transparent bg-[#0f0f0f] p-10">
          <h1 className="max-w-80 text-[40px]">{t('home:chainTransfer')}</h1>
          <Image
            src="/images/home/on-chain.png"
            alt="Chain"
            width={229}
            height={347}
            className="absolute -bottom-2 right-64 -rotate-6 transform"
          />
          <Image
            src="/images/home/withdraw.png"
            alt="Chain"
            width={229}
            height={347}
            className="absolute -bottom-2 right-12 rotate-6 transform"
          />
        </div>
      </div>
    </div>
  )
}

export default AssetsAndMarkets
