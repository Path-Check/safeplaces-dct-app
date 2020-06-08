package covidsafepaths.gps.extensions

//
//  BackgroundLocation.kt
//  COVIDSafePaths
//
//  Created by Tambet Ingo on 05/28/2020.
//

import android.util.Log
import com.fonfon.kgeohash.GeoHash
import com.marianhello.bgloc.data.BackgroundLocation
import covidsafepaths.gps.storage.RealmSecureStorage
import org.bouncycastle.crypto.generators.SCrypt

private val SALT = "salt".toByteArray()
private const val LOCATION_INTERVAL: Long = RealmSecureStorage.LOCATION_INTERVAL

// Radius around center point of a given location
private val GEO_CIRCLE_RADII: List<Pair<Double, Double>> = listOf(
        0.0 to 0.0, // center
        0.0001 to 0.0, // N
        0.00007 to 0.00007, // NE
        0.0 to 0.0001, // E
        -0.00007 to 0.00007, // SE
        -0.0001 to 0.0, // S
        -0.00007 to -0.00007, // SW
        0.0 to -0.0001, // W
        0.00007 to -0.00007 //NW
)

// Generates rounded time windows for interval before and after timestamp
// https://pathcheck.atlassian.net/wiki/x/CoDXB
// - Parameters:
//   - interval: location storage interval in milliseconds
fun BackgroundLocation.timeWindow(interval: Long): Pair<Long, Long> {
    val early = (time - interval / 2) / interval * interval
    val late = (time + interval / 2) / interval * interval
    return early to late
}

// Generates array of geohashes concatenated with time, within a 10 meter radius of given location
fun BackgroundLocation.geohashes(): List<String> =
        GEO_CIRCLE_RADII
                .map { radii ->
                    val lat = latitude + radii.first
                    val lng = longitude + radii.second
                    GeoHash(lat, lng, 8)
                }
                .toSet()
                .flatMap { geohash ->
                    val (early, late) = timeWindow(LOCATION_INTERVAL)
                    listOf("$geohash$early", "$geohash$late")
                }

internal fun scrypt(source: String): String =
        SCrypt.generate(source.toByteArray(), SALT, 4096, 8, 1, 8)
                .fold("", { str, it -> str + "%02x".format(it) })

fun BackgroundLocation.scryptHashes(): List<String> {
    val start = System.currentTimeMillis()
    val hashes = geohashes().map { scrypt(it) }
    val duration = System.currentTimeMillis() - start
    Log.d("Location", "Encrypted ${hashes.size} hashes in ${duration}ms")

    return hashes
}
