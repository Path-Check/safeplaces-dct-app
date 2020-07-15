import { Store } from 'redux';
import { persistStore, Persistor } from 'redux-persist';

class MultipleStoreError extends Error {
  constructor() {
    super('Tried to create a second store for redux');
    this.name = 'Attempted to create multiple redux store';
  }
}

class StoreAccessor {
  store: Store | null = null;

  setStore = (store: Store | null) => {
    this.store = store;
  };

  getStore = () => {
    return this.store;
  };

  initialize = (store: Store): Persistor => {
    if (this.store !== null) {
      throw new MultipleStoreError();
    }

    this.setStore(store);
    const persistor = persistStore(store);
    return persistor;
  };
}

const singleton = new StoreAccessor();

export default singleton;
