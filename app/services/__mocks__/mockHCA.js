import Yaml from 'js-yaml';

/**
 * Note: Because we are mocking the `readFile` method of RNFetchBlob,
 * we are exporting the YAML config as the string that would be returned
 * from `readFile`.
 */
export const mockValidHCAYaml = `
# Below is the global registry of health authorities for Safe Places.
# Any organization can declare itself a health authority, just enter a PR and it will be merged into the registry.
# A health authority must host a file created by the Safe Paths publisher tool at the url provided.

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
  - Mairie de PAP/MSSP:
      - { url: "https://vault.tripleblind.app/safe_path/5673742378205184/" }
`;

export const mockValidHCAList = Yaml.safeLoad(mockValidHCAYaml).Authorities;
