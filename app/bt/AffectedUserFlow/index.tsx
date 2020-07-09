import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SvgXml } from 'react-native-svg';

import { AffectedUserProvider } from './AffectedUserContext';
import Start from './Start';
import CodeInput from './CodeInput';
import Complete from './Complete';
import PublishConsent from './PublishConsent/PublishConsentScreen';

import { Icons } from '../../assets';
import { Colors, Spacing } from '../../styles';
import { Screens } from '../../navigation';

const Stack = createStackNavigator();

const ExportStack = (): JSX.Element => {
  const BackButton = () => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconContainer}>
        <SvgXml xml={Icons.BackArrow} color={Colors.quaternaryViolet} />
      </TouchableOpacity>
    );
  };

  const CloseButton = () => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(Screens.Settings)}
        style={styles.iconContainer}>
        <SvgXml xml={Icons.Close} color={Colors.quaternaryViolet} />
      </TouchableOpacity>
    );
  };

  return (
    <AffectedUserProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
        initialRouteName={Screens.AffectedUserStart}>
        <Stack.Screen
          name={Screens.AffectedUserStart}
          component={Start}
          options={{
            headerTransparent: true,
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name={Screens.AffectedUserCodeInput}
          component={CodeInput}
          options={{
            headerTransparent: true,
            headerLeft: function backButton() {
              return <BackButton />;
            },
            headerTitle: '',
            headerRight: function closeButton() {
              return <CloseButton />;
            },
          }}
        />
        <Stack.Screen
          name={Screens.AffectedUserPublishConsent}
          component={PublishConsent}
          options={{
            headerTransparent: true,
            headerLeft: () => {
              return null;
            },
            headerTitle: '',
            headerRight: function closeButton() {
              return <CloseButton />;
            },
          }}
        />
        <Stack.Screen
          name={Screens.AffectedUserComplete}
          component={Complete}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </AffectedUserProvider>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    padding: Spacing.medium,
  },
});

export default ExportStack;
