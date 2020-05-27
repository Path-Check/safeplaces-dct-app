import { ONBOARDING_COMPLETE } from '../actions/constants';

const initialState = {
  complete: false,
};

const onboardingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ONBOARDING_COMPLETE: {
      return {
        complete: true,
      };
    }
    default:
      return state;
  }
};

export default onboardingReducer;
