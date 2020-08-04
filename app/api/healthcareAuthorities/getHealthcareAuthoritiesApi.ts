import Yaml from 'js-yaml';
import env from 'react-native-config';
import {
  HealthcareAuthority,
  ApiHealthcareAuthority,
} from '../../common/types';
import Joi from '@hapi/joi';

const Coords = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});

const HaList = Joi.array().items(
  Joi.object({
    bounds: Joi.object({
      ne: Coords.required(),
      sw: Coords.required(),
    }),
    name: Joi.string().required(),
    org_id: Joi.string().required(),
    public_api: Joi.string().required(),
    cursor_url: Joi.string().required(),
  }).required(),
);

const Response = Joi.object({
  authorities: HaList.required(),
}).required();

const { AUTHORITIES_YAML_ROUTE } = env;

const getHealthcareAuthoritiesApi = async (
  yamlUrl: string = AUTHORITIES_YAML_ROUTE,
): Promise<HealthcareAuthority[]> => {
  const yamlString = await fetch(yamlUrl).then((res) => res.text());
  const { error, value } = await Response.validate(Yaml.safeLoad(yamlString));
  if (error) throw error;

  return value.authorities.map((ha: ApiHealthcareAuthority) => ({
    ...ha,
    // HAs have public facing Ids in the yaml. We construct a unique identifier
    // based on the base route and the org. This guarantees uniqueness.
    internal_id: `api:${ha.public_api}|org:${ha.org_id}`,
  }));
};

export default getHealthcareAuthoritiesApi;
