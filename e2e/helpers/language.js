import * as english from '../../app/locales/en.json';
import * as haitian from '../../app/locales/ht.json';

export const getLanguageStrings = localeName => {
  switch (localeName) {
    case 'en-US':
      return english;
    case 'ht-HT':
      return haitian;
    default:
      return english;
  }
};
