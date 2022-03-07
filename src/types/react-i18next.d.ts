import { resources, defaultNS } from '../utils';

// Type support for react-i18next
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources['en'];
  }
}
