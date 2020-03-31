@echo off
goto check_Permissions

:check_Permissions
echo ---------------------------------------
echo Private-kit - Windows development setup
echo ---------------------------------------
net session >nul 2>&1
if %errorLevel% NEQ 0 (
  echo Admin permissions needed. Please run as administrator.
  pause
  exit
) 
  
@echo off
where /q choco 
if %errorLevel% == 0 (	
  goto tools_setup	
) 
 
echo This setup script is based on Chocolatey, and it's not installed.
echo To install it, press SPACE to open a Powershell window and paste this command there:
echo.
echo Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
echo.
echo.
pause > nul
start powershell
echo.
echo When the Chocolatey installation completes, close the Powershell window and run this batch file again.
echo.
pause
exit 
  
:tools_setup
echo.
echo These tools will be installed through through Chocolatey:
echo   * Adopt Open JDK 8
echo   * Android Studio
echo   * NodeJS
echo   * Python 2
echo   * Yarn
echo.
echo Press SPACE to continue, or abort the execution and edit the script to customize your installation.
pause > nul
echo.
choco install adoptopenjdk8 androidstudio nodejs.install python2 yarn -y
echo.
call RefreshEnv.cmd
cls
echo.
echo We need the Android 9 (Pie) SDK.  Please follow these steps:
echo 1) Open Android Studio
echo 2) At bottom of the 'Welcome to Android Studio' screen click on Configure ^> SDK Manager
echo    NOTE: You might need to close and reopent Android Studio the first time to see this.
echo    * Under the SDK Platforms tab, click Show Package Details
echo    * Expand the 'Android 9.0 (Pie)' entry
echo      - Check: Android SDK Platform 29
echo      - Check: Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image
echo    * Under the SDK Tools tab, check 'Show Package Details'
echo    * Expand the 'Android SDK Build-Tools' entry
echo      - Check: 28.0.3
echo    * Press Apply button, then OK and agree to terms to download necessary pieces.
echo    * Press Finish button, then OK button after downloads complete. 
echo.
echo When you are done with the Android tools setup, press SPACE to continue.
echo.
pause > nul
call RefreshEnv.cmd
cls
echo.
echo Please set/adjust these environment variables in your system settings before building/running:
echo  - ANDROID_HOME should point to the root of the Android SDK, probably %LOCALAPPDATA%\Android\Sdk
echo  - PATH must be edited to include these entries:
echo      %%ANDROID_HOME%%\tools
echo      %%ANDROID_HOME%%\platform-tools
echo      %%ANDROID_HOME%%\platform-tools\bin
echo      %%ANDROID_HOME%%\emulator
echo.
echo When you are done with the environment variables setup, press SPACE to continue.
echo.
pause > nul
call RefreshEnv.cmd
cls
echo.
echo React Native will now be installed.
echo Press SPACE to continue.
pause > nul
echo.
cmd /c npm install -g react-native-cli
cmd /c npm install
echo.
echo.
echo Press SPACE to continue.
pause > nul
cls
echo.
echo All set! Try this to get started:
echo.
echo   Run Android Studio then:
echo     * Select 'Configure ^> AVD Manager' at the bottom
echo     * Create and run a virtual device, such as a Pixel 2
echo.
echo   In a terminal run:
echo       > 1_start_react.bat
echo   In a second terminal:
echo       > 2_start_android_app.bat
echo   You can edit files and repeat step 2 again as necessary to debug.
echo.
echo   Remember that you need to set your API Key for the Google Maps SDK, refer to README.md for details
echo.
pause

