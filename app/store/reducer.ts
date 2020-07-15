import AsyncStorage from '@react-native-community/async-storage';
import { createMigrate, persistReducer } from 'redux-persist';
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

const reducer = persistReducer(persistConfig, rootReducer);

export default reducer;
