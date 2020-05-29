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
    return <View style={styles.container}>{children}</View>;
  }
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[Colors.VIOLET_BUTTON, Colors.VIOLET_BUTTON_DARK]}
      style={styles.container}>
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
      <StatusBar
        barStyle={lightTheme ? 'dark-content' : 'light-content'}
        backgroundColor={Colors.VIOLET_BUTTON}
        translucent={false}
      />
      <BackgroundContainer lightTheme={lightTheme}>
        <SafeAreaView style={{ flex: 1, paddingBottom: 44 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 12,
            }}>
            <IconButton icon={Icons.Close} size={22} onPress={onClose} />
          </View>

          <ScrollView
            alwaysBounceVertical={false}
            style={{ flex: 1 }}
            contentContainerStyle={{
              justifyContent: icon ? undefined : 'center',
              flexGrow: 1,
              paddingVertical: 24,
            }}>
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
            label={nextButtonLabel}
            onPress={onNext}
            disabled={buttonLoading}
          />
          {buttonSubtitle && (
            <Typography style={{ paddingTop: 10 }} use='body3'>
              {buttonSubtitle}
            </Typography>
          )}
        </SafeAreaView>
      </BackgroundContainer>
    </Theme>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#F8F8FF',
    flex: 1,
    paddingHorizontal: 24,
  },
});

export default ExportTemplate;
