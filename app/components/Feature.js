import { useFlags } from '../helpers/flags';

/**
 *
 * Usage:
 *
 * ```
 * <FeatureFlag name="google_import">
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
