import {
  getLocaleList as getLocaleListUntyped,
  getUserLocaleOverride as getOverride,
  setUserLocaleOverride as setOverride,
  useLanguageDirection as languageDirection,
  getLanguageFromLocale as localeLanguage,
} from './languages';

export const getLocaleList: () => {
  value: string;
  label: string;
}[] = getLocaleListUntyped;
export const setUserLocaleOverride: (
  locale: string,
) => Promise<void> = setOverride;
export const getUserLocaleOverride: () => string = getOverride;
export const useLanguageDirection: () =>
  | 'rtl'
  | 'ltr'
  | undefined = languageDirection;
export const getLanguageFromLocale: (locale: string) => string = localeLanguage;
