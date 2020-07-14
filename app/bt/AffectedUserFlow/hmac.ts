import RNSimpleCrypto from 'react-native-simple-crypto';

import { ExposureKey } from './exposureKey';

export const generateKey = async (): Promise<string> => {
  const arrayBuffer = await RNSimpleCrypto.utils.randomBytes(32);
  return arrayBufferToString(arrayBuffer);
};

export const arrayBufferToString = (arrayBuffer: ArrayBuffer): string => {
  return RNSimpleCrypto.utils.convertArrayBufferToUtf8(arrayBuffer);
};

export const calculateHmac = async (
  exposureKeys: ExposureKey[],
  keyHmac: string,
): Promise<string> => {
  const exposureKeyMessage = serializeKeys(exposureKeys);

  const messageArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(
    exposureKeyMessage,
  );

  const keyArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(keyHmac);

  const signatureArrayBuffer = await RNSimpleCrypto.HMAC.hmac256(
    messageArrayBuffer,
    keyArrayBuffer,
  );

  return RNSimpleCrypto.utils.convertArrayBufferToBase64(signatureArrayBuffer);
};

const serializeKeys = (exposureKeys: ExposureKey[]) => {
  return exposureKeys.map(serializeExposureKey).join(',');
};

const serializeExposureKey = ({
  key,
  rollingPeriod,
  rollingStartNumber,
  transmissionRisk,
}: ExposureKey): string => {
  return [key, rollingPeriod, rollingStartNumber, transmissionRisk].join('.');
};
