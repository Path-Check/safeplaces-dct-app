import './all-dayjs-locales';

import dayjs from 'dayjs';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import { LANG_OVERRIDE } from '../constants/storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import ar from './ar.json';
import en from './en.json';
import es from './es.json';
import fil from './fil.json';
import fr from './fr.json';
import ht from './ht.json';
import id from './id.json';
import it from './it.json';
import ja from './ja.json';
import ml from './ml.json';
import nl from './nl.json';
import pl from './pl.json';
import pt_BR from './pt_BR.json';
import ro from './ro.json';
import ru from './ru.json';
import sk from './sk.json';
import vi from './vi.json';
import zh_Hant from './zh_Hant.json';

// Refer this for checking the codes and creating new folders https://developer.chrome.com/webstore/i18n

// Adding/updating a language:
// 1. Add the language in Lokalise
// 2. run: yarn i18n:pull with your lokalise token, see app/locales/pull.sh instructions
// 3. import xy from `./xy.json` and add the language to the language block

/** Fetch the user language override, if any */
export async function getUserLocaleOverride() {
  return await GetStoreData(LANG_OVERRIDE);
}

export function getLanguageFromLocale(locale) {
  const [languageCode] = toIETFLanguageTag(locale).split('-');
  return languageCode;
}

/**
 * Convert ISO language `en_US` to IETF `en-us` for dayjs
 *
 * @param {string} locale
 */
function toIETFLanguageTag(locale) {
  return locale.replace('_', '-').toLowerCase();
}

async function setLocale(locale) {
  dayjs.locale(toIETFLanguageTag(locale));
  return await i18next.changeLanguage(locale);
}

export function useLanguageDirection() {
  const { i18n } = useTranslation();
  return i18n.dir();
}

export async function setUserLocaleOverride(locale) {
  await setLocale(locale);
  await SetStoreData(LANG_OVERRIDE, locale);
}

/* eslint-disable no-underscore-dangle */
/** Languages only available in dev builds. */
const DEV_LANGUAGES = __DEV__
  ? {
      ar: { label: ar._display_name, translation: ar },
      es: { label: es._display_name, translation: es },
      fil: { label: fil._display_name, translation: fil },
      fr: { label: fr._display_name, translation: fr },
      id: { label: id._display_name, translation: id },
      it: { label: it._display_name, translation: it },
      ja: { label: ja._display_name, translation: ja },
      ml: { label: ml._display_name, translation: ml },
      nl: { label: nl._display_name, translation: nl },
      pl: { label: pl._display_name, translation: pl },
      pt_BR: { label: pt_BR._display_name, translation: pt_BR },
      ro: { label: ro._display_name, translation: ro },
      ru: { label: ru._display_name, translation: ru },
      sk: { label: sk._display_name, translation: sk },
      vi: { label: vi._display_name, translation: vi },
      zh_Hant: { label: zh_Hant._display_name, translation: zh_Hant },
    }
  : {};

i18next.use(initReactI18next).init({
  interpolation: {
    // React already does escaping
    escapeValue: false,
  },
  lng: 'en', // 'en' | 'es',
  fallbackLng: 'en', // If language detector fails
  returnEmptyString: false,
  resources: {
    en: { label: en._display_name, translation: en },
    ht: { label: ht._display_name, translation: ht },
    ...DEV_LANGUAGES,
  },
});
/* eslint-enable no-underscore-dangle */

/** The known locale list */
export const LOCALE_LIST = Object.entries(i18next.options.resources)
  .map(([langCode, lang]) => ({
    value: langCode,
    label: lang.label,
  }))
  .sort((a, b) => a.value > b.value);

/** A map of locale code to name. */
export const LOCALE_NAME = Object.entries(i18next.options.resources).reduce(
  (output, [langCode, lang]) => {
    output[langCode] = lang.label;
    return output;
  },
  {},
);

/** Get the device locale e.g. en_US */
export function getDeviceLocale() {
  return Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale || // iOS < 13
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier; // Android
}

/**
 * Find compatible supported i18n language
 *
 * e.g. device locale `en_AU` would find `en`
 *      device locale `pt_BR` would find `pt-BR`
 */
export function supportedDeviceLanguageOrEnglish() {
  const locale = getDeviceLocale(); // en_US
  const langCode = getLanguageFromLocale(locale); // en
  const found = Object.keys(LOCALE_NAME).find(
    l => l === langCode || toIETFLanguageTag(l) === toIETFLanguageTag(locale),
  );
  return found || 'en';
}

// detect and set device locale, must go after i18next.init()
setLocale(supportedDeviceLanguageOrEnglish());

// detect user override
getUserLocaleOverride().then(locale => locale && setLocale(locale));

export default i18next;

// do not remove, this will force the yarn i18n:extract to export this key
i18next.t('_display_name');
