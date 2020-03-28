TOP="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $TOP

function found_exe() {
    hash "$1" 2>/dev/null
}

if found_exe yarn ; then
    yarn install
elif found_exe npm ; then
    npm install
else
    echo "Unable to find either 'npm' or 'yarn'"
fi

react-native start
