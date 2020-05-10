import { NativeModules } from 'react-native';

export const isValidCoordinates = (latitude, longitude) => {
  const isValid = num => {
    const regex = /^(-?\d+\.?\d*|\.\d+)$/;
    return typeof num === 'string' && regex.test(num);
  };
  return isValid(latitude) && isValid(longitude);
};

export const parseQRCodeUrl = url => {
  if (typeof url !== 'string' || url.search('safepaths://qr/') !== 0) {
    return {};
  }
  const split1 = url.split('/qr/');
  const split2 = split1 && split1.length === 2 && split1[1].split('/');
  const latitude = (split2 && split2.length === 2 && split2[0]) || undefined;
  const longitude = (split2 && split2.length === 2 && split2[1]) || undefined;
  return { latitude, longitude };
};

export const saveLocation = async location => {
  await NativeModules.SecureStorageManager.importGoogleLocations([location]);
};
