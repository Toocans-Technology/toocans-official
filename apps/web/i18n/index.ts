'use client'

import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useParams } from 'next/navigation'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import type { Namespace } from './types'
import { getOptions } from './utils'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    returnNull: false,
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
  })

export function useT(ns?: Namespace) {
  const params = useParams()
  const lang = String(params?.lang)
  if (i18next.language !== lang) {
    i18next.changeLanguage(lang)
  }

  return useTranslationOrg(ns)
}

export default i18next
