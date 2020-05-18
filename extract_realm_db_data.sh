#!/bin/bash
# Use this script to pull realm data from Android for local verification.
# To do so, you must ensure data is not encrypted on write, for your local build
# Disable realm encryption by commenting out the call to encrypt the realm store in Kotlin.
# Re-deploy your android app and export the realm data.
# View it in Realm Studio (available for download)
# ADB_PATH="~/Library/Android/sdk/platform-tools"
PACKAGE_NAME="org.pathcheck.covidsafepaths"
DB_NAME="safepaths.realm"
DESTINATION_PATH="./${DB_NAME}"
NOT_PRESENT="List of devices attached"
ADB_FOUND=`adb devices | tail -2 | head -1 | cut -f 1 | sed 's/ *$//g'`
if [[ ${ADB_FOUND} == ${NOT_PRESENT} ]]; then
    echo "Make sure a device is connected"
else
    adb exec-out run-as ${PACKAGE_NAME} cat files/${DB_NAME} > ${DESTINATION_PATH}
    echo "Database exported to ${DESTINATION_PATH}"
fi