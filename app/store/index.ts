import AsyncStorage from '@react-native-community/async-storage';
import { createImmutableStateInvariantMiddleware } from '@reduxjs/toolkit';
import {
  applyMiddleware,
  createStore,
  Store,
  Middleware,
  Dispatch,
} from 'redux';
import {
  createMigrate,
  persistReducer,
  persistStore,
  Persistor,
} from 'redux-persist';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import StoreAccessor from './StoreAccessor';
import migrations from './migrations';
import rootReducer from './reducers/rootReducer';

export const STORE_VERSION = 1;
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: STORE_VERSION,
  // add keys of reducers to ignore:
  blacklist: [],
  migrate: createMigrate(migrations),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createStoreAndPersistor = (
  extraMiddleware: Middleware<Dispatch>[],
): [Store, Persistor] => {
  const enhancers = composeWithDevTools(
    applyMiddleware(
      thunk,
      createImmutableStateInvariantMiddleware(),
      ...extraMiddleware,
    ),
  );
  const store = createStore(persistedReducer, {}, enhancers);
  StoreAccessor.setStore(store);
  const persistor = persistStore(store);
  return [store, persistor];
};
