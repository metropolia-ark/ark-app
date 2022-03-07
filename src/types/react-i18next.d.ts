import { resources, defaultNS } from '../translations/i18n';

// Type support for react-i18next
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources['en'];
  }
}
