import moment from 'moment';

import { ADD_BULLETIN, ADD_NEW } from './actionTypes';

const today = moment(new Date()).format('YYYY-MM-DD');
const formBlankAnswers = {
  HIV: false,
  address: '',
  age: '',
  asthma: false,
  birth: today,
  bodyPain: false,
  cancer: false,
  chestPain: false,
  convulsions: false,
  cough: false,
  countriesVisited: '',
  dateArrived: today,
  dateIllnessStarted: today,
  diabetes: false,
  difficultyBreathing: false,
  disorientation: false,
  doesntWorkInHealth: false,
  dontKnowArea: false,
  dontKnowExposition: false,
  fever: false,
  hadCloseContact: false,
  hadFarContact: false,
  hardCough: false,
  haveSymptoms: null,
  heartCondition: false,
  hepaticCirrhosis: false,
  hypertension: false,
  iamPositive: false,
  immuneDeficiency: false,
  liveIn: false,
  liveWith: false,
  malnutrition: false,
  municipality: '',
  noSympthoms: false,
  none: false,
  noneAbove: false,
  notExposed: false,
  numberPersonLivesWith: '',
  obesity: false,
  phoneNumber: '',
  planWorkInHealth: false,
  pregnancy: false,
  province: '',
  renalInsufficiency: false,
  runnyNose: false,
  runnyNoseWithBlood: false,
  sex: '',
  showDateButton: false,
  sickleCellAnemia: false,
  sleepiness: false,
  soreThroat: false,
  threwUp: false,
  traveled: null,
  traveledIn: '',
  tuberculosis: false,
  usage: '',
  usedProtection: '',
  visitedArea: false,
  workInHealth: false,
  workedInHealth: false,
};
const initialState = {
  bulletins: [],
  news: [],
  answers: formBlankAnswers,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_BULLETIN:
      return {
        ...state,
        bulletins: [...action.value],
      };

    case ADD_NEW:
      return {
        ...state,
        news: [...state.news, ...action.value],
      };

    case 'ADD_ANSWERS':
      return {
        ...state,
        answers: { ...state.answers, ...action.value },
      };
    case 'CLEAN_ANSWERS':
      return {
        ...state,
        answers: formBlankAnswers,
      };
    default:
      return state;
  }
};

export { reducer, initialState };
