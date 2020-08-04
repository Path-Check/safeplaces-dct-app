import { HealthcareAuthority } from '../../common/types';

const exportConsentApi = async (
  authority: HealthcareAuthority,
  consent: boolean,
  code: number,
): Promise<void> => {
  const endpoint = `${authority.public_api}/consent`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ consent, accessCode: code }),
  });
  const success = res.status === 200;
  if (!success) {
    throw new Error(
      `Export consent API failed with status code: ${res.status}`,
    );
  }
  return;
};

export default exportConsentApi;
