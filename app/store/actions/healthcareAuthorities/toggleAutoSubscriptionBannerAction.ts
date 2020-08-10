import { createAction } from '@reduxjs/toolkit';

const TOGGLE_AUTO_SUBSCRIPTION_BANNER = 'TOGGLE_AUTO_SUBSCRIPTION_BANNER';

/**
 * Enables / disables the auto-subscription banner from being shown
 */
const toggleAutoSubscriptionBannerAction = createAction<{
  overrideValue: boolean;
}>(TOGGLE_AUTO_SUBSCRIPTION_BANNER);

export default toggleAutoSubscriptionBannerAction;
