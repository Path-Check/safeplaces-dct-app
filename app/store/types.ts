import rootReducer from './reducers/rootReducer';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
// Our internal store representation is the same as the API representation
export type { HealthcareAuthority } from '../api/healthcareAuthorities/getHealthcareAuthoritiesApi';

export type RootState = ReturnType<typeof rootReducer>;

// These will appear in redux debugger, so string names are helpful
export enum ApiStatus {
  INITIAL = 'INITIAL',
  STARTED = 'STARTED',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export type ApiRequest = {
  status: ApiStatus; // This allows components to show states based on api status
  errorMessage: string | null; // This is only for redux debugging. Store as a string for the safety in the store.
};

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export enum FeatureFlagOption {
  GOOGLE_IMPORT = 'GOOGLE_IMPORT',
  CUSTOM_URL = 'CUSTOM_URL',
  DOWNLOAD_LOCALLY = 'DOWNLOAD_LOCALLY',
  DEV_LANGUAGES = 'DEV_LANGAUGES',
}
