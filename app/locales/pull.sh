# Usage:
#   - Create a READ ONLY a token at https://app.lokalise.com/profile
#   - Run the command from the root of the project with:
#     LOKALISE_TOKEN=<token> yarn i18n:pull

#!/bin/bash
set -e

function found_exe() {
  hash "$1" 2>/dev/null
}

if ! found_exe lokalise2; then
  if [[ "$OSTYPE" == "darwin"* ]]; then

    if ! found_exe brew; then
      echo "You must install homebrew: https://docs.brew.sh/Installation"
      exit 1
    fi
    brew tap lokalise/cli-2
    brew install lokalise2

  else
    curl -sfL https://raw.githubusercontent.com/lokalise/lokalise-cli-2-go/master/install.sh | sh
  fi
fi

echo "Downloading iOS *.strings"
lokalise2 file download \
  --add-newline-eof \
  --export-empty-as skip \
  --format strings \
  --include-description \
  --original-filenames \
  --unzip-to=ios \
  --export-sort=a_z \
  --config .lokalise.yml --token=$LOKALISE_TOKEN

echo "Downloading Android strings.xml"
lokalise2 file download \
  --add-newline-eof \
  --export-empty-as skip \
  --format xml \
  --include-description \
  --original-filenames \
  --unzip-to=android/app/src/main/res \
  --export-sort=a_z \
  --config .lokalise.yml --token=$LOKALISE_TOKEN

echo "Downloading i18next *.json files"
lokalise2 file download \
  --add-newline-eof \
  --export-empty-as=skip \
  --format json \
  --include-description \
  --plural-format=i18next \
  --placeholder-format=i18n \
  --export-sort=a_z \
  --replace-breaks=false \
  --bundle-structure "locales/%LANG_ISO%.json" \
  --original-filenames=false \
  --unzip-to=app \
  --indentation=2sp \
  --json-unescaped-slashes \
  --config .lokalise.yml --token=$LOKALISE_TOKEN
