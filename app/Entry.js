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

import SettingsScreen from './views/Settings';
import AboutScreen from './views/About';
import PartnersOverviewScreen from './views/Partners/PartnersOverview';
import PartnersEditScreen from './views/Partners/PartnersEdit';
import PartnersCustomUrlScreen from './views/Partners/PartnersCustomUrlScreen';

import { LicensesScreen } from './views/Licenses';
import {
  ExportCodeInput,
  ExportComplete,
  ExportConfirmUpload,
  ExportIntro,
  ExportStart,
  ExportLocationConsent,
  ExportPublishConsent,
  ExportSelectHA,
  ExportLocally,
} from './views/Export';
import { PublishConsent } from './bt/PositiveDiagnosis/PublishConsent';
import ExposureHistoryScreen from './views/ExposureHistory';
import Assessment from './views/assessment';
import NextSteps from './views/ExposureHistory/NextSteps';
import MoreInfo from './views/ExposureHistory/MoreInfo';
import ENDebugMenu from './views/Settings/ENDebugMenu';
import { ENLocalDiagnosisKeyScreen } from './views/Settings/ENLocalDiagnosisKeyScreen';
import { FeatureFlagsScreen } from './views/FeatureFlagToggles';
import ImportScreen from './views/Import';
import { EnableExposureNotifications } from './views/onboarding/EnableExposureNotifications';
import Welcome from './views/onboarding/Welcome';
import Onboarding2 from './views/onboarding/Onboarding2';
import Onboarding3 from './views/onboarding/Onboarding3';
import Onboarding4 from './views/onboarding/Onboarding4';
import OnboardingNotifications from './views/onboarding/OnboardingNotifications';
import OnboardingLocations from './views/onboarding/OnboardingLocations';

import { Screens, Stacks } from './navigation';

import ExposureHistoryContext from './ExposureHistoryContext';
import isOnboardingCompleteSelector from './store/selectors/isOnboardingCompleteSelector';
import { isGPS } from './COVIDSafePathsConfig';
import { isPlatformAndroid } from './Util';
import { useTracingStrategyContext } from './TracingStrategyContext';

import * as Icons from './assets/svgs/TabBarNav';
import { Layout, Affordances, Spacing, Colors } from './styles';

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
    }}
    initialRouteName={isGPS ? Screens.ExportSelectHA : Screens.ExportIntro}>
    <Stack.Screen name={Screens.ExportIntro} component={ExportIntro} />
    <Stack.Screen name={Screens.ExportSelectHA} component={ExportSelectHA} />
    <Stack.Screen name={Screens.ExportCodeInput} component={ExportCodeInput} />
    <Stack.Screen
      name={Screens.ExportLocationConsent}
      component={ExportLocationConsent}
    />
    <Stack.Screen name={Screens.PublishConsent} component={PublishConsent} />
    <Stack.Screen
      name={Screens.ExportPublishConsent}
      component={ExportPublishConsent}
    />
    <Stack.Screen
      name={Screens.ExportConfirmUpload}
      component={ExportConfirmUpload}
    />
    <Stack.Screen name={Screens.ExportDone} component={ExportCodeInput} />
    <Stack.Screen name={Screens.ExportComplete} component={ExportComplete} />
  </Stack.Navigator>
);

const ExposureHistoryStack = ({ navigation }) => {
  const { observeExposures } = useContext(ExposureHistoryContext);
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
      }}>
      <Stack.Screen
        name={Screens.ExposureHistory}
        component={ExposureHistoryScreen}
      />
      <Stack.Screen name={Screens.NextSteps} component={NextSteps} />
      <Stack.Screen name={Screens.MoreInfo} component={MoreInfo} />
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
    <Stack.Screen name={Screens.SelfAssessment} component={Assessment} />
  </Stack.Navigator>
);

const MoreTabStack = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen name={Screens.Settings} component={SettingsScreen} />
    <Stack.Screen name={Screens.About} component={AboutScreen} />
    <Stack.Screen name={Screens.Licenses} component={LicensesScreen} />
    <Stack.Screen name={Screens.FeatureFlags} component={FeatureFlagsScreen} />
    <Stack.Screen name={Screens.Import} component={ImportScreen} />
    <Stack.Screen name={Screens.ENDebugMenu} component={ENDebugMenu} />
    <Stack.Screen
      name={Screens.ENLocalDiagnosisKey}
      component={ENLocalDiagnosisKeyScreen}
    />
    <Stack.Screen name={Screens.ExportLocally} component={ExportLocally} />
  </Stack.Navigator>
);

const MainAppTabs = () => {
  const { t } = useTranslation();
  const { userHasNewExposure } = useContext(ExposureHistoryContext);
  const { homeScreenComponent } = useTracingStrategyContext();

  const applyBadge = (icon) => {
    return (
      <>
        {icon}
        <View style={styles.iconBadge} />
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
      initialRouteName={Stacks.Main}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: Colors.white,
        inactiveTintColor: Colors.primaryViolet,
        style: {
          backgroundColor: Colors.navBar,
          borderTopColor: Colors.navBar,
          paddingTop: isPlatformAndroid() ? 0 : Spacing.xSmall,
          height: Layout.navBar,
        },
      }}>
      <Tab.Screen
        name={Stacks.Main}
        component={homeScreenComponent}
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
        name={Stacks.ExposureHistory}
        component={ExposureHistoryStack}
        options={{
          tabBarLabel: t('navigation.history'),
          tabBarIcon: ({ focused, size }) => {
            const tabIcon = (
              <SvgXml
                xml={focused ? Icons.CalendarActive : Icons.CalendarInactive}
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
          name={Screens.ExportStart}
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
          name={Stacks.Partners}
          component={PartnersStack}
          options={{
            tabBarLabel: t('navigation.partners'),
            tabBarIcon: ({ focused, size }) => (
              <SvgXml
                xml={focused ? Icons.ShieldActive : Icons.ShieldInactive}
                width={size}
                height={size}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name={Stacks.SelfAssessment}
          component={SelfAssessmentStack}
          options={{
            tabBarLabel: t('navigation.self_assessment'),
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
        name={Stacks.More}
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
    <Stack.Screen name={Screens.Welcome} component={Welcome} />
    <Stack.Screen name={Screens.Onboarding2} component={Onboarding2} />
    <Stack.Screen name={Screens.Onboarding3} component={Onboarding3} />
    <Stack.Screen name={Screens.Onboarding4} component={Onboarding4} />
    <Stack.Screen
      name={Screens.OnboardingNotificationPermissions}
      component={OnboardingNotifications}
    />
    <Stack.Screen
      name={Screens.OnboardingLocationPermissions}
      component={OnboardingLocations}
    />
    <Stack.Screen
      name={Screens.EnableExposureNotifications}
      component={EnableExposureNotifications}
    />
  </Stack.Navigator>
);

const PartnersStack = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen
      name={Screens.PartnersOverview}
      component={PartnersOverviewScreen}
    />
    <Stack.Screen name={Screens.PartnersEdit} component={PartnersEditScreen} />
    <Stack.Screen
      name={Screens.PartnersCustomUrl}
      component={PartnersCustomUrlScreen}
    />
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
          <Stack.Screen name={Stacks.Onboarding} component={OnboardingStack} />
        )}
        {/* Modal View: */}
        <Stack.Screen
          name={Screens.ExportFlow}
          component={ExportStack}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
