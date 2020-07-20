import env from 'react-native-config';

const baseUrl = env.GAEN_VERIFY_URL;
const verifyUrl = `${baseUrl}/api/verify`;
const certificateUrl = `${baseUrl}/api/certificate`;

const defaultHeaders = {
  'content-type': 'application/json',
  accept: 'application/json',
  'X-API-Key': env.GAEN_VERIFY_API_TOKEN,
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

export const postCode = async (
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
      switch (json.error) {
        case 'internal server error':
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

interface TokenVerificationResponse {
  certificate: Token;
  error: string;
}

type TokenVerificationSuccess = TokenVerificationResponse;

export type TokenVerificationError = 'TokenMetaDataMismatch' | 'Unknown';

export const postTokenAndHmac = async (
  token: Token,
  hmacDigest: string,
): Promise<
  NetworkResponse<TokenVerificationSuccess, TokenVerificationError>
> => {
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
      const body = {
        certificate: json.certificate,
        error: json.error,
      };
      return { kind: 'success', body };
    } else {
      switch (json.error) {
        case 'token metadata mismatch': {
          return { kind: 'failure', error: 'TokenMetaDataMismatch' };
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
