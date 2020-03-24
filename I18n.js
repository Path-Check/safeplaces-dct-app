import I18n from "i18n-js";
import * as RNLocalize from "react-native-localize";

import en from "./locales/en";
import gr from "./locales/gr";

const locales = RNLocalize.getLocales();

if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag;
}

I18n.fallbacks = true;
I18n.translations = {
  en,
  gr
};

RNLocalize.addEventListener('change', ({ language }) => {
  I18n.locale = language
})

//I18n.locale = 'gr';

export default I18n;