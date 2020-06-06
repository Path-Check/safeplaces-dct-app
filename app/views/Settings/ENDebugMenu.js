import React, { useEffect } from 'react';
import { BackHandler, ScrollView } from 'react-native';

import { NavigationBarWrapper } from '../../components';
import { Item } from './Item';
import { Section } from './Section';

export const EN_DEBUG_MENU_SCREEN_NAME = 'ENDebugMenu';

export const ENDebugMenu = ({ navigation }) => {
  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const backToSettings = () => {
    navigation.goBack();
  };

  return (
    <NavigationBarWrapper title={'EN Debug Menu'} onBackPress={backToSettings}>
      <ScrollView>
        <Section>
          <Item label='Detect Exposures Now' />
          <Item label='Simulate Exposure Detection Error' />
          <Item label='Simulate Exposure' />
          <Item label='Simulate Positive Diagnosis' />
          <Item label='Disable Exposure Notifications' />
          <Item label='Reset Exposure Detection Error' />
          <Item label='Reset Exposures' />
          <Item label='Reset Test Results' last />
        </Section>
        <Section last>
          <Item label='Show Diagnosis Keys' />
          <Item label='Get and Post Diagnosis Keys' />
          <Item label='Reset Diagnosis Keys' last />
        </Section>
      </ScrollView>
    </NavigationBarWrapper>
  );
};
