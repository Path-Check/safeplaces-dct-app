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

package covidsafepaths.bt.exposurenotifications.notify;

import android.content.Context;
import android.util.Log;

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

import java.util.List;
import java.util.concurrent.TimeUnit;

import covidsafepaths.bt.exposurenotifications.common.AppExecutors;
import covidsafepaths.bt.exposurenotifications.common.TaskToFutureAdapter;
import covidsafepaths.bt.exposurenotifications.network.DiagnosisKey;
import covidsafepaths.bt.exposurenotifications.network.DiagnosisKeys;
import covidsafepaths.bt.exposurenotifications.storage.PositiveDiagnosis;
import covidsafepaths.bt.exposurenotifications.storage.PositiveDiagnosisRepository;

import static covidsafepaths.bt.exposurenotifications.nearby.ProvideDiagnosisKeysWorker.DEFAULT_API_TIMEOUT;

/**
 * Modified from google sample [ShareDiagnosisViewModel].
 */
public class ShareDiagnosisManager {

    private static final String TAG = "ShareDiagnosisManager";

    public static final long NO_EXISTING_ID = -1;

    private final PositiveDiagnosisRepository repository;
    private final Context context;

    private final MutableLiveData<Long> existingIdLiveData = new MutableLiveData<>(NO_EXISTING_ID);

    public ShareDiagnosisManager(Context context) {
        repository = new PositiveDiagnosisRepository();
        this.context = context;
    }

    /**
     * TODO currently unused
     * Deletes a given entity
     */
    public void deleteDiagnosis(PositiveDiagnosis positiveDiagnosis) {
        Futures.addCallback(
                repository.deleteByIdAsync(positiveDiagnosis.getId()),
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
     *
     * @return Boolean representing success or failure of sharing keys with service.
     */
    public ListenableFuture<Boolean> share() {
        return FluentFuture.from(getRecentKeys())
                .transformAsync(this::submitKeysToService, AppExecutors.getBackgroundExecutor());
    }

    /**
     * TODO currently unused
     * Performs the save operation once a user reports a positive diagnosis
     */
    public void saveNewDiagnosis(boolean shared) {
        Futures.addCallback(
                insertNewDiagnosis(shared),
                new FutureCallback<Void>() {
                    @Override
                    public void onSuccess(@NullableDecl Void result) {
                        // TODO
                        Log.d(TAG, "Saved new diagnosis");
                    }

                    @Override
                    public void onFailure(Throwable t) {
                        // TODO
                        Log.e(TAG, "Failed to save new diagnosis", t);
                    }
                },
                AppExecutors.getLightweightExecutor());
    }

    /**
     * Inserts current diagnosis into the local database with a shared state.
     */
    private ListenableFuture<Void> insertNewDiagnosis(boolean shared) {
        PositiveDiagnosis positiveDiagnosis = new PositiveDiagnosis();
        positiveDiagnosis.setShared(shared);
        existingIdLiveData.postValue(positiveDiagnosis.getId());
        return repository.insertAsync(positiveDiagnosis);
    }

    /**
     * TODO unused
     * If the user has the opportunity to change their mind and share a diagnosis later
     */
    public ListenableFuture<Void> updateDiagnosisShared(boolean shared) {
        long existingId = existingIdLiveData.getValue();
        if (existingId != NO_EXISTING_ID) {
            return repository.markSharedForIdAsync(existingIdLiveData.getValue(), shared);
        } else {
            // TODO error state
            return Futures.immediateVoidFuture();
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
    public ListenableFuture<Boolean> submitKeysToService(List<TemporaryExposureKey> recentKeys) {
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
                            Log.d(TAG, "Submitted keys to server");
                            return true;
                        },
                        AppExecutors.getLightweightExecutor())
                .catching(
                        ApiException.class,
                        (e) -> {
                            Log.e(TAG, "Failed to submit keys to server", e);
                            return false;
                        },
                        AppExecutors.getLightweightExecutor());
    }
}
