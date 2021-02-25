import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';
import en from './locales/en.json';

const resources = {
  ko: { translation: ko },
  en: { translation: en },
};

const initI18n = () => {
  return i18n.use(initReactI18next).init({
    resources,
    lng: 'ko',
    keySeparator: false,
    interpolation: { escapeValue: false },
  });
};

export { initI18n };
