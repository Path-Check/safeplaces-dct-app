import { HealthcareAuthority } from '../../common/types';

export type Configuration = {
  name: string;
  infoWebsiteUrl: string;
  privacyPolicyUrl: string;
  referenceWebsiteUrl: string;
  notificationThresholdPercent: number;
  notificationThresholdCount: number;
  // The following is commented out because currently the staging server
  // does not return a valid cursor link at the moment.
  // Instead, we are defining this in the yaml for now (as of v1.0.1 of yaml)

  // apiEndpointUrl: string; // Where cursor is hosted
};

const getConfigurationApi = async (
  healthcareAuthority: HealthcareAuthority,
): Promise<Configuration> => {
  const endpoint = `${healthcareAuthority.public_api}/organization/configuration?id=${healthcareAuthority.org_id}`;
  return await fetch(endpoint).then((res) => res.json());
};

export default getConfigurationApi;
