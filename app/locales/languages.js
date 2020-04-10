import i18next from 'i18next';
import { getLanguages } from 'react-native-i18n';
import { GetStoreData } from '../helpers/General';

// Refer this for checking the codes and creating new folders https://developer.chrome.com/webstore/i18n

// Adding/updating a language:
// 1. Update i18next-parser.config.js to ensure the xy language is in "locales"
// 2. run: npm run i18n:extract
// 3. All known/new keys will be added into xy.json
//    - any removed keys will be put into xy_old.json, do not commit this file
// 4. Update translations as needed
// 5. REMOVE all empty translations. e.g. "key": "", this will allow fallback to the default: English
// 6. import xyIndex from `./xy.json` and add the language to the block at the bottom

import enIndex from './en.json';
import htIndex from './ht.json';

// This will fetch the user's language
// Set up as a function so first onboarding screen can also update
// ...from async language override setting
export function findUserLang(callback) {
  let userLang = undefined;
  getLanguages().then(languages => {
    userLang = languages[0].split('-')[0]; // ['en-US' will become 'en']

    // If the user specified a language override, use it instead
    GetStoreData('LANG_OVERRIDE').then(res => {
      if (typeof res === 'string') {
        console.log('Found user language override:');
        console.log(res);
        userLang = res;
        i18next.changeLanguage(res);
      } else {
        i18next.changeLanguage(userLang);
      }

      // Run state updating callback to trigger rerender
      typeof callback === 'function' ? callback(userLang) : null;

      return userLang;
    });
  });
}

findUserLang();

i18next.init({
  interpolation: {
    // React already does escaping
    escapeValue: false,
  },
  lng: 'en', // 'en' | 'es',
  fallbackLng: 'en', // If language detector fails
  resources: {
    en: {
      translation: enIndex,
      label: 'English',
    },
    de: {
      translation: deIndex,
      label: 'Deutsch',
    },
    hi: {
      translation: hiIndex,
      label: 'हिन्दी',
    },
    fr: {
      translation: frIndex,
      label: 'Français',
    },
    it: {
      translation: itIndex,
      label: 'Italiano',
    },
    pt: {
      translation: ptIndex,
      label: 'Português',
    },
    mr: {
      translation: mrIndex,
      label: 'मराठी',
    },
    nl: {
      translation: nlIndex,
      label: 'Nederlands',
    },
    ht: {
      translation: htIndex,
      label: 'Kreyòl ayisyen',
    },
    pt_BR: {
      translation: pt_BRIndex,
      label: 'Portugues do Brasil',
    },
    kn: {
      translation: knIndex,
      label: 'ಕನ್ನಡ',
    },
    es: {
      translation: esIndex,
      label: 'Español',
    },
    ur: {
      translation: urIndex,
      label: 'اردو',
    },
    ca: {
      translation: caIndex,
      label: 'Català',
    },
    gj: {
      translation: gjIndex,
      label: 'ગુજરાતી',
    },
    cs: {
      translation: csIndex,
      label: 'Ceština',
    },
  },
});

export default i18next;
