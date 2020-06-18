package covidsafepaths.bt.exposurenotifications.debug

import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey.TemporaryExposureKeyBuilder
import com.google.common.io.BaseEncoding
import java.util.*

object DebugExposureNotificationUtils {
    private val BASE16 = BaseEncoding.base16().lowerCase()
    private const val FAKE_KEY = ""
    private val FAKE_ROLLING_START_INTERVAL =
        (System.currentTimeMillis() / (10 * 60 * 1000L)).toInt()
    private const val FAKE_ROLLING_PERIOD = 144
    private const val FAKE_TRANSMISSION_RISK_LEVEL = 0

    /**
     * Temporary for testing
     */
    fun getFakeRecentKeys(): List<TemporaryExposureKey>? {
        val fakeKeys: MutableList<TemporaryExposureKey> =
            ArrayList()
        fakeKeys.add(generateFakeKey())
        fakeKeys.add(generateFakeKey())
        fakeKeys.add(generateFakeKey())
        return fakeKeys
    }

    /**
     * Temporary for testing
     */
    private fun generateFakeKey(): TemporaryExposureKey {
        return TemporaryExposureKeyBuilder()
            .setKeyData(BASE16.decode(FAKE_KEY))
            .setRollingPeriod(FAKE_ROLLING_PERIOD)
            .setTransmissionRiskLevel(FAKE_TRANSMISSION_RISK_LEVEL)
            .setRollingStartIntervalNumber(FAKE_ROLLING_START_INTERVAL)
            .build()
    }
}
