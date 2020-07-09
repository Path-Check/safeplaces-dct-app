import Config from 'react-native-config';

import { ExposureKey, calculateHmac, generateKey } from './hmac';

const baseUrl = Config.GAEN_VERIFY_URL;
const verifyUrl = `${baseUrl}/api/verify`;
const certificateUrl = `${baseUrl}/api/certificate`;

const defaultHeaders = {
  'content-type': 'application/json',
  accept: 'application/json',
  'X-API-Key': Config.GAEN_VERIFY_API_TOKEN,
};

export type Token = string;

interface NetworkSuccess<T> {
  kind: 'success';
  body: T;
}
interface NetworkFailure<U> {
  kind: 'failure';
  error: U;
}

export type NetworkResponse<T, U = 'Unknown'> =
  | NetworkSuccess<T>
  | NetworkFailure<U>;

type CodeVerificationSuccess = VerifiedCodeResponse;

export type CodeVerificationError =
  | 'InvalidCode'
  | 'VerificationCodeUsed'
  | 'InvalidVerificationUrl'
  | 'Unknown';

type TestType = 'confirmed' | 'likely';

interface VerifiedCodeResponse {
  error: string;
  testDate: string;
  testType: TestType;
  token: Token;
}

export const postVerificationCode = async (
  code: string,
): Promise<NetworkResponse<CodeVerificationSuccess, CodeVerificationError>> => {
  const data = {
    code,
  };

  console.log(verifyUrl);

  try {
    if (baseUrl === undefined) {
      return { kind: 'failure', error: 'InvalidVerificationUrl' };
    }
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });

    const json = await response.json();
    if (response.ok) {
      console.log('valid token json: ', json);
      const body: VerifiedCodeResponse = {
        error: json.error,
        testDate: json.testdate,
        testType: json.testtype,
        token: json.token,
      };
      return { kind: 'success', body };
    } else {
      switch (json.error) {
        case 'internal serer error':
          return { kind: 'failure', error: 'InvalidCode' };
        case 'verification code used':
          return { kind: 'failure', error: 'VerificationCodeUsed' };
        default:
          return { kind: 'failure', error: 'Unknown' };
      }
    }
  } catch (e) {
    return { kind: 'failure', error: 'Unknown' };
  }
};

type VerificationTokenSuccess = 'Success';

type VerificationTokenFailure = 'InvalidToken' | 'Unknown';

export const postVerificationToken = async (
  token: Token,
): Promise<
  NetworkResponse<VerificationTokenSuccess, VerificationTokenFailure>
> => {
  const hmacKey = generateKey();

  // const exposureKeys = await NativeModule.getExposureKeys();
  // const id = await NativeModule.persistHmacKey(hmacKey);

  const exposureKeys: ExposureKey[] = [
    {
      key: 'a',
      rollingPeriodStart: 2649312,
      rollingPeriodCount: 12,
      transmissionRisk: 2,
    },
    {
      key: 'b',
      rollingPeriodStart: 2649312,
      rollingPeriodCount: 12,
      transmissionRisk: 5,
    },
  ];

  console.log('======================');
  const hmacDigest = await calculateHmac(exposureKeys, hmacKey);
  console.log('hmacDigest', hmacDigest);

  const data = {
    token,
    ekeyhmac: hmacDigest,
  };

  try {
    const response = await fetch(certificateUrl, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });

    const json = await response.json();
    if (response.ok) {
      return { kind: 'success', body: 'Success' };
    } else {
      switch (json.error) {
        case 'invalid_token': {
          return { kind: 'failure', error: 'InvalidToken' };
        }
        default: {
          return { kind: 'failure', error: 'Unknown' };
        }
      }
    }
  } catch (e) {
    return { kind: 'failure', error: 'Unknown' };
  }
};
