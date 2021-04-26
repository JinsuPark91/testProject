import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const FALLBACK_LANGUAGE = 'en';

const i18n = i18next.createInstance();
i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init(
    {
      debug: false,
      fallbackLng: FALLBACK_LANGUAGE,
      load: 'languageOnly',
      ns: ['translation'],
      defaultNS: 'translation',
      keySeparator: false,
      interpolation: { escapeValue: false },
      backend: {
        loadPath: `/locales/{{lng}}/{{ns}}.json`,
      },
      detection: {
        order: ['navigator'],
      },
      react: {
        useSuspense: false,
      },
    },
    (err, t) => {
      if (err) console.log('i18next init error : ', err);
    },
  );

export { i18n, FALLBACK_LANGUAGE as fallbackLanguage };
