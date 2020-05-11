import { database, auth } from '../utils/firebase';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const getToken = async () => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      //Failed to get push token for push notification!
      return null;
    }
    return await Notifications.getExpoPushTokenAsync();
  } else {
    alert('Must use physical device for Push Notifications');
  }
};

export default setExpoNotificationToken = async () => {
  const token = await getToken();
  if (token) {
    const { user } = await auth.signInAnonymously();
    const data = await database
      .ref()
      .child('users')
      .child(user.uid)
      .once('value');
    const exist = !!data && data.tokenId === token;
    const newData = {
      tokenId: token,
      timestamp: new Date(),
    };

    if (!!exist) {
      database.ref().child('users').child(user.uid).set(newData);
    } else {
      database.ref().child('users').child(user.uid).update(newData);
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  }
};
