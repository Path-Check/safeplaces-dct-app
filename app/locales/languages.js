import i18next from 'i18next';
import { getLanguages } from 'react-native-i18n';

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
let userLang = undefined;
getLanguages().then(languages => {
  userLang = languages[0].split('-')[0]; // ['en-US' will become 'en']
  i18next.changeLanguage(userLang);
});

i18next.init({
  interpolation: {
    // React already does escaping
    escapeValue: false,
  },
  lng: userLang, // 'en' | 'es',
  fallbackLng: 'en', // If language detector fails
  resources: {
    en: {
      translation: {
        label: enlabels,
      },
    },
    de: {
      translation: {
        label: delabels,
      },
    },
    hi: {
      translation: {
        label: hilabels,
      },
    },
    fr: {
      translation: {
        label: frlabels,
      },
    },
    it: {
      translation: {
        label: itlabels,
      },
    },
    pt: {
      translation: {
        label: ptlabels,
      },
    },
    mr: {
      translation: {
        label: mrlabels,
      },
    },
    nl: {
      translation: {
        label: nllabels,
      },
    },
    ht: {
      translation: {
        label: htlabels,
      },
    },
    pt_BR: {
      translation: {
        label: pt_BRlabels,
      },
    },
    kn: {
      translation: {
        label: knlabels,
      },
    },
    es: {
      translation: {
        label: eslabels,
      },
    },
    ur: {
      translation: {
        label: urlabels,
      },
    },
    ca: {
      translation: {
        label: calabels,
      },
    },
    gj: {
      translation: {
        label: gjlabels,
      },
    },
    cs: {
      translation: {
        label: cslabels,
      },
    },
  },
});

export default i18next;
