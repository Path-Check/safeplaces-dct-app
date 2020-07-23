import Yaml from 'js-yaml';
import env from 'react-native-config';
import {
  HealthcareAuthority,
  ApiHealthcareAuthority,
} from '../../common/types';

const { AUTHORITIES_YAML_ROUTE } = env;

const getHealthcareAuthoritiesApi = async (
  yamlUrl: string = AUTHORITIES_YAML_ROUTE,
): Promise<HealthcareAuthority[]> => {
  const yamlString = await fetch(yamlUrl).then((res) => res.text());
  const record: Record<string, unknown> = Yaml.safeLoad(yamlString);
  let authorities = record.authorities;
  if (authorities === null) authorities = [];
  if (!Array.isArray(authorities)) {
    throw new Error('authorities yaml did not return an array of authorities');
  }
  return authorities.map((ha: ApiHealthcareAuthority) => ({
    ...ha,
    // HAs have public facing Ids in the yaml. We construct a unique identifier
    // based on the base route and the org. This guarantees uniqueness.
    internal_id: `api:${ha.public_api}|org:${ha.org_id}`,
  }));
};

export default getHealthcareAuthoritiesApi;
