import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enUS as datefnsEN, fi as datefnsFI, uk as datefnsUA, hu as datefnsHU } from 'date-fns/locale';
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
export const availableLanguages: Record<string, { key: string, title: string, flag: string, datefns: Locale }> = {
  en: { key: 'en', title: 'English', flag: 'UN', datefns: datefnsEN },
  fi: { key: 'fi', title: 'Suomi', flag: 'FI', datefns: datefnsFI },
  ua: { key: 'ua', title: 'Українська', flag: 'UA', datefns: datefnsUA },
  hu: { key: 'hu', title: 'Magyar', flag: 'HU', datefns: datefnsHU },
};

// Language persist module
const persistLanguageModule: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => null,
  detect: (callback: (language: (string | readonly string[] | undefined)) => void) => {
    AsyncStorage.getItem('language')
      .then(language => callback(language || undefined))
      .catch(error => {
        console.error(error);
        callback(undefined);
      });
  },
  cacheUserLanguage: (language: string) => {
    AsyncStorage.setItem('language', language).catch(error => console.error(error));
  },
};

// Configure react-i18next
i18n
  .use(initReactI18next)
  .use(persistLanguageModule)
  .init({
    compatibilityJSON: 'v3',
    defaultNS,
    resources,
    ns: [defaultNS],
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
