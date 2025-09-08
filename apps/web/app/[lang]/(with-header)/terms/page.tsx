import { getT } from '@/i18n/server'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'privacy')

  return {
    title: t('privacy:termsOfUse'),
  }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'privacy')

  return (
    <div className="flex min-h-svh flex-col bg-[#f6f6f6]">
      <div className="container mx-auto flex max-w-[1000px] flex-col gap-4 px-6 py-14">
        <h1 className="text-[32px] font-medium">{t('privacy:termsOfUse')}</h1>
        <p>
          These Terms constitute a legally binding agreement between you (<b>“you”</b> or <b>“your”</b>) and Toocans (
          <b>“Toocans”</b>, <b>“we”</b>, <b>“our”</b> or <b>“us”</b>). The Terms govern your use of the Toocans Services
          made available to you on or through the Platform or otherwise. Toocans Services may be provided by Toocans or,
          if specified in these Terms, any Product Terms or any additional terms, by any Toocans Affiliate.
        </p>
        <p>
          By registering for a Toocans Account, accessing the Platform and/or using the Toocans Services, you agree that
          you have read, understood and accepted these Terms, together with any additional documents or terms referred
          to in these Terms. You acknowledge and agree that you will be bound by and will comply with these Terms, as
          updated and amended from time to time.
        </p>
        <p>
          If you do not understand and accept these Terms in their entirety, you should not register for a Toocans
          Account or access or use the Platform or any Toocans Service.
        </p>
        <h3 className="font-bold">RISK WARNING</h3>
        <p>
          As with any asset, the value of Digital Assets can fluctuate significantly and there is a material risk of
          economic loss when buying, selling, holding or investing in Digital Assets. You should therefore consider
          whether trading or holding Digital Assets is suitable for you in light of your financial circumstances.
        </p>
        <p>
          We are not your broker, intermediary, agent or advisor and we have no fiduciary relationship or obligation to
          you in connection with any Transactions or other activities you undertake when using the Toocans Services. We
          do not provide investment or consulting advice of any kind and no communication or information that we provide
          to you is intended as, or should be construed as, advice of any kind.
        </p>
        <p>
          It is your responsibility to determine whether any investment, investment strategy or related transaction is
          appropriate for you according to your personal investment objectives, financial circumstances and risk
          tolerance and you are responsible for any associated loss or liability. We do not recommend that any Digital
          Asset should be bought, earned, sold or held by you. Before making the decision to buy, sell or hold any
          Digital Asset, you should conduct your own due diligence and consult your financial advisor. We are not
          responsible for the decisions you make to buy, earn, sell or hold Digital Assets based on the information
          provided by us, including any losses you incur arising from those decisions.
        </p>
        <h3 className="font-bold">INFORMATION ABOUT OUR AGREEMENT WITH YOU</h3>
        <p className="font-semibold">1. Introduction</p>
        <ul className="flex flex-col gap-3">
          <li>
            1.1. About us. The Toocans group is an ecosystem centred around an online exchange for Digital Assets
            trading. The Toocans group provides users with a trading platform to buy and sell Digital Assets, an
            integrated custody solution allowing users to store their Digital Assets and other Digital Asset-related
            services.
          </li>
          <li>
            <p>
              1.2. These Terms. By registering to open a Toocans Account you are entering into a legally binding
              agreement with us. These Terms will govern your use of the Toocans Services and tell you who we are, how
              we will provide the Toocans Services to you, how these Terms may be changed or terminated, what to do if
              there is a problem, along with other important information.
            </p>
            <p>
              You must read these Terms, together with the documents referenced in the Terms, carefully and let us know
              if you do not understand anything.
            </p>
            <p>
              Where any Local Terms apply to your use of the Toocans Services, such Local Terms shall govern your use of
              the Toocans Services.
            </p>
          </li>
          <li>
            <p>
              1.3. Additional documents. These Terms refer to a number of additional documents which also apply to your
              use of the Toocans Services. This includes:
            </p>
            <p>
              Our Privacy Notice, which sets out the terms on which we process any personal data we collect about you,
              or that you provide to us. By using the Toocans Services, you understand and agree to such processing and
              you promise that all data provided by you is accurate and up to date.
            </p>
          </li>
        </ul>
        <p className="font-semibold">Eligibility</p>
        <p>
          2.1. Eligibility criteria. To be eligible to register for a Toocans Account and use the Toocans Services, you
          must:
          <ul className="mt-3 flex flex-col gap-3">
            <li>
              a. be an individual, corporation, legal person, entity or other organisation with the full power,
              authority and capacity to (1) access and use the Toocans Services; and (2) enter into and comply with your
              obligations under these Terms;
            </li>
            <li>b. if you are an individual, be at least 18 years old;</li>
            <li>
              c. if you act as an employee or agent of a legal entity, and enter into these Terms on their behalf, you
              must be duly authorised to act on behalf of and bind such legal entity for the purposes of entering into
              these Terms;
            </li>
            <li>d. not have been previously suspended or removed from using Toocans Services;</li>
            <li>e. not be a Restricted Person;</li>
            <li>f. not currently have an existing Toocans Account; and</li>
            <li>
              g. not be located, incorporated, otherwise established in, or resident of, or have business operations in.
            </li>
          </ul>
        </p>
      </div>
    </div>
  )
}
