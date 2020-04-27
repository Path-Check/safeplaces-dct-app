import * as english from '../../app/locales/en.json';
import * as haitian from '../../app/locales/ht.json';

const languageStrings = {
  'en-US': english,
  'ht-HT': haitian,
};

export const languages = Object.keys(languageStrings).map(locale => [
  locale,
  languageStrings[locale],
]);
