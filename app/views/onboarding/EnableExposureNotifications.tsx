import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import PermissionsContext from '../../bt/PermissionsContext';
import onboardingCompleteAction from '../../store/actions/onboardingCompleteAction';
import { useStatusBarEffect } from '../../navigation';
import DescriptionTemplate from '../../views/common/DescriptionTemplate';

import { Icons, Images } from '../../assets';
import { Colors } from '../../styles';

export const EnableExposureNotifications = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { exposureNotifications } = useContext(PermissionsContext);

  useStatusBarEffect('dark-content');

  const dispatchOnboardingComplete = () => {
    dispatch(onboardingCompleteAction());
  };

  const headerText = t('label.launch_exposure_notif_header');
  const bodyText = t('label.launch_exposure_notif_subheader');
  const buttonLabel = t('label.launch_enable_exposure_notif');
  const disableButtonLabel = t('label.launch_disable_exposure_notif');

  const handleOnPressEnable = () => {
    exposureNotifications.request();
    dispatchOnboardingComplete();
  };

  const handleOnPressDontEnable = () => {
    dispatchOnboardingComplete();
  };

  const descriptionTemplateContent = {
    backgroundImage: Images.BlueGradientBackground,
    icon: Icons.ExposureIcon,
    header: headerText,
    body: bodyText,
    primaryButtonLabel: buttonLabel,
    secondaryButtonLabel: disableButtonLabel,
  };

  const descriptionTemplateStyles = {
    headerStyle: styles.header,
    bodyStyle: styles.body,
  };

  const descriptionTemplateActions = {
    primaryButtonOnPress: handleOnPressEnable,
    secondaryButtonOnPress: handleOnPressDontEnable,
  };

  return (
    <DescriptionTemplate
      descriptionTemplateContent={descriptionTemplateContent}
      descriptionTemplateStyles={descriptionTemplateStyles}
      descriptionTemplateActions={descriptionTemplateActions}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    color: Colors.white,
  },
  body: {
    color: Colors.white,
  },
});
