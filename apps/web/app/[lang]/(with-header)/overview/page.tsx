import OverviewBalancePanel from '@/components/overview/OverviewBalancePanel'
import TokenTable from '@/components/overview/TokenTable'

export default function Page() {
  return (
    <div className="flex min-h-screen justify-center bg-[#f6f6f6]">
      <div className="w-full max-w-[942px] px-8 pt-[60px]">
        <h1 className="font-inter mb-[46px] text-[32px] font-medium leading-[30px] text-black">Asset Overview</h1>
        <OverviewBalancePanel />
        <TokenTable />
      </div>
    </div>
  )
}
