import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';

import { useDispatch, useSelector } from 'react-redux';
import getHealthcareAuthoritiesAction from '../../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import { Typography } from '../../components/Typography';

import { Button } from '../../components/Button';
import { Colors } from '../../styles';

type PartnersEditScreenProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

const PartnersScreen = ({
  navigation,
}: PartnersEditScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const didMountRef = useRef(false);

  const dispatch = useDispatch();

  // This is testing code only,we omit selector:
  const fetchCustomStatus = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.healthcareAuthorities.request.status,
  );

  const onRequestComplete = useCallback(() => {
    // We only care if this happened from a trigger on this screen,
    // not if we enter this screen on this state. Hack to achieve this, not
    // super robust against parallel events, but good for this screen's testing purposes.
    if (didMountRef.current) {
      if (fetchCustomStatus === 'SUCCESS') {
        navigation.goBack();
      } else if (fetchCustomStatus === 'FAILURE') {
        Alert.alert(t('authorities.invalid_url'));
      }
    } else {
      didMountRef.current = true;
    }
  }, [navigation, fetchCustomStatus, t]);

  useEffect(onRequestComplete, [onRequestComplete, fetchCustomStatus]);

  // Fetch list on screen mount
  const searchForUrl = () => dispatch(getHealthcareAuthoritiesAction(url));

  return (
    <NavigationBarWrapper
      title={t('authorities.custom_url_title')}
      onBackPress={() => navigation.goBack()}>
      <View style={styles.wrapper}>
        <Typography use={'headline2'}>
          {t('authorities.url_instructions')}
        </Typography>
        <TextInput value={url} onChangeText={setUrl} style={styles.textInput} />
        <Button label={t('common.add')} onPress={searchForUrl} />
      </View>
    </NavigationBarWrapper>
  );
};
export default PartnersScreen;

const styles = StyleSheet.create({
  wrapper: { padding: 24 },
  textInput: {
    fontSize: 20,
    borderColor: Colors.primaryBorder,
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    marginVertical: 24,
  },
});
