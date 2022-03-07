import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fi from './fi.json';
import ua from './ua.json';
import hu from './hu.json';

// Default namespace
export const defaultNS = 'translation';

// Resources
export const resources = {
  en: { translation: en },
  fi: { translation: fi },
  ua: { translation: ua },
  hu: { translation: hu },
} as const;

// Available languages
export const availableLanguages = Object.keys(resources);

// Configure react-i18next
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    defaultNS,
    resources,
    ns: [defaultNS],
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
