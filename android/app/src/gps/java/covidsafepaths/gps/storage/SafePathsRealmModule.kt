package covidsafepaths.gps.storage

import io.realm.annotations.RealmModule

@RealmModule(classes = [Location::class])
class SafePathsRealmModule