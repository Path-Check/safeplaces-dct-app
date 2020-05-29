export const QUESTION_TYPE_MULTI = 'MULTI';

export const QUESTION_KEY_AGREE = 'QUESTION_AGREE';
export const OPTION_VALUE_AGREE = 'AGREE';
export const OPTION_VALUE_DISAGREE = 'DISAGREE';

export const SCREEN_TYPE_RADIO = 'Radio';
export const SCREEN_TYPE_CHECKBOX = 'Checkbox';
export const SCREEN_TYPE_DATE = 'Date';
export const SCREEN_TYPE_END = 'End';

export const SCREEN_TYPE_CAREGIVER = 'EndCaregiver';
export const SCREEN_TYPE_DISTANCING = 'EndDistancing';
export const SCREEN_TYPE_EMERGENCY = 'EndEmergency';
export const SCREEN_TYPE_ISOLATE = 'EndIsolate';

// Only include routes that can come from the server
export const END_ROUTES = [
  SCREEN_TYPE_CAREGIVER,
  SCREEN_TYPE_DISTANCING,
  SCREEN_TYPE_EMERGENCY,
  SCREEN_TYPE_ISOLATE,
];

export const Colors = {
  BACKGROUND: '#F5F8FC',
  IMAGE_BACKGROUND: 'rgb(224,236,255)',
  IMAGE_BACKGROUND_DANGER: 'rgb(255,226,233)',
  BORDER: 'rgb(173,188,205)',
  BORDER_SELECTED: 'rgb(0,121,253)',
  CTA: 'rgb(105,121,248)',
  DANGER: 'rgb(227,0,58)',
};

export const CAPTCHA_URL =
  'https://fathomless-mountain-29102.herokuapp.com/v1.0/captcha';

export const SURVEY_GET_API =
  'https://fathomless-mountain-29102.herokuapp.com/v1.0/contactTracingFlorida/survey/2';

export const SURVEY_POST_API =
  'https://fathomless-mountain-29102.herokuapp.com/v1.0/contactTracingFlorida/survey/2/response';
