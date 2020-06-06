package org.pathcheck.covidsafepaths.gps.storage

//
//  GeohashTests.kt
//  COVIDSafePaths
//
//  Created by Tambet Ingo on 05/28/2020.
//

import com.marianhello.bgloc.data.BackgroundLocation
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import covidsafepaths.gps.extensions.*

class GeohashTests {
    @Test
    fun testTimeWindow() {
        val location = BackgroundLocation().apply {
            latitude = 41.24060321
            longitude = 14.91328448
            time = 1586865792000
        }

        val interval: Long = 60 * 5 * 1000
        val (early, late) = location.timeWindow(interval)
        assertEquals(1586865600000, early)
        assertEquals(1586865900000, late)
    }

    @Test
    fun testScryptHashSpec() {
        val location = BackgroundLocation().apply {
            latitude = 41.24060321
            longitude = 14.91328448
            time = 1589117939000
        }

        val geohashes = location.geohashes()
        val expected = listOf(
                "sr6de7ee1589118000000",
                "sr6de7ee1589117700000",
                "sr6de7es1589118000000",
                "sr6de7es1589117700000",
                "sr6de7e71589118000000",
                "sr6de7e71589117700000",
                "sr6de7ek1589118000000",
                "sr6de7ek1589117700000"
        )

        geohashes.forEach { hash ->
            assertTrue(expected.contains(hash))
        }
    }

    @Test
    fun testScrypt() {
        assertEquals("c9414c55812d796a", scrypt("gcpuuz8u1586865600000"))
    }

    @Test
    fun testValidScrypt() {
        val location = BackgroundLocation().apply {
            latitude = 41.24060321
            longitude = 14.91328448
            time = 1589117939000
        }

        val scryptHashes = location.scryptHashes()
        assertTrue(scryptHashes.contains("a2dcd196d350fda7"))
    }
}
