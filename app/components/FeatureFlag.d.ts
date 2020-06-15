import { FeatureFlag as featureFlag } from './FeatureFlag';

export const FeatureFlag: (
  props: Record<string, unknown>,
) => JSX.Element = featureFlag;
