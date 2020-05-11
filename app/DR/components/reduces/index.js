import {
  ADD_BULLETIN,
  ADD_NEW,
  SET_HOSPITALS,
  SET_LABORATORIES,
} from './actionTypes';

const initialState = {
  bulletins: [],
  news: [],
  hospitals: [],
  laboratories: [],
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

    case SET_HOSPITALS:
      return {
        ...state,
        hospitals: [...action.value],
      };

    case SET_LABORATORIES:
      return {
        ...state,
        laboratories: [...action.value],
      };

    default:
      return state;
  }
};

export { reducer, initialState };
