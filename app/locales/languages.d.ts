import {
  getLocaleList as getLocaleListUntyped,
  getUserLocaleOverride as getOverride,
  setUserLocaleOverride as setOverride,
  supportedDeviceLanguageOrEnglish as supportedDevice,
  useLanguageDirection as languageDirection,
  getLanguageFromLocale as localeLanguage,
} from './languages';

export const getLocaleList: () => Record<
  unknown,
  unknown
> = getLocaleListUntyped;
export const setUserLocaleOverride: (
  locale: string,
) => Promise<void> = setOverride;
export const getUserLocaleOverride: () => Promise<string> = getOverride;
export const supportedDeviceLanguageOrEnglish: () => string = supportedDevice;
export const useLanguageDirection: () =>
  | 'rtl'
  | 'ltr'
  | undefined = languageDirection;
export const getLanguageFromLocale: (locale: string) => string = localeLanguage;
