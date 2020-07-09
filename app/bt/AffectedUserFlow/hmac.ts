import RNSimpleCrypto from 'react-native-simple-crypto';

type Posix = number;

export interface ExposureKey {
  key: string;
  rollingPeriodStart: Posix;
  rollingPeriodCount: number;
  transmissionRisk: number;
}

const serializeExposureKey = ({
  key,
  rollingPeriodStart,
  rollingPeriodCount,
  transmissionRisk,
}: ExposureKey): string => {
  return [key, rollingPeriodStart, rollingPeriodCount, transmissionRisk].join(
    '.',
  );
};

export const calculateHmac = async (
  exposureKeys: ExposureKey[],
  hmacKey: string,
): Promise<string> => {
  const serializedKeys = exposureKeys.map(serializeExposureKey).join(',');
  const messageArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(
    serializedKeys,
  );

  const hmacKeyArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(
    hmacKey,
  );

  const signatureArrayBuffer = await RNSimpleCrypto.HMAC.hmac256(
    messageArrayBuffer,
    hmacKeyArrayBuffer,
  );

  console.log('------------------------');
  console.log('------------------------');
  console.log('------------------------');
  console.log('------------------------');
  console.log('------------------------');
  console.log('signatureArraryBuffer', signatureArrayBuffer);
  console.log('------------------------');
  console.log('------------------------');
  console.log('------------------------');
  console.log('------------------------');
  console.log('------------------------');

  const hmac = RNSimpleCrypto.utils.convertArrayBufferToBase64(
    signatureArrayBuffer,
  );

  console.log('------------------------');
  console.log('------------------------');
  console.log('------------------------');
  console.log('------------------------');
  console.log('HMAC Base64', hmac);
  console.log('------------------------');
  console.log('------------------------');
  console.log('------------------------');
  console.log('------------------------');

  return hmac;
};

export const generateKey = (): string => {
  return 'asdf';
};
