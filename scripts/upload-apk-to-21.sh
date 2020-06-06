#!/bin/sh
# Script: Upload
# Jenkings script file will upload file for running autonomous test.
# USAGE:  upload upload.conf

echo 'first: ' $1
echo 'second: ' $2
echo 'third: ' $3
echo 'api key: ' $TWENTY_ONE_LABS_API_KEY
echo 'pwd: ' $TWENTY_ONE_LABS_PASSWORD

source $1
echo 'app id: ' $application_id

if [ -z "$1" ]; then
  printf  "configuration file param missing.  Usage: test <config_filepath> <APK_FILE_PATH>\n"
  exit 1
fi

if test -f "$1"; then
  echo "checking configuration file exists: " $1
else
  printf  "configuration file param is missing.  Usage: Upload <config_filepath> <BUILD_NAME> <APK_FILE_PATH>\n"
  exit 1
fi

if [ -z "$2" ]; then
  printf  "build name param missing.  Usage: Upload <config_filepath> <BUILD_NAME> <APK_FILE_PATH>\n"
  exit 1
fi

if [ -z "$3" ]; then
  printf  "APK file path param missing.  Upload: test <config_filepath> <BUILD_NAME> <APK_FILE_PATH>\n"
  exit 1
fi

if test -f "$3"; then
  echo "checking apk file exists: " $3
else
  printf  "apk file: '%s' is missing\n" $3
  exit 1
fi

# username=safepath@21labs.io
# application_id=71

# read params from config file
config_file=$1
build_name=$2
apk_path=$3
URL=https://api.21labs.io/api/cicd/upload
#URL=http://localhost:5000/api/cicd/upload

source $config_file

if [ -n "$api_key" ]; then
  echo "api_key = " $api_key
else
  printf  "API_KEY is missing in cofig file.\n add to config file: 'api_key=<32_charachter_api_key>\n"
  exit 1
fi

if [ -n "$build_name" ]; then
  echo "build_name = " $build_name
else
  printf  "BUILD_NAME is missing.\n"
  exit 1
fi

if [ -n "$apk_path" ]; then
  echo "apk_path = " $apk_path
else
  printf  "APK file path is missing.\n"
  exit 1
fi

if [ -n "$username" ]; then
  echo "username = " $username
else
  username=''
fi

if [ -n "$password" ]; then
  echo "password = " $password
else
  password=''
fi

if [ -n "$application_id" ]; then
  echo "application_id = " $application_id
else
  application_id=''
fi

echo "\nCalling api endpoint: " $URL "\n\n"

response=$(curl --http1.1 -i -X POST -H "Content-Type: multipart/form-data" \
 -H "ApplicationId: $application_id" \
 -F "api_key=$api_key" \
 -F "the_file=@$apk_path" \
 -F "build_name=$build_name" \
 -F "username=$username" \
 -F "password=$password" \
$URL)  

echo "checking Upload Success -  response:\n" $response

## Remove quotation marks (") and spaces.
response=$(echo $response | sed -e 's/[{""}]//g' | sed -e 's/ //g')

entries=($(echo "$response" | tr ',' '\n'))
for j in "${!entries[@]}"
do
    keyval=($(echo "${entries[j]}" | tr ':' '\n'))
    ## echo "is_complete value: $j ${keyval[1]}"

    if [ $j -eq 0 ]; then  #ststus
         if [ ${keyval[1]} == 'Success' ]; then
            echo "Upload Successful."
            break
         fi
         if [ ${keyval[1]} == 'Fail' ]; then
            echo "Upload failed."
            break
         fi
    fi
    if [ $j -eq 1 ]; then  #message
         echo "Message: ${keyval[1]}"
    fi
done
