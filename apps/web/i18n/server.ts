import { createInstance, i18n, TFunction } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import 'server-only'
import type { Namespace } from './types'
import { getOptions } from './utils'

const initI18next = async (lang: string, ns?: Namespace) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((lang: string, namespace: string) => import(`./locales/${lang}/${namespace}.json`)))
    .init(getOptions(lang, ns))
  return i18nInstance
}

export async function getT(lang: string, ns?: Namespace): Promise<{ t: TFunction; i18n: i18n }> {
  const i18nextInstance = await initI18next(lang, ns)
  return {
    t: i18nextInstance.getFixedT(lang, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
  }
}
