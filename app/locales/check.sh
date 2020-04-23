# checks for no missing translations in the en.json file.
# this should ensure that keys are always clearly linked via git blame to their
# respective PR

#!/bin/bash
set -ex

echo "Running i18next-parser"
yarn i18n:extract

echo "Checking for blank keys"
! grep "\"\"" app/locales/en.json
