function show_help() {
    echo "
Usage: dev_setup.sh [options]
   Configures a Linux or MacOS machine for working with the code in this repo.
Options:
    -ni             Non-interactive mode, auto answers Yes to all questions.
    -h,  --help     Show this message
"
}

for var in "$@" ; do
    if [[ $var == '-h' || $var == '--help' || $var == '-?' ]] ; then
        show_help
        exit 0
    elif [[ $var == '-ni' ]] ; then
        non_interactive="Y"
    else
        echo "Unknown option: $var"
        show_help
        exit 1
    fi
done


function found_exe() {
    hash "$1" 2>/dev/null
}

if found_exe tput ; then
    if [[ $(tput colors) != "-1" ]]; then
        # Get some colors we can use to spice up messages!
        GREEN=$(tput setaf 2)
        BLUE=$(tput setaf 4)
        CYAN=$(tput setaf 6)
        YELLOW=$(tput setaf 3)
        RESET=$(tput sgr0)
        HIGHLIGHT=$YELLOW
    fi
fi

function get_YN() {  # helper function for interactive questions
    if [[ $non_interactive == "Y" ]] ; then
        return 0  # Answer "Yes" automatically
    fi

    if [[ -z "$1" ]] ; then
        prompt="Choice"
    else
        prompt="$1"
    fi

    if [[ -z "$2" ]] ; then
        yes_msg="Yes"
    else
        yes_msg="$2"
    fi

    if [[ -z "$3" ]] ; then
        no_msg="No"
    else
        no_msg="$3"
    fi

    # Loop until the user hits the Y or the N key
    echo -e -n "${prompt} [${CYAN}Y${RESET}/${CYAN}N${RESET}]: "
    while true; do
        if [[ "$OSTYPE" == "darwin"* ]] ; then
            read key
        else
            read -N1 -s key
        fi
        case $key in
        [Yy])
            echo "${HIGHLIGHT}$key - ${yes_msg}${RESET}"
            return 0
            ;;
        [Nn])
            echo "${HIGHLIGHT}$key - ${no_msg}${RESET}"
            return 1
            ;;
        esac
        if [[ "$OSTYPE" == "darwin"* ]] ; then
            echo -e -n "${prompt} [${CYAN}Y${RESET}/${CYAN}N${RESET}]: "
        fi
    done
}

###############################################################################
## Main setup

if [[ "$OSTYPE" == "darwin"* ]] ; then
    if ! found_exe brew ; then
        echo "${YELLOW}Homebrew is required to install dependencies: https://docs.brew.sh/Installation${RESET}"
        exit 1
    fi
fi

# Need Node.js (8.3 or newer)
#TODO: Check nodejs version? (nodejs --version)
if ! found_exe nodejs ; then
    if ! found_exe node ; then
        echo "${BLUE}Installing Node.js v13.x...${RESET}"
        if [[ "$OSTYPE" == "darwin"* ]] ; then
            brew install node
        else
            sudo apt-get install -y nodejs
            if ! found_exe nodejs ; then
              curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
            fi
        fi
        echo "${GREEN}Node.js installed!${RESET}"
    fi
fi


# Need JDK (v8 or newer)
# TODO: Check java version (java -version)
if ! found_exe java ; then
    echo "${BLUE}Installing AdoptOpenJDK...${RESET}"

    # Add GPG key
    wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | sudo apt-key add -
    sudo add-apt-repository --yes https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/

    # Import repo
    sudo apt-get install -y software-properties-common
    sudo add-apt-repository --yes https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/
    sudo apt-get update

    # Install
    sudo apt-get -y install adoptopenjdk-8-hotspot
    echo "${GREEN}AdoptOpenJDK installed!${RESET}"
fi


# Need Android Studio (interactive for now)
if ! found_exe android-studio ; then

    echo "Building for Android requires Android Studio.  Would you like to see Android Studio instructions?"
    if get_YN "" "" "Skipping" ; then

        echo "${YELLOW}Install Android Studio from https://developer.android.com/studio/index.html${RESET}"
        echo "You can also use your software store to install."
        echo "${BLUE}Press RETURN after completing this step.${RESET}"
        read

        # Need Android 9 (Pie) SDK
        echo "We need the Android 9 (Pie) SDK.  Please follow these steps:"
        echo "1) Open Android Studio"
        echo "2) At bottom of the 'Welcome to Android Studio' screen click on Configure > SDK Manager"
        echo "   NOTE: You might need to close and reopent Android Studio the first time to see this."
        echo "   * Under the SDK Platforms tab, click Show Package Details"
        echo "   * Expand the 'Android 9.0 (Pie)' entry"
        echo "     - Check: Android SDK Platform 29"
        echo "     - Check: Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image"
        echo "   * Under the SDK Tools tab, check 'Show Package Details'"
        echo "   * Expand the 'Android SDK Build-Tools' entry"
        echo "     - Check: 28.0.3"
        echo "   * Press Apply button, then OK and agree to terms to download necessary pieces."
        echo "   * Press Finish button, then OK button after downloads complete."
        echo ""
        echo "${BLUE}Press RETURN after completing these steps.${RESET}"

        echo "${BLUE}Adding environment variables to ${YELLOW}~/.profile_mobileapp${RESET}"

        echo "# ==== Added by PrivateKit/mobileapp's dev_setup.sh ====" > ~/.profile_mobileapp
        if [[ "$OSTYPE" == "darwin"* ]] ; then
            echo "export ANDROID_SDK_ROOT=\$HOME/Library/Android/sdk" >> ~/.profile_mobileapp
        else
            echo "export ANDROID_SDK_ROOT=\$HOME/Android/Sdk" >> ~/.profile_mobileapp
        fi
        echo "export PATH=\$PATH:\$ANDROID_SDK_ROOT/emulator" >> ~/.profile_mobileapp
        echo "export PATH=\$PATH:\$ANDROID_SDK_ROOT/tools" >> ~/.profile_mobileapp
        echo "export PATH=\$PATH:\$ANDROID_SDK_ROOT/tools/bin" >> ~/.profile_mobileapp
        echo "export PATH=\$PATH:\$ANDROID_SDK_ROOT/platform-tools" >> ~/.profile_mobileapp

        echo "Would you like to source environment variables in ${YELLOW}~/.profile${RESET}?"
        if get_YN "" "" "Skipping" ; then
            echo "source ~/.profile_mobileapp" >> ~/.profile
        fi

        echo "${GREEN}Android Studio installed!${RESET}"
        echo "${YELLOW}You will need to start a new terminal session for this to apply.${RESET}"
    fi
fi


# Need Watchman v4.9+ (watchman --version)
if [[ "$OSTYPE" == "darwin"* ]] ; then
    if ! found_exe watchman ; then
        echo "Updating homebrew..."
        brew update && brew upgrade
        echo "${BLUE}Installing Watchman, this is going to take a little bit...${RESET}"
        brew install watchman

        # TODO: Is this needed? on which environments?
        # Then increase the amount of inotify user instances, user watches and queued events
        # echo fs.inotify.max_user_instances=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
        # echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
        # echo fs.inotify.max_queued_events=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
    fi
fi


if ! found_exe react-native ; then
    echo "${BLUE}Installing React Native tool...${RESET}"
    sudo npm install -g react-native-cli
    npm install
    echo "${GREEN}React Native tools installed!${RESET}"
fi


echo "${GREEN}You are now ready to go!${RESET}"
echo
echo "Try this to get started:"
echo
echo "  Run Android Studio then:"
echo "    * Select 'Configure > AVD Manager' at the bottom"
echo "    * Create and run a virtual device, such as a Pixel 2"
echo
echo "  Configure Android environment in your ~/.bashrc (or equivalent):"
echo "    source ~/.profile_mobileapp"
echo
echo "  In a terminal run:"
echo "      $ ./1_start_react.sh"
echo "  In a second terminal:"
echo "      $ ./2_start_android_app.sh"
echo "  You can edit files and repeat step 2 again as necessary to debug."
