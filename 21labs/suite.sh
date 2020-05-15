#!/bin/sh
# Script: suite
# Jenkings script file will run a suite corresponding to a suite_name and build_name.
# USAGE:  suite suite.conf build_nam

if [ -z "$1" ]; then
  printf  "Configuration file param missing.  Usage: Upload <config_filepath> <BUILD_NAME> <JENKINS_REFERENCE>\n"
  exit 1
fi

if test -f "$1"; then
  echo "Reading configuration from: " $1
else
  printf  "Configuration file is missing\n"
  exit 1
fi

if [ -z "$2" ]; then
  printf  "Build name param missing.  Usage: Upload <config_filepath> <BUILD_NAME> <JENKINS_REFERENCE>\n"
  exit 1
fi

#if [ -z "$3" ]; then
  #printf  "Jenkins reference (build_id) param missing.   Usage: Upload <config_filepath> <BUILD_NAME> <JENKINS_REFERENCE>\n"
 # exit 1
#fi


# read params from config file
config_file=$1
build_name=$2
reference_key=$(cat /dev/urandom | env LC_CTYPE=C tr -dc 'a-zA-Z0-9' | fold -w 15 | head -n 1)
echo "REFERENCE KEY ---- " $reference_key
URL=https://api.21labs.io/api/cicd
#URL=http://localhost:5000/api/cicd

source $config_file

if [ -n "$api_key" ]; then
  echo "api_key = " $api_key
else
  printf  "API_KEY is missing in cofig file.\n add to config file: 'api_key=<32_charachter_api_key>\n"
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

if [ -n "suites" ]; then
  ## We must replace the quotes to be able to send it by curl
  suites=$(echo "$suites"|tr '"' "'")
  echo "suites = " $suites
else
  suites=''
fi

if [ -n "$devices" ]; then
  ## We must replace the quotes to be able to send it by curl
  devices=$(echo "$devices"|tr '"' "'")
  echo "devices = " $devices
else
  devices=''
fi

echo "\nCalling api endpoint: " $URL "\n\n"

resp=$(curl -X POST -H "Content-Type: multipart/form-data" \
 -H "ApplicationId: $application_id" \
 -F "api_key=$api_key" \
 -F "reference_key=$reference_key" \
 -F "build_name=$build_name" \
 -F "suites=$suites" \
 -F "username=$username" \
 -F "password=$password" \
 -F "devices=$devices" \
$URL/suite_run)

echo "checking SuiteRun Success -  response:\n" $resp

## ----------------------------------------------
## Remove quotation marks (") and spaces.
resp_cleaned=$(echo $resp | sed -e 's/[{""}]//g' | sed -e 's/ //g')

is_done=false
resp_parts=($(echo "$resp_cleaned" | tr ',' '\n'))

echo "part one: ${resp_parts[0]}"
kv=($(echo "${resp_parts[0]}" | sed -e 's/ //g' | tr ':' '\n'))
if [ ${kv[1]} == 'Fail' ]; then
    is_done=true
fi

if [ $is_done == true ]; then
    echo "Unexpected error. Exiting!"
    exit 1
fi
## -----------------------------------------------

set -f
## sleep in bash for loop ##

##for i in {1..5} || !$is_done
##for ((i = 0 ; i < 25 && is_done == false; i++ ));

is_done=false
i=0
until [ $i -gt 500 ] || [ $is_done == true ]
do
    i=$((i+1))
    sleep 5s
    response=$(curl -X GET $URL/suite_run?cicd_ref_key=$reference_key)
    echo $response

    ## Remove quotation marks (") and spaces.
    response=$(echo $response | sed -e 's/[{""}]//g' | sed -e 's/ //g')
    echo "checking completion of tests: " $reference_key

    entries=($(echo "$response" | tr ',' '\n'))
    for j in "${!entries[@]}"
    do
        keyval=($(echo "${entries[j]}" | tr ':' '\n'))
        ## echo "is_complete value: $j ${keyval[1]}"

        if [ $j -eq 0 ]; then
             ##echo "is_complete value: $i ${keyval[1]}"
             if [ ${keyval[1]} == 'true' ]; then
                is_done=true
                break
             fi
        fi
        if [ $j -eq 1 ]; then
             echo "[$j] progress: ${keyval[1]}"
        fi
        if [ $j -eq 2 ] && [ ${keyval[1]} == 'ERROR' ]; then
              echo "Unexpected error while checking tests completion."
              exit 1
        fi
    done

    echo "is_done value: $is_done"
    if [ $is_done == true ]; then
        echo "All Done! breaking"
        #break
    fi
done


echo "Getting results."

curl -X GET $URL/results?cicd_ref_key=$reference_key -o Results.xml
