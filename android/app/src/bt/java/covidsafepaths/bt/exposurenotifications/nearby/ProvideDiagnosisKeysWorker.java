/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package covidsafepaths.bt.exposurenotifications.nearby;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Constraints;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.ListenableWorker;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.WorkerParameters;

import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.exposurenotification.ExposureConfiguration;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;
import com.google.common.io.BaseEncoding;
import com.google.common.util.concurrent.FluentFuture;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

import org.threeten.bp.Duration;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

import covidsafepaths.bt.exposurenotifications.common.AppExecutors;
import covidsafepaths.bt.exposurenotifications.common.TaskToFutureAdapter;
import covidsafepaths.bt.exposurenotifications.network.DiagnosisKeys;
import covidsafepaths.bt.exposurenotifications.storage.TokenEntity;
import covidsafepaths.bt.exposurenotifications.storage.TokenRepository;

/**
 * Performs work to provide diagnosis keys to the exposure notifications API.
 */
public class ProvideDiagnosisKeysWorker extends ListenableWorker {

    private static final String TAG = "ProvideDiagnosisKeysWkr";

    public static final Duration DEFAULT_API_TIMEOUT = Duration.ofSeconds(15);

    public static final String WORKER_NAME = "ProvideDiagnosisKeysWorker";
    private static final BaseEncoding BASE64_LOWER = BaseEncoding.base64();
    private static final int RANDOM_TOKEN_BYTE_LENGTH = 32;

    private final DiagnosisKeys diagnosisKeys;
    private final DiagnosisKeyFileSubmitter submitter;
    private final SecureRandom secureRandom;
    private final TokenRepository tokenRepository;
    private final ExposureNotificationClient exposureNotificationClient;

    public ProvideDiagnosisKeysWorker(@NonNull Context context,
                                      @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        diagnosisKeys = new DiagnosisKeys(context);
        submitter = new DiagnosisKeyFileSubmitter(context);
        secureRandom = new SecureRandom();
        tokenRepository = new TokenRepository(context);
        exposureNotificationClient = Nearby.getExposureNotificationClient(context);
    }

    private String generateRandomToken() {
        byte bytes[] = new byte[RANDOM_TOKEN_BYTE_LENGTH];
        secureRandom.nextBytes(bytes);
        return BASE64_LOWER.encode(bytes);
    }

    @NonNull
    @Override
    public ListenableFuture<Result> startWork() {
        // TODO WHere work starts
        Log.d(TAG, "Starting worker downloading diagnosis key files and submitting "
                + "them to the API for exposure detection, then storing the token used.");
        final String token = generateRandomToken();
        final ExposureConfiguration config = new ExposureConfigurations(getApplicationContext()).get();
        return FluentFuture.from(TaskToFutureAdapter
                .getFutureWithTimeout(
                        exposureNotificationClient.isEnabled(),
                        DEFAULT_API_TIMEOUT.toMillis(),
                        TimeUnit.MILLISECONDS,
                        AppExecutors.getScheduledExecutor()))
                .transformAsync((isEnabled) -> {
                    // Only continue if it is enabled.
                    if (isEnabled) {
                        // Download diagnosis keys from Safe Paths servers
                        return diagnosisKeys.download();
                    } else {
                        // Stop here because things aren't enabled. Will still return successful though.
                        return Futures.immediateFailedFuture(new NotEnabledException());
                    }
                }, AppExecutors.getBackgroundExecutor())
                // Submit downloaded files to EN client
                .transformAsync((batches) -> submitter.submitFiles(batches, config, token),
                        AppExecutors.getBackgroundExecutor())
                .transformAsync(
                        done -> tokenRepository.upsertAsync(TokenEntity.create(token, false)),
                        AppExecutors.getBackgroundExecutor())
                .transform(done -> Result.success(), AppExecutors.getLightweightExecutor())
                .catching(NotEnabledException.class, x -> {
                    // Not enabled. Return as success.
                    return Result.success();
                }, AppExecutors.getBackgroundExecutor())
                .catching(Exception.class, x -> {
                    Log.e(TAG, "Failure to provide diagnosis keys", x);
                    return Result.failure();
                }, AppExecutors.getBackgroundExecutor());
        // TODO: consider a retry strategy
    }

    /**
     * Schedules a job that runs once a day to fetch diagnosis keys from a server and to provide them
     * to the exposure notifications API.
     *
     * <p>This job will only be run when idle, not low battery and with network connection.
     */
    public static void scheduleDailyProvideDiagnosisKeys(Context context) {
        WorkManager workManager = WorkManager.getInstance(context);
        PeriodicWorkRequest workRequest = new PeriodicWorkRequest.Builder(
                ProvideDiagnosisKeysWorker.class, 24, TimeUnit.HOURS)
                .setConstraints(
                        new Constraints.Builder()
                                .setRequiresBatteryNotLow(true)
                                //.setRequiresDeviceIdle(true) commented out for testing purposes.
                                .setRequiredNetworkType(NetworkType.CONNECTED)
                                .build())
                .build();
        workManager
                .enqueueUniquePeriodicWork(WORKER_NAME, ExistingPeriodicWorkPolicy.REPLACE, workRequest);
    }

    /**
     * Cancels enqueued daily work.
     */
    public static void cancelDailyProvideDiagnosisKeys(Context context) {
      WorkManager.getInstance(context).cancelUniqueWork(WORKER_NAME);
    }

    private static class NotEnabledException extends Exception {

    }

}
