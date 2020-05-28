import AsyncStorage from '@react-native-community/async-storage';
import { applyMiddleware, compose, createStore } from 'redux';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';

import migrations from './migrations';
import rootReducer from './reducers/rootReducer';

const composeEnhancers =
  // eslint-disable-next-line no-underscore-dangle
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const enhancers = composeEnhancers(applyMiddleware());

export const STORE_VERSION = 0;
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: STORE_VERSION,
  // add keys of reducers to ignore:
  blacklist: [],
  migrate: createMigrate(migrations),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createPersistedStore = () => {
  const store = createStore(persistedReducer, {}, enhancers);
  const persistor = persistStore(store);
  return { store, persistor };
};
