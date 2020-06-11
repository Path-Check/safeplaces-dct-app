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

package covidsafepaths.bte.exposurenotifications.notify;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
import com.google.common.collect.ImmutableList.Builder;
import com.google.common.util.concurrent.FluentFuture;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

import org.checkerframework.checker.nullness.compatqual.NullableDecl;
import org.threeten.bp.ZonedDateTime;

import java.util.List;
import java.util.concurrent.TimeUnit;

import covidsafepaths.bte.exposurenotifications.common.AppExecutors;
import covidsafepaths.bte.exposurenotifications.common.TaskToFutureAdapter;
import covidsafepaths.bte.exposurenotifications.network.DiagnosisKey;
import covidsafepaths.bte.exposurenotifications.network.DiagnosisKeys;
import covidsafepaths.bte.exposurenotifications.storage.PositiveDiagnosisEntity;
import covidsafepaths.bte.exposurenotifications.storage.PositiveDiagnosisRepository;

import static covidsafepaths.bte.exposurenotifications.nearby.ProvideDiagnosisKeysWorker.DEFAULT_API_TIMEOUT;

/**
 * Modified from google sample [ShareDiagnosisViewModel].
 */
public class ShareDiagnosisManager {

    private static final String TAG = "ShareDiagnosisManager";

    public static final long NO_EXISTING_ID = -1;

    private final PositiveDiagnosisRepository repository;
    private final Context context;

    private final MutableLiveData<ZonedDateTime> testTimestampLiveData = new MutableLiveData<>();
    private final MutableLiveData<Long> existingIdLiveData = new MutableLiveData<>(NO_EXISTING_ID);

    public ShareDiagnosisManager(Context context) {
        repository = new PositiveDiagnosisRepository(context);
        this.context = context;
    }

    @NonNull
    public LiveData<PositiveDiagnosisEntity> getByIdLiveData(long id) {
        return repository.getByIdLiveData(id);
    }

    /**
     * TODO currently unused
     * Deletes a given entity
     */
    public void deleteEntity(PositiveDiagnosisEntity positiveDiagnosisEntity) {
        Futures.addCallback(
                repository.deleteByIdAsync(positiveDiagnosisEntity.getId()),
                new FutureCallback<Void>() {
                    @Override
                    public void onSuccess(@NullableDecl Void result) {
                        // TODO
                    }

                    @Override
                    public void onFailure(Throwable t) {
                        Log.w(TAG, "Failed to delete", t);
                    }
                },
                AppExecutors.getLightweightExecutor());
    }

    /**
     * Share the keys.
     * @return Boolean representing success or failure of sharing keys with service.
     */
    public ListenableFuture<Boolean> share() {
        return FluentFuture.from(getRecentKeys())
                .transformAsync(this::submitKeysToService, AppExecutors.getBackgroundExecutor());
    }

    /**
     * TODO currently unused
     * Performs the save operation and whether to mark as shared or not.
     */
    public void save(boolean shared) {
        Futures.addCallback(
                insertOrUpdateDiagnosis(shared),
                new FutureCallback<Void>() {
                    @Override
                    public void onSuccess(@NullableDecl Void result) {
                        // TODO
                    }

                    @Override
                    public void onFailure(Throwable t) {
                        // TODO
                    }
                },
                AppExecutors.getLightweightExecutor());
    }

    /**
     * Inserts current diagnosis into the local database with a shared state.
     */
    private ListenableFuture<Void> insertOrUpdateDiagnosis(boolean shared) {
        long positiveDiagnosisId = existingIdLiveData.getValue();
        if (positiveDiagnosisId == NO_EXISTING_ID) {
            // Add flow so add the entity
            return repository.upsertAsync(
                    PositiveDiagnosisEntity.create(testTimestampLiveData.getValue(), shared));
        } else {
            // Update flow so just update the shared status
            return repository.markSharedForIdAsync(positiveDiagnosisId, shared);
        }
    }

    /**
     * Gets recent (initially 14 days) Temporary Exposure Keys from Google Play Services.
     */
    private ListenableFuture<List<TemporaryExposureKey>> getRecentKeys() {
        return TaskToFutureAdapter.getFutureWithTimeout(
                Nearby.getExposureNotificationClient(context).getTemporaryExposureKeyHistory(),
                DEFAULT_API_TIMEOUT.toMillis(),
                TimeUnit.MILLISECONDS,
                AppExecutors.getScheduledExecutor());
    }

    /**
     * Submits the given Temporary Exposure Keys to the server, designating them as
     * Diagnosis Keys.
     *
     * @return a {@link ListenableFuture} of type {@link Boolean} of successfully submitted state
     */
    private ListenableFuture<Boolean> submitKeysToService(List<TemporaryExposureKey> recentKeys) {
        Builder<DiagnosisKey> builder = new Builder<>();
        for (TemporaryExposureKey k : recentKeys) {
            builder.add(
                    DiagnosisKey.newBuilder()
                            .setKeyBytes(k.getKeyData())
                            .setIntervalNumber(k.getRollingStartIntervalNumber())
                            .build());
        }
        return FluentFuture.from(new DiagnosisKeys(context).upload(builder.build()))
                .transform(
                        v -> {
                            // Successfully submitted
                            return true;
                        },
                        AppExecutors.getLightweightExecutor())
                .catching(
                        ApiException.class,
                        (e) -> {
                            // Not successfully submitted,
                            return false;
                        },
                        AppExecutors.getLightweightExecutor());
    }
}
