import { Dispatch, Middleware, AnyAction, MiddlewareAPI } from 'redux';
import IntersectService from '../../services/IntersectService';

const onChangedSelectedHealthAuthorities: Middleware<Dispatch> = (
  store: MiddlewareAPI,
) => (next: Dispatch<AnyAction>) => (action: AnyAction): unknown => {
  const {
    healthcareAuthorities: { selectedAuthorities: stateBefore },
  } = store.getState();

  const result = next(action);

  const {
    healthcareAuthorities: { selectedAuthorities: stateAfter },
  } = store.getState();

  try {
    if (stateBefore !== stateAfter) {
      IntersectService.checkIntersect(stateAfter);
    }
  } catch (e) {
    console.log('[intersect] failed ', e);
  }
  return result;
};

export default onChangedSelectedHealthAuthorities;
