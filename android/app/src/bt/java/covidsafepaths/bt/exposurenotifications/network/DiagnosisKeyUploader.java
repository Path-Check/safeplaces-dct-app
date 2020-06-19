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
import android.net.Uri;
import android.util.Log;

import androidx.concurrent.futures.CallbackToFutureAdapter;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.NetworkResponse;
import com.android.volley.ParseError;
import com.android.volley.Response;
import com.android.volley.Response.ErrorListener;
import com.android.volley.Response.Listener;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.JsonRequest;
import com.google.common.collect.ImmutableList;
import com.google.common.io.BaseEncoding;
import com.google.common.util.concurrent.FluentFuture;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.threeten.bp.Duration;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;

import covidsafepaths.bt.exposurenotifications.common.AppExecutors;

/**
 * A class to encapsulate uploading Diagnosis Keys to one or more key sharing servers.
 * <p>
 * Modified from Google sample app to remove country codes / upload to multiple servers.
 */
public class DiagnosisKeyUploader {

    private static final String TAG = "KeyUploader";
    private static final BaseEncoding BASE64 = BaseEncoding.base64();
    private static final SecureRandom RAND = new SecureRandom();
    // TODO: accept these as args instead of hard-coded.
    private static final int DEFAULT_PERIOD = DiagnosisKey.DEFAULT_PERIOD;
    private static final int DEFAULT_TRANSMISSION_RISK = 1;
    private static final Duration TIMEOUT = Duration.ofSeconds(30);
    private static final int MAX_RETRIES = 3;
    private static final float RETRY_BACKOFF = 1.0f;
    // Some consts used when we make fake traffic.
    private static final int KEY_SIZE_BYTES = 16;
    private static final int FAKE_INTERVAL_NUM = 2650847; // Only size matters here, not the value.

    private final Context context;
    private final Uris uris;

    public DiagnosisKeyUploader(Context context) {
        this.context = context;
        uris = new Uris(context);
    }

    /**
     * Uploads the given keys to the key server(s) for all of the currently relevant
     * countries/regions. For simplicity, we upload all keys to all relevant countries/regions. For
     * most users there will be one relevant country.
     *
     * <p>The returned future represents success/fail of all the key server submissions.
     *
     * <p>TODO: Perhaps it would be good to support partial success with retry of failed submissions.
     *
     * @param diagnosisKeys the keys to submit, in an {@link ImmutableList} because internally we'll
     *                      share this around between threads so immutability makes things safer.
     */
    public ListenableFuture<?> upload(ImmutableList<DiagnosisKey> diagnosisKeys) {
        return startUpload(diagnosisKeys);
    }

    public ListenableFuture<?> startUpload(ImmutableList<DiagnosisKey> diagnosisKeys) {
        if (diagnosisKeys.isEmpty()) {
            Log.d(TAG, "Zero keys given, skipping.");
            return Futures.immediateFuture(null);
        }
        Log.d(TAG, "Uploading " + diagnosisKeys.size() + " keys...");
        // TODO replace with real
        //return doUpload(diagnosisKeys);
        return fakeUpload();
    }

    /**
     * Uploads realistically-sized fake traffic to the key sharing service(s), to help with privacy.
     *
     * <p>We use fake data for two things: The diagnosis keys and the safetynet attestation. Note that
     * we still make an RPC to SafetyNet, we just don't use its result.
     */
    public ListenableFuture<?> fakeUpload() {
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
        return doUpload(builder.build());
    }

    /**
     * Does the actual work of key uploads.
     */
    private ListenableFuture<?> doUpload(
            ImmutableList<DiagnosisKey> diagnosisKeys) {
        if (diagnosisKeys.isEmpty()) {
            Log.d(TAG, "Zero keys given, skipping.");
            return Futures.immediateFuture(null);
        }
        Log.d(TAG, "Uploading " + diagnosisKeys.size() + " keys...");

        return FluentFuture.from(createSubmission())
                .transformAsync(
                        submission -> addKeys(submission, diagnosisKeys),
                        AppExecutors.getLightweightExecutor())
                // Now we have all we need to create the JSON body of the request. In addPayloads we also
                // obtain a SafetyNet attestation. The SafetyNet RPCs go on the background executor
                // internally to DeviceAttestor, so getLightweightExecutor() is fine here.
                .transformAsync(this::addPayload, AppExecutors.getLightweightExecutor())
                // Ok, now we can submit all the key submission requests to the key server(s).
                .transformAsync(this::submitToServer, AppExecutors.getBackgroundExecutor());
    }

    private ListenableFuture<KeySubmission> createSubmission() {
        Log.d(TAG, "Composing diagnosis key upload to server.");
        KeySubmission s = new KeySubmission();
        s.transmissionRisk = DEFAULT_TRANSMISSION_RISK;
        return Futures.immediateFuture(s);
    }

    private ListenableFuture<KeySubmission> addKeys(
            KeySubmission submission, ImmutableList<DiagnosisKey> diagnosisKeys) {
        submission.diagnosisKeys = diagnosisKeys;
        return Futures.immediateFuture(submission);
    }

    private ListenableFuture<KeySubmission> addPayload(KeySubmission submission) throws JSONException {

        JSONArray keysJson = new JSONArray();
        try {
            for (DiagnosisKey k : submission.diagnosisKeys) {
                Log.d(TAG, "Adding key: " + k + " to submission.");
                keysJson.put(
                        new JSONObject()
                                .put("key", BASE64.encode(k.getKeyBytes()))
                                .put("rollingStartNumber", k.getIntervalNumber())
                                .put("rollingPeriod", DEFAULT_PERIOD)
                                .put("transmissionRisk", submission.transmissionRisk));
            }
        } catch (JSONException e) {
            // TODO: Some better exception.
            throw new RuntimeException(e);
        }

        submission.payload =
                new JSONObject()
                        .put("diagnosisKeys", keysJson);

        return FluentFuture.from(Futures.immediateFuture(submission));
    }

    private static String randomBase64Data(int approximateLength) {
        // Approximate the base64 blowup.
        int numBytes = (int) (((double) approximateLength) * 0.75);
        byte[] bytes = new byte[numBytes];
        RAND.nextBytes(bytes);
        return BASE64.encode(bytes);
    }

    private ListenableFuture<Void> submitToServer(KeySubmission submission) {
        return CallbackToFutureAdapter.getFuture(
                completer -> {
                    Listener<String> responseListener =
                            response -> {
                                Log.i(TAG, "Diagnosis Key upload succeeded.");
                                completer.set(null);
                            };

                    ErrorListener errorListener =
                            err -> {
                                Log.e(TAG, String.format("Diagnosis Key upload error: [%s]", err));
                                completer.setCancelled();
                            };

                    SubmitKeysRequest request =
                            new SubmitKeysRequest(uris.uploadUri, submission.payload, responseListener, errorListener);
                    RequestQueueSingleton.get(context).add(request);
                    return request;
                });
    }

    /**
     * A private value class to help assembling the elements needed to upload keys to a given server.
     */
    private static class KeySubmission {
        private JSONObject payload;
        private ImmutableList<DiagnosisKey> diagnosisKeys;
        private int transmissionRisk;
    }

    // TODO should we just replace Volley with Retrofit so this is easier to change in the future?

    /**
     * Simple construction of a Diagnosis Keys submission.
     */
    private static class SubmitKeysRequest extends JsonRequest<String> {

        SubmitKeysRequest(
                Uri endpoint,
                JSONObject jsonRequest,
                Listener<String> listener,
                ErrorListener errorListener) {
            super(Method.POST, endpoint.toString(), jsonRequest.toString(), listener, errorListener);
            setRetryPolicy(new DefaultRetryPolicy((int) TIMEOUT.toMillis(), MAX_RETRIES, RETRY_BACKOFF));
        }

        @Override
        protected Response<String> parseNetworkResponse(NetworkResponse response) {
            try {
                String responseString =
                        new String(response.data, HttpHeaderParser.parseCharset(response.headers, "utf-8"));
                return response.statusCode < 400
                        ? Response.success(responseString, HttpHeaderParser.parseCacheHeaders(response))
                        : Response.error(new VolleyError(response));
            } catch (UnsupportedEncodingException e) {
                return Response.error(new ParseError(e));
            }
        }

        @Override
        public String getBodyContentType() {
            return "application/json";
        }
    }
}
