import { Dispatch, Middleware, AnyAction, MiddlewareAPI } from 'redux';
import IntersectService from '../../services/IntersectService';
import toggleSelectedHealthcareAuthorityAction from '../actions/healthcareAuthorities/toggleSelectedHealthcareAuthorityAction';
import { HealthcareAuthority } from '../../common/types';

const areHaListsEqual = (
  listA: HealthcareAuthority[],
  listB: HealthcareAuthority[],
) => {
  const haIdSetA = new Set(listA.map((ha) => ha.internal_id));
  const haIdSetB = new Set(listB.map((ha) => ha.internal_id));
  if (haIdSetA.size != haIdSetB.size) return false;
  return haIdSetA.forEach(haIdSetB.has);
};

const onChangedSelectedHealthAuthorities: Middleware<Dispatch> = (
  store: MiddlewareAPI,
) => (next: Dispatch<AnyAction>) => (action: AnyAction): unknown => {
  const {
    healthcareAuthorities: { selectedAuthorities: haListBefore },
  } = store.getState();

  const result = next(action);

  const {
    healthcareAuthorities: { selectedAuthorities: haListAfter },
  } = store.getState();

  try {
    if (
      action.type === toggleSelectedHealthcareAuthorityAction.type &&
      action.meta?.triggerIntersect &&
      !areHaListsEqual(haListBefore, haListAfter)
    ) {
      IntersectService.checkIntersect(haListAfter);
    }
  } catch (e) {
    console.log('[intersect] failed ', e);
  }
  return result;
};

export default onChangedSelectedHealthAuthorities;
