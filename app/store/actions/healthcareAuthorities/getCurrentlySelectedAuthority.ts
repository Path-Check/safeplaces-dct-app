import { createAction } from '@reduxjs/toolkit';
import type { HealthcareAuthority } from '../../types';

const GET_CURRENTLY_SELECTED_AUTHORITY = 'GET_CURRENTLY_SELECTED_AUTHORITY';

const getCurrentlySelectedAuthority = createAction<{
  authority: HealthcareAuthority;
  selectedValue: boolean;
}>(GET_CURRENTLY_SELECTED_AUTHORITY);

export default getCurrentlySelectedAuthority;
