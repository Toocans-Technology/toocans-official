import OverviewBalancePanel from '@/components/overview/OverviewBalancePanel'
import TokenTable from '@/components/overview/TokenTable'

export default function Page({ params }: { params: { lang: string } }) {
  const { lang } = params
  return (
    <div className="min-h-screen bg-[#f6f6f6] flex justify-center">
      <div className="w-full max-w-[942px] px-8 pt-[60px]">
        <h1 className="mb-[46px] text-black font-inter text-[32px] font-medium leading-[30px]">Asset Overview</h1>
        <OverviewBalancePanel />
        <TokenTable lang={lang} />
      </div>
    </div>
  )
}
