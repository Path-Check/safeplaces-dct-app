// TODO: REMOVE
/* eslint-disable react-native/no-raw-text */
import React, { useEffect } from 'react';
import {
  BackHandler,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icons } from '../../assets';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import { Theme } from '../../constants/themes';

export const ExportStart = ({ navigation }) => {
  useEffect(() => {
    function handleBackPress() {
      navigation.goBack();
      return true;
    }
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, [navigation]);

  return (
    <Theme use='violet'>
      <StatusBar
        barStyle='light-content'
        backgroundColor={Colors.VIOLET_BUTTON}
        translucent={false}
      />
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[Colors.VIOLET_BUTTON, Colors.VIOLET_BUTTON_DARK]}
        style={{ flex: 1, paddingHorizontal: 24 }}>
        <SafeAreaView style={{ flex: 1, paddingBottom: 44 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 12,
            }}>
            <IconButton
              icon={Icons.Close}
              size={22}
              onPress={() => navigation.goBack()}
            />
          </View>

          <ScrollView
            alwaysBounceVertical={false}
            style={{ flex: 1 }}
            contentContainerStyle={{
              justifyContent: 'center',
              flexGrow: 1,
              paddingVertical: 24,
            }}>
            <Typography use='headline2' style={styles.exportSectionTitles}>
              Share your location history anonymously with your community if you
              have tested positive for COVID-19.
            </Typography>
            <View style={{ height: 8 }} />
            <Typography use='body1'>
              The representative from your Healthcare Authority will walk you
              through this process during your interview.
            </Typography>
          </ScrollView>

          <Button
            style={styles.exportButton}
            label={'Start'}
            onPress={() => {
              navigation.replace('ExportSelectHA');
            }}
          />
        </SafeAreaView>
      </LinearGradient>
    </Theme>
  );
};

const styles = StyleSheet.create({
  exportSectionTitles: {
    fontWeight: '500',
    fontFamily: fontFamily.primaryMedium,
  },
});

export default ExportStart;
