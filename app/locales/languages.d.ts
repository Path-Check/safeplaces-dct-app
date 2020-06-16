import {
  LOCALE_LIST as localList,
  setUserLocaleOverride as setOverride,
  supportedDeviceLanguageOrEnglish as supportedDevice,
  useLanguageDirection as languageDirection,
} from './languages';

export const LOCALE_LIST: Record<unknown, unknown> = localList;
export const setUserLocaleOverride: (
  locale: string,
) => Promise<void> = setOverride;
export const supportedDeviceLanguageOrEnglish: () => string = supportedDevice;
export const useLanguageDirection: () =>
  | 'rtl'
  | 'ltr'
  | undefined = languageDirection;
