const fs = require('fs');

function copyFile(source, target, cb) {
  let cbCalled = false;

  const rd = fs.createReadStream(source);
  rd.on('error', err => {
    done(err);
  });
  const wr = fs.createWriteStream(target);
  wr.on('error', err => {
    done(err);
  });
  wr.on('close', () => {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

copyFile(
  './scripts/node-modules/react-native-background-geolocation/DistanceFilterLocationProvider.java',
  './node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/tenforwardconsulting/bgloc/DistanceFilterLocationProvider.java',
  () => {},
);
copyFile(
  './scripts/node-modules/react-native-background-geolocation/BackgroundGeolocationModule.java',
  './node_modules/@mauron85/react-native-background-geolocation/android/lib/src/main/java/com/marianhello/bgloc/react/BackgroundGeolocationModule.java',
  () => {},
);
copyFile(
  './scripts/node-modules/react-native-background-geolocation/BootCompletedReceiver.java',
  './node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/BootCompletedReceiver.java',
  () => {},
);
copyFile(
  './scripts/node-modules/react-native-background-geolocation/LocationManager.java',
  './node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/LocationManager.java',
  () => {},
);

copyFile(
  './scripts/node-modules/react-native-background-geolocation/BackgroundGeolocationFacade.java',
  './node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/BackgroundGeolocationFacade.java',
  () => {},
);
copyFile(
  './scripts/node-modules/react-native-background-geolocation/LocationServiceImpl.java',
  './node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/service/LocationServiceImpl.java',
  () => {},
);
