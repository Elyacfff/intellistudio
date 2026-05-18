import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from '@/locales/zh';
import ug from '@/locales/ug';

const resources = {
  zh: { translation: zh },
  ug: { translation: ug }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;

export const changeLanguage = (lng: 'zh' | 'ug') => {
  i18n.changeLanguage(lng);
  document.documentElement.dir = lng === 'ug' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
};
