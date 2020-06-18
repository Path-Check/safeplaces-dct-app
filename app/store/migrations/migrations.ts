import type { MigrationManifest } from 'redux-persist';
import { default as untypedMigrations } from './migrations';

const migrations: MigrationManifest = untypedMigrations;
export default migrations;
