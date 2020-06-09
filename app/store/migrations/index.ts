import type { MigrationManifest, PersistedState } from 'redux-persist';

const migrations: MigrationManifest = {
  0: (prevState: PersistedState) => prevState,
};

export default migrations;
