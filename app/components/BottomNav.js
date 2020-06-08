import React, { useState, useEffect } from 'react';
import * as NavIcons from '../assets/svgs/BottomNav';
import { Theme } from '../constants/themes';
import Colors from '../constants/colors';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Typography } from '.';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isGPS } from '../COVIDSafePathsConfig';
import { useTranslation } from 'react-i18next';
import LocationService from '../services/LocationService';

const NavIconButton = ({ icons, label, screens, hasNotifications }) => {
  const [hasExposure, setHasExposure] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const isActive =
    screens.primary === route.name || screens.children.includes(route.name);

  const icon = icons[isActive ? 'active' : 'inactive'];

  useEffect(() => {
    const checkForExposure = async () => {
      setHasExposure(await LocationService.getHasPotentialExposure());
    };

    // The History nav icon is the only element that needs to check for exposure
    // and create a notification element if the user has been exposed.
    if (screens.primary === 'ExposureHistoryScreen') {
      checkForExposure();
    }
  });

  return (
    <Theme use={isActive ? 'violet' : 'default'}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(screens.primary);
        }}
        style={
          hasNotifications
            ? [styles.navIconRoot, { paddingBottom: 7 }]
            : styles.navIconRoot
        }>
        {hasExposure && (
          <SvgXml
            xml={NavIcons.NotificationIcon}
            width={8}
            height={8}
            style={styles.notificationIcon}
          />
        )}
        <SvgXml xml={icon} width={24} height={24} />
        <Typography use='Body1'>{label}</Typography>
      </TouchableOpacity>
    </Theme>
  );
};

export const BottomNav = () => {
  const { t } = useTranslation();

  const HistoryNav = {
    icons: {
      active: NavIcons.HistoryActive,
      inactive: NavIcons.HistoryInactive,
    },
    label: t('navigation.history'),
    screens: { primary: 'ExposureHistoryScreen', children: [] },
  };

  const HomeNav = {
    icons: { active: NavIcons.HomeActive, inactive: NavIcons.HomeInactive },
    label: t('navigation.home'),
    screens: { primary: 'Main', children: [] },
  };

  const LocationsNav = {
    icons: {
      active: NavIcons.LocationsActive,
      inactive: NavIcons.LocationsInactive,
    },
    label: t('navigation.locations'),
    screens: { primary: 'ExportScreen', children: [] }, // TODO: Determine if this is correct
  };

  const MoreNav = {
    icons: { active: NavIcons.MoreActive, inactive: NavIcons.MoreInactive },
    label: t('navigation.more'),
    screens: {
      primary: 'SettingsScreen',
      children: ['AboutScreen', 'LicensesScreen', 'FeatureFlagsScreen'],
    },
  };

  const PartnersNav = {
    icons: {
      active: NavIcons.PartnersActive,
      inactive: NavIcons.PartnersInactive,
    },
    label: t('navigation.partners'),
    screens: { primary: 'ChooseProviderScreen', children: [] },
  };

  const gpsNavIcons = [HomeNav, HistoryNav, LocationsNav, PartnersNav, MoreNav];

  // Excludes `LocationsNav`
  const bteNavIcons = [HomeNav, HistoryNav, PartnersNav, MoreNav];

  const navIconButtons = isGPS ? gpsNavIcons : bteNavIcons;

  return (
    <View style={styles.navRoot}>
      {navIconButtons.map((navIconButton) => (
        <NavIconButton key={navIconButton.label} {...navIconButton} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navRoot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: Colors.VIOLET_TEXT_DARK,
  },
  navIconRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  notificationIcon: {
    top: 3,
    left: 18,
  },
});
