# checks for no missing translations in the en.json file.
# this should ensure that keys are always clearly linked via git blame to their
# respective PR

#!/bin/bash
set -e

echo "Running i18next-parser"
yarn i18n:extract

echo "Checking for blank keys"
grep -r '""' app/locales/en.json
