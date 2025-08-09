import i18nConfig from "@/i18nConfig"
import { createInstance } from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { initReactI18next } from "@/node_modules/react-i18next/initReactI18next"

declare global {
  // eslint-disable-next-line no-var
  var __I18N_CACHE__: Map<string, any> | undefined
}

const _i18nCache: Map<string, any> = globalThis.__I18N_CACHE__ || new Map()
if (!globalThis.__I18N_CACHE__) {
  globalThis.__I18N_CACHE__ = _i18nCache
}

export default async function initTranslations(
  locale: any,
  namespaces: any,
  i18nInstance?: any,
  resources?: any
) {
  const key = `${locale}:${Array.isArray(namespaces) ? namespaces.join(",") : String(namespaces)}`
  if (!resources && _i18nCache.has(key)) {
    return _i18nCache.get(key)
  }

  i18nInstance = i18nInstance || createInstance()

  i18nInstance.use(initReactI18next)

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`/public/locales/${language}/${namespace}.json`)
      )
    )
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    // Only preload the current locale to avoid loading every locale on each request
    preload: resources ? [] : [locale]
  })

  const result = {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t
  }

  if (!resources) {
    _i18nCache.set(key, result)
  }

  return result
}
