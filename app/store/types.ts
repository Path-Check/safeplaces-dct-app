import { store } from './index';
import rootReducer from './reducers/rootReducer';
import { StateType } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

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

// From API
export type HealthcareAuthority = {
  name: string;
  bounds: Record<string, unknown>;
  ingest_url: string;
  publish_url: string;
};

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
