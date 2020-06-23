import { RootState, ApiStatus } from '../types';

const isAuthorityListLoadedSelector = (state: RootState): boolean =>
  state.healthcareAuthorities.request.status === ApiStatus.SUCCESS;

export default isAuthorityListLoadedSelector;
