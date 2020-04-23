# checks for no missing translations in the en.json file.
# this should ensure that keys are always clearly linked via git blame to their
# respective PR

#!/bin/bash
set -e

echo "yarn i18n:extract"
yarn i18n:extract

echo "Checking for blank keys"
! grep "\"\"" app/locales/en.json

if [ $? -ne 0 ]; then
  fail "This change introduces i18n keys that have no translations!"
fi

function fail() {
  echo -e "\e[31m$1\e[0m"
  exit 1
}
