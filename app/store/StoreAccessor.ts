import { Store } from 'redux';

/*
 * This accessor is added for the SOLE purpose of avoiding cyclic imports from
 * the IntersectService to the Intersect helper and again to the store. The
 * accessor serves as a bridge for the consumers.
 * */
class StoreAccessor {
  store: Store | null = null;

  setStore = (store: Store | null) => {
    this.store = store;
  };

  getStore = () => {
    return this.store;
  };
}

const singleton = new StoreAccessor();

export default singleton;
