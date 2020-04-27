import assign from 'lodash/assign';

import * as english from '../../app/locales/en.json';
import * as haitian from '../../app/locales/ht.json';

/**
 * Language strings for each locale. Strings are merged with english as a base
 * to emulate i18next's english fallback in the case of missing locale strings.
 */
const languageStrings = {
  'en-US': english,
  'ht-HT': assign({}, english, haitian),
};

export const languages = Object.keys(languageStrings).map(locale => [
  locale,
  languageStrings[locale],
]);
