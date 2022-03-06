import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fi from './fi.json';
import ua from './ua.json';

const resources = { en: { translation: en }, fi: { translation: fi }, ua: { translation: ua }  };
export const availableLanguages = Object.keys(resources);
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
