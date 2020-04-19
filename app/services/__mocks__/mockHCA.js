import Yaml from 'js-yaml';

/**
 * Note: Because we are mocking the `readFile` method of RNFetchBlob,
 * we are exporting the YAML config as the string that would be returned
 * from `readFile`.
 */
export const validYaml = `
Authorities:
  - Test Authority:
      - {
          url: "https://raw.githack.com/tripleblindmarket/safe-places/develop/examples/safe-paths.json",
        }
      - bounds:
          {
            "ne": { "latitude": 36.42025904738132, "longitude": -121.93670068664551 },
            "sw": { "latitude": 38.29988330010084, "longitude": -123.2516993133545 },
          }
`;

export const invalidYamlWithoutBounds = `
Authorities:
  - Test Authority:
      - {
          url: "https://raw.githack.com/tripleblindmarket/safe-places/develop/examples/safe-paths.json",
        }
`;

export const invalidYamlWithoutUrl = `
Authorities:
  - Test Authority:
      - bounds:
          {
            "ne": { "latitude": 36.42025904738132, "longitude": -121.93670068664551 },
            "sw": { "latitude": 38.29988330010084, "longitude": -123.2516993133545 },
          }
`;

export const validParsed = Yaml.safeLoad(validYaml).Authorities;

export const invalidParsedNoBounds = Yaml.safeLoad(invalidYamlWithoutBounds)
  .Authorities;

export const invalidParsedNoUrl = Yaml.safeLoad(invalidYamlWithoutUrl)
  .Authorities;
