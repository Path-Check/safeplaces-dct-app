import { HealthcareAuthority } from '../../common/types';

// Concern Point should be defined outside of this module.
// Currently the concern point generation is done in JS, and the contract is changing.
type ConcernPoint = Record<string, unknown>;

const exportUploadApi = async (
  authority: HealthcareAuthority,
  concernPoints: ConcernPoint[],
  code: number,
): Promise<void> => {
  const endpoint = `${authority.public_api}/upload`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessCode: code, concernPoints }),
  });
  const success = res.status === 201;
  if (!success) {
    throw new Error(`Export Upload API failed with status code: ${res.status}`);
  }
  return;
};

export default exportUploadApi;
