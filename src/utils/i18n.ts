import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEN from '../../locales/en/translation.json'

i18n.use(initReactI18next).init({
    // TODO: Make debug value dynamic based on environment, if dev -> true, prod -> false
    debug: false,
    // defaultNS: 'common',
    fallbackLng: 'en',
    // fallbackNS: 'common',
    interpolation: {
        escapeValue: false,
        format: (value, format) => {
            switch (format) {
                case 'uppercase':
                    return value?.toUpperCase()
                case 'lowercase':
                    return value?.toLowerCase()
                default:
                    return value
            }
        },
    },
    lng: 'en',
    // ns: ['common'],
    resources: {
        en: { translation: translationEN },
    },
})

export default i18n
