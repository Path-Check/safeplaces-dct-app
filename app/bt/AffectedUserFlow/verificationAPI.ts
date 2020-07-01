import Config from 'react-native-config';
import * as Sentry from '@sentry/react-native';

const baseUrl =
  Config.GAEN_VERIFY_URL || 'https://api.gaen.extremesolution.com';
const verifyUrl = `${baseUrl}/api/verify`;
const certificateUrl = `${baseUrl}/api/certificate`;

const apiKey =
  Config.GAEN_VERIFY_API_TOKEN ||
  'VfgDO2Qy0YI/hhU1CbFt2wu2QOJjFtr9V9dbOiMSFpzeR4RXEfKR+DnRoLuSBCvzR6vSbXPQAtZrdfjAo6SYVg';

const defaultHeaders = {
  'content-type': 'application/json',
  accept: 'application/json',
  'X-API-Key': apiKey,
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
  | 'Unknown';

interface VerifiedCodeResponse {
  error: string;
  testDate: string;
  testType: string;
  token: Token;
}

export const postVerificationCode = async (
  code: string,
): Promise<NetworkResponse<CodeVerificationSuccess, CodeVerificationError>> => {
  const data = {
    code,
  };

  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (response.ok) {
      const body: VerifiedCodeResponse = {
        error: json.error,
        testDate: json.testdate,
        testType: json.testtype,
        token: json.token,
      };
      return { kind: 'success', body };
    } else {
      Sentry.captureMessage(`url: ${Config.GAEN_VERIFY_URL} ${json.error}`);
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
    Sentry.captureMessage(`url: ${Config.GAEN_VERIFY_URL} ${e}`);
    throw new Error(e);
  }
};

type VerificationTokenSuccess = 'Success';

type VerificationTokenFailure = 'InvalidToken' | 'Unknown';

export const postVerificationToken = async (
  token: Token,
): Promise<
  NetworkResponse<VerificationTokenSuccess, VerificationTokenFailure>
> => {
  const hmac = 'asdf';
  const data = {
    token,
    ekeyhmac: hmac,
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
