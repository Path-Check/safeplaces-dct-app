import { FeatureFlag as featureFlag } from './FeatureFlag';

type FeatureFlagName = 'google_import' | 'custom_url' | 'download_locally';

type FeatureFlagProps = {
  children: JSX.Element;
  name: FeatureFlagName;
  fallback?: JSX.Element;
};

export const FeatureFlag: (
  props: FeatureFlagProps,
) => JSX.Element = featureFlag;
