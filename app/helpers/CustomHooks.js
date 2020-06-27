import { useState } from 'react';

import i18n from '../locales/languages';
import survey_en from '../views/assessment/survey.en.json';

const surveys = {
  en: survey_en,
};

export function useSurvey() {
  let [survey] = useState(() => {
    return surveys[i18n.language] || survey_en;
  });
  return survey;
}
