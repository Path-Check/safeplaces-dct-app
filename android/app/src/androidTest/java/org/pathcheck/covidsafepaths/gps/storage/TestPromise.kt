package org.pathcheck.covidsafepaths.gps.storage

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap

open class TestPromise: Promise {
  override fun resolve(value: Any?) {}
  override fun reject(code: String?, message: String?) {}
  override fun reject(code: String?, throwable: Throwable?) {}
  override fun reject(code: String?, message: String?, throwable: Throwable?) {}
  override fun reject(throwable: Throwable?) {}
  override fun reject(throwable: Throwable?, userInfo: WritableMap?) {}
  override fun reject(code: String?, userInfo: WritableMap) {}
  override fun reject(code: String?, throwable: Throwable?, userInfo: WritableMap?) {}
  override fun reject(code: String?, message: String?, userInfo: WritableMap) {}
  override fun reject(code: String?, message: String?, throwable: Throwable?, userInfo: WritableMap?) {}
  override fun reject(message: String?) {}
}