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

package covidsafepaths.bt.exposurenotifications.storage;

import com.google.common.util.concurrent.ListenableFuture;

/**
 * Abstracts database access to Realm data source for Positive Diagnoses.
 */
public class PositiveDiagnosisRepository {

  public PositiveDiagnosisRepository() {
  }

  public ListenableFuture<Void> insertAsync(PositiveDiagnosis positiveDiagnosis) {
    return RealmSecureStorageBte.INSTANCE.insertDiagnosisAsync(positiveDiagnosis);
  }

  public ListenableFuture<Void> deleteByIdAsync(long id) {
    return RealmSecureStorageBte.INSTANCE.deleteDiagnosisAsync(id);
  }

  public ListenableFuture<Void> markSharedForIdAsync(long id,
                                                     boolean shared) {
    return RealmSecureStorageBte.INSTANCE.markDiagnosisSharedAsync(id, shared);
  }
}
