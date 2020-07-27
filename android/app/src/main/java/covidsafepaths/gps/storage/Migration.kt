package covidsafepaths.gps.storage

//
//  Migration.kt
//  COVIDSafePaths
//
//  Created by Tambet Ingo on 05/25/2020.
//

import io.realm.DynamicRealm
import io.realm.RealmMigration

internal class Migration: RealmMigration {
    override fun migrate(realm: DynamicRealm, oldVersion: Long, newVersion: Long) {
        val schema = realm.schema

        if (oldVersion == 0L) {
            schema.get("Location")!!
                    .addRealmListField("hashes", String::class.java)
        }
    }
}
