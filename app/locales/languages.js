import i18next from 'i18next';
import { getLanguages } from 'react-native-i18n';

import enlabels from './en';
import enlabels from './de';

// This will fetch the user's language
let userLang = undefined;
getLanguages().then(languages => {
  userLang = languages[0].split('-')[0];
  i18next.changeLanguage(userLang); // ['en-US', 'en']
});

i18next.init({
  interpolation: {
    // React already does escaping
    escapeValue: false
  },
  lng: userLang, // 'en' | 'es',
  fallbackLng: 'en', // If language detector fails 
  resources: {
    en: {
      translation: {
        label: enlabels
      }
    },
    de: {
      translation: {
        label: deLabels
      }
    }
  }
});

export default i18next;
