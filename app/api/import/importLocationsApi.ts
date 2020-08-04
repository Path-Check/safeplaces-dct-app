import Joi from '@hapi/joi';
const MockData = Joi.array()
  .items(
    Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      time: Joi.number().required(),
      hashes: Joi.array()
        .items(Joi.string().required())
        .min(2)
        .max(20)
        .required(),
    }),
  )
  .required();

const importLocationsApi = async (
  jsonURL: string,
): Promise<{ valid: boolean }> => {
  const res = await fetch(jsonURL);
  const success = res.status === 200;

  if (!success) {
    throw new Error(
      `Import Location API failed with status code: ${res.status}`,
    );
  }

  const mockData = await res.json();
  const { error, value } = await MockData.validate(mockData);
  if (error) throw error;
  return value;
};

export default importLocationsApi;
