import AsyncStorage from '@react-native-community/async-storage';
import { createImmutableStateInvariantMiddleware } from '@reduxjs/toolkit';
import { applyMiddleware, createStore } from 'redux';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import StoreAccessor from './StoreAccessor';
import onChangedSelectedHealthAuthorities from './middleware/onChangedSelectedHealthAuthorities';

import migrations from './migrations';
import rootReducer from './reducers/rootReducer';

const enhancers = composeWithDevTools(
  applyMiddleware(
    thunk,
    createImmutableStateInvariantMiddleware(),
    onChangedSelectedHealthAuthorities,
  ),
);

export const STORE_VERSION = 2;
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: STORE_VERSION,
  // add keys of reducers to ignore:
  blacklist: [],
  migrate: createMigrate(migrations),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, {}, enhancers);
StoreAccessor.setStore(store);
export const persistor = persistStore(store);
