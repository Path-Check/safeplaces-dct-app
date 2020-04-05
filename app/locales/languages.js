import i18next from 'i18next';
import { getLanguages } from 'react-native-i18n';
import { GetStoreData } from '../helpers/General';

// Refer this for checking the codes and creating new folders https://developer.chrome.com/webstore/i18n
// Step 1 - Create index.js files for each language we want to have, in this file you can import all the json files (Step 4) and export them
// Step 2 - Import them with a unique title
// Step 3 - Add these titles under the resources object in the i18next.init function
// Step 4 - Create separate json files for various sections under the language folder ex. en/intro1.json
// Step 5 - Add the labels to be used in respective json files. The labels are the key and the content is the value in different language, so make sure for each file the key remains the same
// Step 6 - In React Native code import the main languages file and call the translate function - languages.t('label.labelname')

import enlabels from './en';
import delabels from './de';
import hilabels from './hi';
import frlabels from './fr';
import itlabels from './it';
import ptlabels from './pt';
import mrlabels from './mr';
import nllabels from './nl';
import htlabels from './ht';
import pt_BRlabels from './pt_BR';
import eslabels from './es';
import urlabels from './ur';
import knlabels from './kn';
import calabels from './ca';
import gjlabels from './gj';
import cslabels from './cs';

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
      translation: {
        label: enlabels,
      },
      label: 'English',
    },
    de: {
      translation: {
        label: delabels,
      },
      label: 'Deutsch',
    },
    hi: {
      translation: {
        label: hilabels,
      },
      label: 'हिन्दी',
    },
    fr: {
      translation: {
        label: frlabels,
      },
      label: 'Français',
    },
    it: {
      translation: {
        label: itlabels,
      },
      label: 'Italiano',
    },
    pt: {
      translation: {
        label: ptlabels,
      },
      label: 'Português',
    },
    mr: {
      translation: {
        label: mrlabels,
      },
      label: 'मराठी',
    },
    nl: {
      translation: {
        label: nllabels,
      },
      label: 'Nederlands',
    },
    ht: {
      translation: {
        label: htlabels,
      },
      label: 'Kreyòl ayisyen',
    },
    pt_BR: {
      translation: {
        label: pt_BRlabels,
      },
      label: 'Portugues do Brasil',
    },
    kn: {
      translation: {
        label: knlabels,
      },
      label: 'ಕನ್ನಡ',
    },
    es: {
      translation: {
        label: eslabels,
      },
      label: 'Español',
    },
    ur: {
      translation: {
        label: urlabels,
      },
      label: 'اردو',
    },
    ca: {
      translation: {
        label: calabels,
      },
      label: 'Català',
    },
    gj: {
      translation: {
        label: gjlabels,
      },
      label: 'ગુજરાતી',
    },
    cs: {
      translation: {
        label: cslabels,
      },
      label: 'Ceština',
    },
  },
});

export default i18next;
