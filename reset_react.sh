rm -rf node_modules
rm package-lock.json
rm yarn.lock
rm -rf ios/Pods
rm ios/Podfile.lock

yarn install
cd ios
pod install
cd ..

