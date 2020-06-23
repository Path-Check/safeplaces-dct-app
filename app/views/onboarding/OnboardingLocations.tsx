import React, { useContext } from 'react';
import PermissionsContext, {
  PermissionStatus,
} from '../../gps/PermissionsContext';

import { Icons, Images } from '../../assets';

import OnboardingTemplate from './OnboardingTemplate';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import onboardingCompleteAction from '../../store/actions/onboardingCompleteAction';
import { SetStoreData } from '../../helpers/General';
import { PARTICIPATE } from '../../constants/storage';

const OnboardingLocations = (): JSX.Element => {
  const { authSubscription, location } = useContext(PermissionsContext);
  const requestLocationAccess = async () => {
    await location.request();
    await authSubscription.request();
    completeOnboarding();
  };

  const dispatch = useDispatch();
  const completeOnboarding = () => {
    const storeData = location.status === PermissionStatus.GRANTED;
    SetStoreData(PARTICIPATE, JSON.stringify(storeData));
    dispatch(onboardingCompleteAction());
  };

  const { t } = useTranslation();

  return (
    <OnboardingTemplate
      background={Images.LaunchScreenBackground}
      theme={'dark'}
      iconXml={Icons.LocationPin}
      title={t('onboarding.location_header')}
      body={t('onboarding.location_subheader')}
      primaryButtonLabel={t('label.launch_allow_location')}
      primaryButtonOnPress={requestLocationAccess}
      secondaryButtonLabel={t('onboarding.maybe_later')}
      secondaryButtonOnPress={completeOnboarding}
    />
  );
};

export default OnboardingLocations;
