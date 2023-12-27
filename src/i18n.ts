import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { ELanguage } from './enums';

export const i18nInstance = i18n
    .createInstance({
        backend: {
            loadPath: `/assets/nls/{{lng}}/{{ns}}.json?${+new Date()}`,
        },
        contextSeparator: '#',
        debug: false,
        defaultNS: 'Common',
        lng: 'az',
        detection: {
            caches: ['cookie'],
            checkWhitelist: true,
            htmlTag: document.documentElement,
            lookupCookie: 'lang',
            cookieMinutes: 525949, // 1 year.
        },
        fallbackLng: ELanguage.AZ,
        // lng: ELanguage.AZ,
        interpolation: {
            escapeValue: false,
        },
        keySeparator: '.',
        load: 'all',
        ns: ['Home', 'Notification', 'Auth', 'Profile', 'Company', 'Common', 'PrivacyPolice'],
        nsSeparator: ':',
        pluralSeparator: '-',
        whitelist: [ELanguage.AZ, ELanguage.EN, ELanguage.RU],
        react: {
            useSuspense: false,
        },
    })
    .use(XHR)
    .use(LanguageDetector)
    .use(initReactI18next);
