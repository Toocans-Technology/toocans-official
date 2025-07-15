import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import { FunctionComponent, useCallback } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@workspace/ui/components'
import { Locale } from '@/i18n/config'
import { Link } from '../common'

const SelectLanguage: FunctionComponent = () => {
  const params = useParams()
  const pathname = usePathname()
  const currentLang = params.lang as Locale

  const getLanguagePath = useCallback(
    (locale: Locale) => {
      const pathSegments = pathname.split('/').slice(2)
      return `/${locale}/${pathSegments.join('/')}`
    },
    [pathname]
  )

  return (
    <Select>
      <SelectTrigger className="bg-transparent p-0 hover:ring-0 focus:ring-0">
        <Image src="/icons/intl.svg" alt="Intl" width={24} height={24} className="cursor-pointer hover:opacity-80" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup defaultValue={currentLang}>
          <Link href={getLanguagePath(Locale.EN_US)}>
            <SelectItem value={Locale.EN_US} className="text-[#0D0D0D]">
              English
            </SelectItem>
          </Link>
          <Link href={getLanguagePath(Locale.ZH_CN)}>
            <SelectItem value={Locale.ZH_CN} className="text-[#0D0D0D]">
              简体中文
            </SelectItem>
          </Link>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectLanguage
