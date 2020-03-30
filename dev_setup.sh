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

# Need Node.js (8.3 or newer)
#TODO: Check nodejs version? (nodejs --version)
if ! found_exe nodejs ; then
    echo "${BLUE}Installing Node.js v13.x...${RESET}"
    curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "${GREEN}Node.js installed!${RESET}"
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

    echo "Building for Android requires Android Studio.  Would you like to install it?"
    if get_YN "" "" "Skipping" ; then

        echo "${YELLOW}Install Android Studio from https://developer.android.com/studio/index.html${RESET}"
        echo "You can also use your software store to install."
        echo "${BLUE}Press RETURN after completing this step.${RESET}"
        read

        if ! found_exe android-studio ; then
            echo "Not able to find Android Studio still, aborting."
            exit 1
        fi

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

        echo "${BLUE}Adding environment variables via ~/.profile_mobileapp${RESET}"

        echo "# ==== Added by PrivateKit/mobileapp's dev_setup.sh ====" >> ~/.profile_mobileapp
        echo "export ANDROID_HOME=\$HOME/Android/Sdk" >> ~/.profile_mobileapp
        echo "export PATH=\$PATH:\$ANDROID_HOME/emulator" >> ~/.profile_mobileapp
        echo "export PATH=\$PATH:\$ANDROID_HOME/tools" >> ~/.profile_mobileapp
        echo "export PATH=\$PATH:\$ANDROID_HOME/tools/bin" >> ~/.profile_mobileapp
        echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools" >> ~/.profile_mobileapp

        echo "source ~/.profile_mobileapp" >> ~/.profile

        echo "${GREEN}Android Studio installed!${RESET}"
        echo "${YELLOW}You will need to start a new terminal session for this to apply.${RESET}"
    fi
fi


# Need Watchman v4.9+ (watchman --version)
if ! found_exe watchman ; then
    echo "${BLUE}Installing Watchman, this is going to take a little bit...${RESET}"
    echo "${YELLOW}TODO: Watchman setup...is it necessary?${RESET}"

#    if ! found_exe brew ; then
#        # Use the linuxbrew system to install 'watchman'
#        sudo apt-get install linuxbrew-wrapper
#        export PATH="$HOME/.linuxbrew/bin:$PATH"
#        export MANPATH="$HOME/.linuxbrew/share/man:$MANPATH"
#        export INFOPATH="$HOME/.linuxbrew/share/info:$INFOPATH"
#    fi
#    brew update && brew upgrade
#
#    brew install --HEAD watchman
#
#    # Then increase the amount of inotify user instances, user watches and queued events
#    echo fs.inotify.max_user_instances=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
#    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
#    echo fs.inotify.max_queued_events=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p


# SSP: This is the source-code version that didn't quite work
#    pushd ~
#    git clone https://github.com/facebook/watchman.git
#    cd watchman/
#    git checkout v4.9.0
#    sudo apt-get install -y autoconf automake build-essential python-dev libtool m4
#    ./autogen.sh
#    ./configure --enable-lenient
#    make
#    sudo make install
#    popd # Return to where we were
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
echo "    * Create and run a virtula device, such as a Pixel 2"
echo
echo "  In a terminal run:"
echo "      $ ~/mobileapp/1_start_react.sh"
echo "  In a second terminal:"
echo "      $ ~/mobileapp/2_start_android_app.sh"
echo "  You can edit files and repeat step 2 again as necessary to debug."
