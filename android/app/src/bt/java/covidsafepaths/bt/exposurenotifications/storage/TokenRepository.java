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

import android.content.Context;

import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

/**
 * Abstracts database access to Realm data source for Tokens.
 */
public class TokenRepository {

  public TokenRepository(Context context) {
    // TODO
  }

//  public ListenableFuture<List<TokenEntity>> getAllAsync() {
//    // TODO
//  }

  public ListenableFuture<Void> upsertAsync(TokenEntity entity) {
    // TODO
    return Futures.immediateVoidFuture();
  }

  public ListenableFuture<Void> deleteByTokensAsync(String... tokens) {
    // TODO
    return Futures.immediateVoidFuture();
  }
}
