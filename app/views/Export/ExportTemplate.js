import React, { useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { Icons } from '../../assets';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import { Theme } from '../../constants/themes';

const BackgroundContainer = ({ lightTheme, children }) => {
  if (lightTheme) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={Colors.INTRO_WHITE_BG}
          translucent={false}
        />
        {children}
      </View>
    );
  }
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[Colors.VIOLET_BUTTON, Colors.VIOLET_BUTTON_DARK]}
      style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={Colors.VIOLET_BUTTON}
        translucent={false}
      />
      {children}
    </LinearGradient>
  );
};

export const ExportTemplate = ({
  onClose,
  headline,
  body,
  onNext,
  nextButtonLabel,
  // Optionals:
  buttonSubtitle,
  icon,
  lightTheme,
  buttonLoading,
}) => {
  useEffect(() => {
    function handleBackPress() {
      onClose();
    }
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, [onClose]);

  return (
    <Theme use={lightTheme ? 'default' : 'violet'}>
      <BackgroundContainer lightTheme={lightTheme}>
        <SafeAreaView style={{ flex: 1, paddingBottom: 24 }}>
          <View style={styles.header}>
            <IconButton icon={Icons.Close} size={22} onPress={onClose} />
          </View>
          <ScrollView
            alwaysBounceVertical={false}
            style={{ flexGrow: 1 }}
            contentContainerStyle={{
              // Opt for center alignment without icons,
              // top alignment with icon.
              justifyContent: icon ? undefined : 'center',
              flexGrow: 1,
              paddingBottom: 24,
            }}>
            {/* Add top padding if we can afford it */}
            {<View style={{ maxHeight: 20, flexGrow: 1 }} />}
            {icon && (
              <View style={styles.iconContainerCircle}>
                <SvgXml xml={icon} width={30} height={30} />
              </View>
            )}

            <Typography use='headline2' style={styles.exportSectionTitles}>
              {headline}
            </Typography>
            <View style={{ height: 8 }} />
            <Typography use='body1'>{body}</Typography>
          </ScrollView>

          {/* TODO: <Button/> needs an actual loading state. */}
          <Button
            style={{ marginTop: 10 }}
            label={nextButtonLabel}
            onPress={onNext}
            disabled={buttonLoading}
          />
          {buttonSubtitle && (
            <Typography style={{ paddingTop: 10 }} use='body3'>
              {buttonSubtitle}
            </Typography>
          )}
          {/* Add extra padding on the bottom if available for phone. 
           Interlays with the flexGrow on the scroll view to ensure that scrolling content has priority. */}
          <View style={{ maxHeight: 20, flexGrow: 1 }} />
        </SafeAreaView>
      </BackgroundContainer>
    </Theme>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
  },
  iconContainerCircle: {
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  exportSectionTitles: {
    fontWeight: '500',
    fontFamily: fontFamily.primaryMedium,
  },
  container: {
    backgroundColor: Colors.INTRO_WHITE_BG,
    flex: 1,
    paddingHorizontal: 24,
  },
});

export default ExportTemplate;
