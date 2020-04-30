import React from 'react';

import { Flag } from '../helpers/flags';

/**
 * Small wrapper around `<Flag />` which makes the default case easier:
 *
 * Usage:
 *
 * ```
 * <Feature name="google_import" fallback={() => <hr />}>
 *   <FeatureUi />
 * </Feature>
 * ```
 *
 * @param {{
 *   name: string;
 *   fallback?: () => import('react').ReactNode;
 *   children: import('react').ReactNode;
 * }} param0
 */
export const Feature = ({ name, fallback, children }) => {
  const keyPath = name.split('.');

  return (
    <Flag name={keyPath} render={() => children} fallbackRender={fallback} />
  );
};
