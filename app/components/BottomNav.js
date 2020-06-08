import React from 'react';
import * as NavIcons from '../assets/svgs/BottomNav';
import { Theme } from '../constants/themes';
import Colors from '../constants/colors';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Typography } from './';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isGPS } from '../COVIDSafePathsConfig';

const HistoryNav = {
  icons: { active: NavIcons.HistoryActive, inactive: NavIcons.HistoryInactive },
  label: 'History',
  screen: 'ExposureHistoryScreen',
  hasNotifications: true,
};

const HomeNav = {
  icons: { active: NavIcons.HomeActive, inactive: NavIcons.HomeInactive },
  label: 'Home',
  screen: 'Main',
  hasNotifications: false,
};

const LocationsNav = {
  icons: {
    active: NavIcons.LocationsActive,
    inactive: NavIcons.LocationsInactive,
  },
  label: 'Locations',
  screen: 'ExportScreen', // TODO: Determine if this is correct
  hasNotifications: false,
};

const MoreNav = {
  icons: { active: NavIcons.MoreActive, inactive: NavIcons.MoreInactive },
  label: 'More',
  screen: 'SettingsScreen',
  hasNotifications: false,
};

const PartnersNav = {
  icons: {
    active: NavIcons.PartnersActive,
    inactive: NavIcons.PartnersInactive,
  },
  label: 'Partners',
  screen: 'ChooseProviderScreen',
  hasNotifications: false,
};

const NavIconButton = ({ icons, label, screen, hasNotifications }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = route.name === screen;

  const icon = icons[isActive ? 'active' : 'inactive'];

  // TODO: Can we use primary/secondary theming here?
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(screen);
      }}
      style={styles.navIconRoot}>
      {/* {hasNotifications && <Typography>*</Typography>} */}
      <SvgXml xml={icon} width={24} height={24} />
      <Typography
        use='Body1'
        style={isActive ? styles.labelActive : styles.labelInactive}>
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

export const BottomNav = () => {
  const gpsNavIcons = [HomeNav, HistoryNav, LocationsNav, PartnersNav, MoreNav];

  // Excludes `LocationsNav`
  const bteNavIcons = [HomeNav, HistoryNav, PartnersNav, MoreNav];

  const navIconButtons = isGPS ? gpsNavIcons : bteNavIcons;

  return (
    <Theme use='charcoal'>
      <View style={styles.navRoot}>
        {navIconButtons.map((navIconButton) => (
          <NavIconButton key={navIconButton.label} {...navIconButton} />
        ))}
      </View>
    </Theme>
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
  labelActive: {
    color: Colors.WHITE,
  },
  labelInactive: {
    color: Colors.DIVIDER,
  },
});
