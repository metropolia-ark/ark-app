import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../translations/en.json';
import fi from '../translations/fi.json';
import ua from '../translations/ua.json';
import hu from '../translations/hu.json';

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
export const availableLanguages: Record<string, { key: string, title: string, flag: string }> = {
  en: { key: 'en', title: 'English', flag: 'UN' },
  fi: { key: 'fi', title: 'Suomi', flag: 'FI' },
  ua: { key: 'ua', title: 'Українська', flag: 'UA' },
  hu: { key: 'hu', title: 'Magyar', flag: 'HU' },
};

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
