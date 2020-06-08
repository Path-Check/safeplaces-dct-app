#!/bin/bash
set -e

# Usage:
#   - Create a READ/WRITE token at https://app.lokalise.com/profile
#   - Run the command from the root of the project with:
#     LOKALISE_TOKEN=<token> yarn i18n:push

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
    export PATH="$PATH:./bin"
  fi
fi

echo "Uploading English base files"
lokalise2 file upload \
  --file=app/locales/en.json,ios/en.lproj/InfoPlist.strings,ios/en.lproj/Localizable.strings,android/app/src/gps/res/values/strings.xml,android/app/src/bte/res/values/strings.xml \
  --lang-iso=en \
  --cleanup-mode \
  --replace-modified \
  --include-path \
  --detect-icu-plurals \
  --apply-tm \
  --convert-placeholders \
  --poll \
  --config .lokalise.yml --token=$LOKALISE_TOKEN

echo "Uploading Documents (e.g. EULA)"
lokalise2 file upload \
  --file=app/locales/eula/en.html \
  --lang-iso=en \
  --cleanup-mode \
  --replace-modified \
  --include-path \
  --detect-icu-plurals \
  --apply-tm \
  --convert-placeholders \
  --poll \
  --project-id=565995355ea89e2a5f2926.77486458 --token=$LOKALISE_TOKEN
