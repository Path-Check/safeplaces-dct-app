import { useFlags } from '../services/hooks/useFlags';

/**
 *
 * Usage:
 *
 * ```
 * <FeatureFlag
 *  name="google_import"
 *  fallback={<Text>Old</Text>}
 * >
 *   <FeatureUi />
 * </FeatureFlag>
 * ```
 *
 * @param {{
 *   name: string;
 *   fallback?: import('react').ReactNode;
 *   children: import('react').ReactNode;
 * }} param0
 */
export const FeatureFlag = ({ name, children, fallback }) => {
  const [flags] = useFlags();
  const fallbackRender = fallback || null;

  return flags[name] ? children : fallbackRender;
};
