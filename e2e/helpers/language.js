import merge from 'lodash/merge';

import * as english from '../../app/locales/en.json';
import * as spanish from '../../app/locales/es.json';

const languageStrings = {
  'en-US': english,
  es: spanish,
};

export const languages = Object.entries(languageStrings).map(
  ([locale, strings]) => [
    locale,
    // fall back to english if not found in the locale strings
    merge({}, english, strings),
  ],
);
