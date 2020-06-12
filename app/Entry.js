/* eslint-disable react/display-name */
import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';
import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import { Main } from './views/Main';
import { SettingsScreen } from './views/Settings';
import AboutScreen from './views/About';
import PartnersOverviewScreen from './views/Partners/PartnersOverview';
import PartnersEditScreen from './views/Partners/PartnersEdit';

import { LicensesScreen } from './views/Licenses';
import {
  ExportCodeInput,
  ExportComplete,
  ExportConfirmUpload,
  ExportStart,
  ExportLocationConsent,
  ExportPublishConsent,
  ExportSelectHA,
} from './views/Export';
import { ExposureHistoryScreen } from './views/ExposureHistory/ExposureHistory';
import Assessment from './views/assessment';
import NextSteps from './views/NextSteps';
import {
  EN_DEBUG_MENU_SCREEN_NAME,
  EN_LOCAL_DIAGNOSIS_KEYS_SCREEN_NAME,
  ENDebugMenu,
} from './views/Settings/ENDebugMenu';
import { ENLocalDiagnosisKeyScreen } from './views/Settings/ENLocalDiagnosisKeyScreen';
import { FeatureFlagsScreen } from './views/FeatureFlagToggles';
import ImportScreen from './views/Import';
import { EnableExposureNotifications } from './views/onboarding/EnableExposureNotifications';
import Onboarding1 from './views/onboarding/Onboarding1';
import Onboarding2 from './views/onboarding/Onboarding2';
import Onboarding3 from './views/onboarding/Onboarding3';
import Onboarding4 from './views/onboarding/Onboarding4';
import { OnboardingPermissions } from './views/onboarding/OnboardingPermissions';

import ExposureNotificationContext from './ExposureNotificationContext';
import isOnboardingCompleteSelector from './store/selectors/isOnboardingCompleteSelector';
import { isGPS } from './COVIDSafePathsConfig';
import * as Icons from './assets/svgs/TabBarNav';

import { Affordances, Colors, Spacing } from './styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const fade = ({ current }) => ({ cardStyle: { opacity: current.progress } });

const SCREEN_OPTIONS = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  cardStyle: {
    backgroundColor: 'transparent', // prevent white flash on Android
  },
  headerShown: false,
};

const ExportStack = () => (
  <Stack.Navigator
    mode='modal'
    screenOptions={{
      ...SCREEN_OPTIONS,
      cardStyleInterpolator: fade,
      gestureEnabled: false,
    }}>
    <Stack.Screen name='ExportSelectHA' component={ExportSelectHA} />
    <Stack.Screen name='ExportCodeInput' component={ExportCodeInput} />
    <Stack.Screen
      name='ExportLocationConsent'
      component={ExportLocationConsent}
    />
    <Stack.Screen
      name='ExportPublishConsent'
      component={ExportPublishConsent}
    />
    <Stack.Screen name='ExportConfirmUpload' component={ExportConfirmUpload} />
    <Stack.Screen name='ExportDone' component={ExportCodeInput} />
    <Stack.Screen name='ExportComplete' component={ExportComplete} />
  </Stack.Navigator>
);

const ExposureHistoryStack = ({ navigation }) => {
  const { observeExposures } = useContext(ExposureNotificationContext);
  useEffect(() => {
    const unsubscribeTabPress = navigation.addListener('tabPress', () => {
      observeExposures();
    });
    return unsubscribeTabPress;
  }, [navigation, observeExposures]);

  return (
    <Stack.Navigator
      mode='modal'
      screenOptions={{
        ...SCREEN_OPTIONS,
        cardStyleInterpolator: fade,
        gestureEnabled: false,
      }}>
      <Stack.Screen
        name='ExposureHistoryScreen'
        component={ExposureHistoryScreen}
      />
      <Stack.Screen name='NextStepsScreen' component={NextSteps} />
    </Stack.Navigator>
  );
};

const SelfAssessmentStack = () => (
  <Stack.Navigator
    mode='modal'
    screenOptions={{
      ...SCREEN_OPTIONS,
      cardStyleInterpolator: fade,
      gestureEnabled: false,
    }}>
    <Stack.Screen name='Assessment' component={Assessment} />
  </Stack.Navigator>
);

const MoreTabStack = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen name='SettingsScreen' component={SettingsScreen} />
    <Stack.Screen name='AboutScreen' component={AboutScreen} />
    <Stack.Screen name='LicensesScreen' component={LicensesScreen} />
    <Stack.Screen name='FeatureFlagsScreen' component={FeatureFlagsScreen} />
    <Stack.Screen name='ImportScreen' component={ImportScreen} />
    <Stack.Screen name={EN_DEBUG_MENU_SCREEN_NAME} component={ENDebugMenu} />
    <Stack.Screen
      name={EN_LOCAL_DIAGNOSIS_KEYS_SCREEN_NAME}
      component={ENLocalDiagnosisKeyScreen}
    />
  </Stack.Navigator>
);

const MainAppTabs = () => {
  const { t } = useTranslation();
  const { userHasNewExposure } = useContext(ExposureNotificationContext);

  const applyBadge = (icon) => {
    return (
      <>
        <View style={styles.iconBadge} />
        {icon}
      </>
    );
  };

  const styles = StyleSheet.create({
    iconBadge: {
      ...Affordances.iconBadge,
    },
  });

  return (
    <Tab.Navigator
      initialRouteName='Main'
      tabBarOptions={{
        showLabel: false,
        activeTintColor: Colors.white,
        inactiveTintColor: Colors.primaryViolet,
        style: {
          backgroundColor: Colors.violetTextDark,
          paddingTop: Spacing.small,
          borderTopColor: Colors.primaryViolet,
        },
      }}>
      <Tab.Screen
        name='Main'
        component={Main}
        options={{
          tabBarLabel: t('navigation.home'),
          tabBarIcon: ({ focused, size }) => (
            <SvgXml
              xml={focused ? Icons.HomeActive : Icons.HomeInactive}
              width={size}
              height={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name='ExposureHistoryStack'
        component={ExposureHistoryStack}
        options={{
          tabBarLabel: t('navigation.history'),
          tabBarIcon: ({ focused, size }) => {
            const tabIcon = (
              <SvgXml
                xml={focused ? Icons.HistoryActive : Icons.HistoryInactive}
                width={size}
                height={size}
              />
            );

            return !isGPS && userHasNewExposure ? applyBadge(tabIcon) : tabIcon;
          },
        }}
      />
      {isGPS && (
        <Tab.Screen
          name='ExportStart'
          component={ExportStart}
          options={{
            tabBarLabel: t('navigation.locations'),
            tabBarIcon: ({ focused, size }) => (
              <SvgXml
                xml={focused ? Icons.LocationsActive : Icons.LocationsInactive}
                width={size}
                height={size}
              />
            ),
          }}
        />
      )}
      {isGPS ? (
        <Tab.Screen
          name='Partners'
          component={PartnersStack}
          options={{
            tabBarLabel: t('navigation.partners'),
            tabBarIcon: ({ focused, size }) => (
              <SvgXml
                xml={focused ? Icons.PartnersActive : Icons.PartnersInactive}
                width={size}
                height={size}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name='SelfAssessmentStack'
          component={SelfAssessmentStack}
          options={{
            tabBarLabel: t('navigation.selfAssessment'),
            tabBarIcon: ({ focused, size }) => (
              <SvgXml
                xml={
                  focused
                    ? Icons.SelfAssessmentActive
                    : Icons.SelfAssessmentInactive
                }
                width={size}
                height={size}
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name='MoreScreen'
        component={MoreTabStack}
        options={{
          tabBarLabel: t('navigation.more'),
          tabBarIcon: ({ focused, size }) => (
            <SvgXml
              xml={focused ? Icons.MoreActive : Icons.MoreInactive}
              width={size}
              height={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const OnboardingStack = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen name='Onboarding1' component={Onboarding1} />
    <Stack.Screen name='Onboarding2' component={Onboarding2} />
    <Stack.Screen name='Onboarding3' component={Onboarding3} />
    <Stack.Screen name='Onboarding4' component={Onboarding4} />
    <Stack.Screen
      name='OnboardingPermissions'
      component={OnboardingPermissions}
    />
    <Stack.Screen
      name='EnableExposureNotifications'
      component={EnableExposureNotifications}
    />
  </Stack.Navigator>
);

const PartnersStack = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen
      name={'PartnersOverview'}
      component={PartnersOverviewScreen}
    />
    <Stack.Screen name={'PartnersEdit'} component={PartnersEditScreen} />
  </Stack.Navigator>
);

export const Entry = () => {
  const onboardingComplete = useSelector(isOnboardingCompleteSelector);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        {onboardingComplete ? (
          <Stack.Screen name={'App'} component={MainAppTabs} />
        ) : (
          <Stack.Screen name={'Onboarding'} component={OnboardingStack} />
        )}
        {/* Modal View: */}
        <Stack.Screen
          name={'ExportFlow'}
          component={ExportStack}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
