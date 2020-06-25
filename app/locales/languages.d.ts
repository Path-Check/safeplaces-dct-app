import {
  LOCALE_LIST as localList,
  getUserLocaleOverride as getOverride,
  setUserLocaleOverride as setOverride,
  supportedDeviceLanguageOrEnglish as supportedDevice,
  useLanguageDirection as languageDirection,
  getLanguageFromLocale as localeLanguage,
} from './languages';

export const LOCALE_LIST: Record<unknown, unknown> = localList;
export const setUserLocaleOverride: (
  locale: string,
) => Promise<void> = setOverride;
export const getUserLocaleOverride: () => string = getOverride;
export const supportedDeviceLanguageOrEnglish: () => string = supportedDevice;
export const useLanguageDirection: () =>
  | 'rtl'
  | 'ltr'
  | undefined = languageDirection;
export const getLanguageFromLocale: (locale: string) => string = localeLanguage;
