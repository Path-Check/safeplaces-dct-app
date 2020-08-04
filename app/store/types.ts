import { store } from './index';
import rootReducer from './reducers/rootReducer';
import { StateType } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
// Our internal store representation is the same as the API representation
export type { HealthcareAuthority } from '../common/types';

export type RootState = ReturnType<typeof rootReducer>;
export type Store = StateType<typeof store>;

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
  IMPORT_LOCATIONS_GOOGLE = 'IMPORT_LOCATIONS_GOOGLE',
  IMPORT_LOCATIONS_JSON_URL = 'IMPORT_LOCATIONS_JSON_URL',
  CUSTOM_URL = 'CUSTOM_URL',
  DOWNLOAD_LOCALLY = 'DOWNLOAD_LOCALLY',
  DEV_LANGUAGES = 'DEV_LANGUAGES',
  BYPASS_EXPORT_API = 'BYPASS_EXPORT_API',
  MOCK_EXPOSURE = 'MOCK_EXPOSURE',
}
