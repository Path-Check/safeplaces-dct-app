# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# react-native-config, prevents obfuscating of .env flags
-keep class org.pathcheck.covidsafepaths.BuildConfig { *; }

-keep class androidx.core.app.CoreComponentFactory { *; }

# Guava configuration.
-dontwarn com.google.errorprone.**
-dontwarn sun.misc.Unsafe
-dontwarn java.lang.ClassValue

# AutoValue configuration.
-keep class * extends com.google.auto
-dontwarn com.google.auto.**

# Storage
-dontwarn java.nio.ByteBuffer

# BLE Configuration constants
-keep class com.google.android.apps.exposurenotification.config.** { *; }

# Volley.
-dontwarn org.apache.http.**
-dontwarn android.net.http.**
-dontwarn com.android.volley.**

# GMSCore
-keep class org.checkerframework.checker.nullness.qual.** { *; }
-dontwarn org.checkerframework.checker.nullness.qual.**

# Joda
-dontwarn org.joda.convert.**
