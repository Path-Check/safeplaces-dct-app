import './all-dayjs-locales';

import dayjs from 'dayjs';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import { LANG_OVERRIDE } from '../constants/storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import ht from './ht.json';
import id from './id.json';
import it from './it.json';
import ml from './ml.json';
import ro from './ro.json';
import ru from './ru.json';
import sk from './sk.json';
import vi from './vi.json';
import zh_Hant from './zh-Hant.json';

// Refer this for checking the codes and creating new folders https://developer.chrome.com/webstore/i18n

// Adding/updating a language:
// 1. Update i18next-parser.config.js to ensure the xy language is in "locales"
// 2. run: npm run i18n:extract
// 3. All known/new keys will be added into xy.json
//    - any removed keys will be put into xy_old.json, do not commit this file
// 4. Update translations as needed
// 5. REMOVE all empty translations. e.g. "key": "", this will allow fallback to the default: English
// 6. import xyIndex from `./xy.json` and add the language to the block at the bottom

// detect and set device locale to i18n and dates
setLocale(getDeviceLocale());

// detect user override and set i18n and date locales
getUserLocaleOverride().then(locale => locale && setLocale(locale));

/** Fetch the user language override, if any */
export async function getUserLocaleOverride() {
  return await GetStoreData(LANG_OVERRIDE);
}

/** Get the device locale (normalized) */
export function getDeviceLocale() {
  return normalizeLocale(
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale || // iOS < 13
          NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
      : NativeModules.I18nManager.localeIdentifier, // Android
  );
}

/**
 * @param {string} fullLocale
 */
function normalizeLocale(fullLocale) {
  const [first] = fullLocale.split('-');
  return first;
}

async function setLocale(fullLocale) {
  const locale = normalizeLocale(fullLocale);
  dayjs.locale([locale, 'en']);
  return await i18next.changeLanguage(locale);
}

export async function setUserLocaleOverride(fullLocale) {
  let locale = normalizeLocale(fullLocale);
  await setLocale(locale);
  if (locale === getDeviceLocale()) {
    locale = undefined;
  }
  await SetStoreData(LANG_OVERRIDE, locale);
}

i18next
  // so that prettier lists plugins on single line
  .use(initReactI18next)
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: 'en', // 'en' | 'es',
    fallbackLng: 'en', // If language detector fails
    resources: {
      en: { label: 'English', translation: en },
      es: { label: 'Español', translation: es },
      fr: { label: 'Français', translation: fr },
      ht: { label: 'Kreyòl ayisyen', translation: ht },
      id: { label: 'Indonesia', translation: id },
      it: { label: 'Italiano', translation: it },
      ml: { label: 'മലയാളം', translation: ml },
      ro: { label: 'Română', translation: ro },
      ru: { label: 'Русский', translation: ru },
      sk: { label: 'Slovak', translation: sk },
      vi: { label: 'Vietnamese', translation: vi },
      zh_Hant: { label: '繁體中文', translation: zh_Hant },
    },
  });

/** The known locale list */
export const LOCALE_LIST = Object.entries(i18next.options.resources).map(
  ([langCode, lang]) => ({
    value: langCode,
    label: lang.label,
  }),
);

/** A map of locale code to name. */
export const LOCALE_NAME = Object.entries(i18next.options.resources).reduce(
  (output, [langCode, lang]) => {
    output[langCode] = lang.label;
    return output;
  },
  {},
);

export default i18next;
