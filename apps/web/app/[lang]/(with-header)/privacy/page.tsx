import { getT } from '@/i18n/server'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'privacy')

  return {
    title: t('privacy:title'),
    description: t('privacy:description'),
  }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  const { t } = await getT(lang, 'privacy')

  return (
    <div className="flex min-h-svh flex-col bg-[#f6f6f6]">
      <div className="container mx-auto flex max-w-[1000px] flex-col gap-4 px-6 py-14">
        <h1 className="text-[32px] font-medium">{t('privacy:title')}</h1>
        <p>
          Toocans (<b>“Toocans”</b>, <b>“we”</b>, or <b>“us”</b>) is committed to protecting the privacy of our
          customers, and we take our data protection responsibilities with the utmost seriousness.
        </p>
        <p>
          This Privacy Notice applies to all Personal data processing activities carried out by us, across platforms,
          websites, and departments of Toocans.
        </p>
        <p>
          To the extent that you are a customer or user of our services, this Privacy Notice applies together with any
          terms of business and other contractual documents, including but not limited to any agreements we may have
          with you.
        </p>
        <p>
          To the extent that you are not a relevant stakeholder, customer, or user of our services, but are using our
          website, this Privacy Notice also applies to you together with our Cookie Notice.
        </p>
        <p>
          Toocans companies may share your personal data with each other and if they do so, they will use it
          consistently with this Privacy Notice.
        </p>
        <h3 className="font-medium">1. What Personal Data does Toocans collect and process?</h3>
        <p>
          Personal data is data that identifies an individual or relates to an identifiable individual. This includes
          information you provide to us, information which is collected about you automatically, and information we
          obtain from third parties.
        </p>
        <p>
          Information you provide to us. To open an account and access our services, we'll ask you to provide us with
          some information about yourself. This information is either required by law (e.g., to verify your identity and
          comply with “Know Your Customer” or “Travel Rule” obligations), necessary to provide the requested services
          (e.g., you will need to provide your email address in order to open your account), or is relevant for certain
          specified purposes, described in greater detail below. In some cases, if we add services and features you may
          be asked to provide us with additional information.
        </p>
        <p>Failure in providing the data required implies that Toocans will not be able to offer you our services.</p>
        <p>
          Information we collect from you automatically. To the extent permitted under the applicable law, we may
          collect certain types of information automatically, for example whenever you interact with us or use the
          services. This information helps us address customer support issues, improve the performance of our sites and
          services, maintain and or improve your user experience, and protect your account from fraud by detecting
          unauthorized access.
        </p>
        <h3 className="font-medium">
          2. Why does Toocans process my personal data? Which legal bases are we relying on for our collection and
          processing of your personal data?
        </h3>
        <p>
          Our primary purpose in collecting personal data is to provide our services in a secure, efficient, and smooth
          way. We generally use your personal data to deliver, provide, operate, our services, and for content and
          advertising, and for loss prevention and anti-fraud purposes. Below you’ll find an explanation on how we use
          Automated individual decision-making, including profiling. Toocans does not rely solely on automated tools to
          help determine whether a transaction or a customer account presents a fraud or legal risk.
        </p>
      </div>
    </div>
  )
}
