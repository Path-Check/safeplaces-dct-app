package covidsafepaths.bt.exposurenotifications.storage

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey
import java.util.*

/**
 * A positive diagnosis inputted by the user.
 *
 * TODO
 * <p>Partners should implement a daily TTL/expiry, for on-device storage of this data, and must
 * ensure compliance with all applicable laws and requirements with respect to encryption, storage,
 * and retention polices for end user data.
 */
open class PositiveDiagnosis(
    @PrimaryKey
    var id: Long = UUID.randomUUID().mostSignificantBits,
    var createdTimestampMs: Long = 0,
    var shared: Boolean = false
) : RealmObject()
