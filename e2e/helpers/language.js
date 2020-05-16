import merge from 'lodash/merge';

import * as english from '../../gps/app/locales/en.json';
import * as haitian from '../../gps/app/locales/ht.json';

const languageStrings = {
  'en-US': english,
  'ht-HT': haitian,
};

export const languages = Object.entries(languageStrings).map(
  ([locale, strings]) => [
    locale,
    // fall back to english if not found in the locale strings
    merge({}, english, strings),
  ],
);
