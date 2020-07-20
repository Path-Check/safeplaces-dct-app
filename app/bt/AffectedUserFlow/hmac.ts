import RNSimpleCrypto from 'react-native-simple-crypto';

import { ExposureKey } from './exposureKey';

export const generateKey = async (): Promise<ArrayBuffer> => {
  return await RNSimpleCrypto.utils.randomBytes(32);
};

export const arrayBufferToString = (arrayBuffer: ArrayBuffer): string => {
  return RNSimpleCrypto.utils.convertArrayBufferToUtf8(arrayBuffer);
};

export const calculateHmac = async (
  exposureKeys: ExposureKey[],
): Promise<[string, string]> => {
  const exposureKeyMessage = serializeKeys(exposureKeys);

  const messageArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(
    exposureKeyMessage,
  );

  const hmacKey = await generateKey();

  const signatureArrayBuffer = await RNSimpleCrypto.HMAC.hmac256(
    messageArrayBuffer,
    hmacKey,
  );

  return [
    RNSimpleCrypto.utils.convertArrayBufferToBase64(signatureArrayBuffer),
    RNSimpleCrypto.utils.convertArrayBufferToBase64(hmacKey),
  ];
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
