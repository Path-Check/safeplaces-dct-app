# SafePaths.app

A digital privacy preserving solution to allow an individual to learn their own exposure and risks based on earlier contact with infected patients, reduce panic and prevent overwhelming the health care infrastructure. The idea is to send the user's GPS location homomorphically encrypted to a server and compare that information to others while not knowing when or where users were

## Behavior

1. Get consent to locally track location and send an encoded version online. 
2. Locally cache a minute-by-minute database of: ```	Time  |  GPS Lat  |  GPS Lon ```
3. Homomorphically encrypts each record and uploads to our server hourly. Result codes ```success, fail, success-with-notification```
3.1 When a success-with-notification is received, the server has a message to be retrieved and displayed to the user as an Alert.
4. There will be a button where the user can self-report if they are diagnosed as Infected. Record the timestamp when that is reported.
5. There will be an Opt Out to turn the tracking off.

# Development

This is a React Native app. 

## Requirements

* Git
* NodeJS
* Watchman
* React Native
* OpenJDK (for Android)
* XCode (for iOS)



# References

Website: http://SafePaths.app

