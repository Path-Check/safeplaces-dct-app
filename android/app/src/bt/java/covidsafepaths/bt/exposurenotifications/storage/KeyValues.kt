package covidsafepaths.bt.exposurenotifications.storage

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey

const val ONLY_KEY = "KEY_VALUES"

/**
 * A catch all class for storing key value pairs.
 */
open class KeyValues(
        @PrimaryKey
        var id: String = ONLY_KEY,
        var lastDownloadedKeyZipFileName: String? = null
) : RealmObject()