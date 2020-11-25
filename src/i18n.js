// default로 public/loacles/{{lng}}/translation.json 을 load합니다.
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    initImmediate: false,
    debug: true, // 배포시 false로 변경 필요
    lng: 'ko',
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json', // 로드 할 경로를 변경할 수 있습니다.
    },
  });
export default i18next;
