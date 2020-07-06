import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Typography } from '../../components/Typography';
import { Theme } from '../../constants/themes';
import exitWarningAlert from './exitWarningAlert';
import exportCodeApi from '../../api/export/exportCodeApi';
import { Screens } from '../../navigation';
import { isGPS } from '../../COVIDSafePathsConfig';
import { useStrategyContent } from '../../TracingStrategyContext';

import { Icons } from '../../assets';
import { Colors } from '../../styles';
import {
  NavigationScreenProp,
  NavigationRoute,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import { HealthcareAuthority } from '../../store/types';
import CodeInput from './CodeInput';

const CODE_LENGTH = 6;

export const ExportCodeInput = ({
  route,
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: NavigationRoute;
}): JSX.Element => {
  const { t } = useTranslation();
  const { InterpolatedStrategyCopy, StrategyCopy } = useStrategyContent();

  const exportCodeInputNextRoute = isGPS
    ? Screens.ExportLocationConsent
    : Screens.PublishConsent;

  const exportExitRoute = isGPS ? Screens.ExportStart : Screens.Settings;

  const [code, setCode] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeInvalid, setCodeInvalid] = useState(false);

  const selectedAuthority: HealthcareAuthority =
    route.params?.selectedAuthority;
  const validateCode = async () => {
    setIsCheckingCode(true);
    setCodeInvalid(false);
    try {
      if (isGPS) {
        const { valid } = await exportCodeApi(selectedAuthority, Number(code));

        if (valid) {
          navigation.navigate(exportCodeInputNextRoute, {
            selectedAuthority,
            code,
          });
        } else {
          setCodeInvalid(true);
        }
        setIsCheckingCode(false);
      } else {
        const valid = code === '123456';

        if (valid) {
          navigation.navigate(exportCodeInputNextRoute, {
            selectedAuthority,
            code,
          });
        } else {
          setCodeInvalid(true);
        }
        setIsCheckingCode(false);
      }
    } catch (e) {
      Alert.alert(t('common.something_went_wrong'), e.message);
      setIsCheckingCode(false);
    }
  };

  return (
    <Theme use='default'>
      <StatusBar
        barStyle='dark-content'
        backgroundColor={Colors.primaryBackgroundFaintShade}
        translucent={false}
      />
      <SafeAreaView style={styles.wrapper}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
          <View style={styles.headerIcons}>
            <IconButton
              icon={Icons.BackArrow}
              size={27}
              onPress={() => navigation.goBack()}
            />
            <IconButton
              icon={Icons.Close}
              size={22}
              onPress={() => exitWarningAlert(navigation, exportExitRoute)}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 20 }}>
            <Typography use='headline2'>
              {StrategyCopy.exportCodeTitle}
            </Typography>
            <View style={{ height: 8 }} />
            <Typography use='body1'>
              {InterpolatedStrategyCopy.exportCodeBody(selectedAuthority.name)}
            </Typography>
            {/* These flex grows allow for a lot of flexibility across device sizes */}
            <View style={{ maxHeight: 60, flexGrow: 1 }} />
            {/* there's a flex end bug on android, this is a hack to ensure some spacing */}
            <View
              style={{
                flexGrow: 1,
                marginVertical: Platform.OS === 'ios' ? 0 : 10,
              }}>
              <CodeInput code={code} length={CODE_LENGTH} setCode={setCode} />
              {codeInvalid && (
                <Typography style={styles.errorSubtitle} use='body2'>
                  {t('export.code_input_error')}
                </Typography>
              )}
            </View>
            <Button
              disabled={code.length < CODE_LENGTH}
              loading={isCheckingCode}
              label={t('common.next')}
              onPress={validateCode}
              testID='next-button'
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Theme>
  );
};

const styles = StyleSheet.create({
  errorSubtitle: {
    marginTop: 8,
    color: Colors.errorText,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    paddingLeft: 0,
  },
  wrapper: {
    flex: 1,
    paddingBottom: 44,
    backgroundColor: Colors.primaryBackgroundFaintShade,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    flex: 1,
  },
});

export default ExportCodeInput;
