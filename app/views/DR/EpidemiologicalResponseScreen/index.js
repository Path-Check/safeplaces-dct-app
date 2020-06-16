import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import NavigationBarWrapper from '../../../components/NavigationBarWrapper';
import Colors from '../../../constants/colors';
import EpidemiologicalStatus from './epidemiologicalStatus';
import MentalHealthAdvices from './mentalHealthAdvices';

const TopBar = createMaterialTopTabNavigator();

const EpidemiologicScreen = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <NavigationBarWrapper
      title={t('label.epidemiologic_report_title')}
      onBackPress={() => navigation.goBack()}>
      <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
        <TopBar.Navigator
          tabBarOptions={{
            activeTintColor: '#0059ff',
            inactiveTintColor: '#000',
            labelStyle: {
              fontSize: 12,
            },
          }}>
          <TopBar.Screen
            name={t('positives.epidemiologic_report_tab')}
            component={EpidemiologicalStatus}
          />
          <TopBar.Screen
            name={t('positives.mental_health_advice_tab')}
            component={MentalHealthAdvices}
          />
        </TopBar.Navigator>
      </View>
    </NavigationBarWrapper>
  );
};

export default EpidemiologicScreen;
