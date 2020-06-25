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

package covidsafepaths.bt.exposurenotifications.network;

import android.content.Context;
import android.util.Log;

import com.google.common.collect.ImmutableList;
import com.google.common.util.concurrent.ListenableFuture;

import java.security.SecureRandom;

import covidsafepaths.bt.exposurenotifications.storage.ExposureNotificationSharedPreferences;
import covidsafepaths.bt.exposurenotifications.storage.ExposureNotificationSharedPreferences.NetworkMode;

/**
 * A facade to network operations to upload Diagnosis Keys (i.e. Temporary Exposure Keys covering an
 * infectious period for someone with a positive COVID-19 diagnosis) to a server, and download all
 * known Diagnosis Keys.
 *
 * <p>The upload is an RPC, the download is a file fetch.
 *
 * <p>This facade uses shared preferences to switch between using a live test server and internal
 * faked implementations.
 */
public class DiagnosisKeys {
  private static final String TAG = "DiagnosisKeys";
  // Some consts used when we make fake traffic.
  private static final int KEY_SIZE_BYTES = 16;
  private static final int FAKE_INTERVAL_NUM = 2650847; // Only size matters here, not the value.
  private static final SecureRandom RAND = new SecureRandom();

  private final DiagnosisKeyDownloader diagnosisKeyDownloader;
  private final DiagnosisKeyUploader diagnosisKeyUploader;
  private final FakeDiagnosisKeyDownloader fakeDiagnosisKeyDownloader;

  private final ExposureNotificationSharedPreferences preferences;

  public DiagnosisKeys(Context context) {
    diagnosisKeyDownloader = new DiagnosisKeyDownloader(context.getApplicationContext());
    diagnosisKeyUploader = new DiagnosisKeyUploader(context.getApplicationContext());
    fakeDiagnosisKeyDownloader = new FakeDiagnosisKeyDownloader(context.getApplicationContext());
    preferences = new ExposureNotificationSharedPreferences(context.getApplicationContext());
  }

  /**
   * Upload Diagnosis Keys to server to mark them as tested positive for COVID-19.
   *
   * <p>A Diagnosis key is a Temporary Exposure Key from a user who has tested positive.
   *
   * @param diagnosisKeys List of keys, which includes their interval
   */
  public ListenableFuture<?> upload(ImmutableList<DiagnosisKey> diagnosisKeys) {
    // TODO handle fake / test / production
    return diagnosisKeyUploader.upload(diagnosisKeys);
  }

  public ListenableFuture<ImmutableList<KeyFileBatch>> download() {
    // TODO handle fake / test / production
    NetworkMode mode = preferences.getNetworkMode(NetworkMode.FAKE);
    switch (mode) {
      case FAKE:
        Log.d(TAG, "Using fake: FakeDiagnosisKeyDownloader");
        return fakeDiagnosisKeyDownloader.download();
      case TEST:
        Log.d(TAG, "Using real: DiagnosisKeyDownloader");
        return diagnosisKeyDownloader.download();
      default:
        throw new IllegalArgumentException("Unsupported network mode: " + mode);
    }
  }

  public ImmutableList<DiagnosisKey> generateFakeKeys() {
      ImmutableList.Builder<DiagnosisKey> builder = ImmutableList.builder();
      // Build up 14 random diagnosis keys.
      for (int i = 0; i < 14; i++) {
        byte[] bytes = new byte[KEY_SIZE_BYTES];
        RAND.nextBytes(bytes);
        builder.add(
                DiagnosisKey.newBuilder()
                        .setKeyBytes(bytes)
                        .setIntervalNumber(FAKE_INTERVAL_NUM)
                        .build());
      }
      return builder.build();
  }
}
