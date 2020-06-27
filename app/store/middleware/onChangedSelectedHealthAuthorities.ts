import { Dispatch, Middleware, AnyAction } from 'redux';
import { TOGGLE_SELECTED_HEALTHCARE_AUTHORITY } from '../actions/healthcareAuthorities/toggleSelectedHealthcareAuthorityAction';
import IntersectService from '../../services/IntersectService';

const onChangedSelectedHealthAuthorities: Middleware<Dispatch> = () => (
  next: Dispatch<AnyAction>,
) => (action: AnyAction): unknown => {
  const result = next(action);

  if (action.type === TOGGLE_SELECTED_HEALTHCARE_AUTHORITY) {
    IntersectService.checkIntersect(true);
  }
  return result;
};

export default onChangedSelectedHealthAuthorities;
