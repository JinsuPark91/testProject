import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const i18n = i18next.createInstance();
i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init(
    {
      debug: true,
      fallbackLng: ['ko', 'en'],
      ns: ['translation'],
      defaultNS: 'translation',
      keySeparator: false,
      interpolation: { escapeValue: false },
      backend: {
        loadPath: `/locales/{{lng}}/{{ns}}.json`,
      },
      detection: {
        order: ['sessionStorage', 'navigator'],
        lookupSessionStorage: 'language',
      },
      react: {
        useSuspense: false,
      },
    },
    (err, t) => {
      if (err) console.log('i18next init error : ', err);
      sessionStorage.setItem('language', i18n.language);
    },
  );

export default i18n;
