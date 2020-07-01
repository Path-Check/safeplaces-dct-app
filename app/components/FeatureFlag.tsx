import { FeatureFlagOption } from '../store/types';
import type { RootState } from '../store/types';
import { useSelector } from 'react-redux';

type FeatureFlagProps = {
  children: JSX.Element;
  flag: FeatureFlagOption;
};

const FeatureFlag = ({
  children,
  flag,
}: FeatureFlagProps): JSX.Element | null => {
  const { flags: activeFlags, enableFlags } = useSelector(
    (state: RootState) => state.featureFlags,
  );

  const flagActive = activeFlags[flag];
  if (enableFlags && flagActive) {
    return children;
  }
  return null;
};

export default FeatureFlag;
