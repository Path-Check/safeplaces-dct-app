import Yaml from 'js-yaml';
import { AUTHORITIES_LIST_URL_MVP1 } from '../../constants/authorities';

type Coordinates = {
  latitude: number;
  longitude: number;
};

// From API
export type HealthcareAuthority = {
  name: string;
  bounds: {
    ne: Coordinates;
    sw: Coordinates;
  };
  ingest_url: string;
  publish_url: string;
  cursor_url: string;
};

const getHealthcareAuthoritiesApi = async (): Promise<
  HealthcareAuthority[]
> => {
  const yamlString = await fetch(AUTHORITIES_LIST_URL_MVP1).then((res) =>
    res.text(),
  );
  const { authorities } = Yaml.safeLoad(yamlString);
  if (!Array.isArray(authorities)) {
    throw new Error('authorities yaml did not return an array of authorities');
  }
  return authorities;
};

export default getHealthcareAuthoritiesApi;
