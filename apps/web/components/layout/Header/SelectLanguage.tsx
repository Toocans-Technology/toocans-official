import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { FunctionComponent, useCallback } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@workspace/ui/components'
import { Locale } from '@/i18n/config'

const SelectLanguage: FunctionComponent = () => {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const currentLang = params.lang as Locale

  const changeLanguagePath = useCallback(
    (locale: Locale) => {
      const pathSegments = pathname.split('/').slice(2)
      const newPath = `/${locale}/${pathSegments.join('/')}`
      router.replace(newPath)
    },
    [pathname]
  )

  return (
    <Select defaultValue={currentLang} onValueChange={(value: string) => changeLanguagePath(value as Locale)}>
      <SelectTrigger className="border-none bg-transparent p-0 hover:ring-0 focus:ring-0">
        <Image src="/icons/intl.svg" alt="Intl" width={24} height={24} className="cursor-pointer hover:opacity-80" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={Locale.EN_US}>English</SelectItem>
          <SelectItem value={Locale.ZH_CN}>简体中文</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectLanguage
