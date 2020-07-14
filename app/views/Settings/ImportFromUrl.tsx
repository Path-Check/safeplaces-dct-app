import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  NativeModules,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import importLocationsApi from '../../api/import/importLocationsApi';

import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';

import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { NavigationProp } from '../../navigation';

import { Forms, Spacing } from '../../styles';

type ImportFromUrlProps = {
  navigation: NavigationProp;
};

const ImportFromUrl = ({ navigation }: ImportFromUrlProps): JSX.Element => {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');

  // TODO: add logic to filter mocked data. We should agree on flag name

  const importData = async () => {
    try {
      // Data must be an array of objects!
      const mockData = await importLocationsApi(url);

      await NativeModules.SecureStorageManager.importGoogleLocations(mockData);
      return navigation.goBack();
    } catch (e) {
      return Alert.alert(t('import.mockData.invalid_url'), e.message);
    }
  };

  // TODO: add a way to delete imported test data on demand

  return (
    <NavigationBarWrapper
      title={t('import.mockData.custom_url_title')}
      onBackPress={() => navigation.goBack()}>
      <View style={styles.wrapper}>
        <Typography use={'headline2'}>
          {t('import.mockData.url_instructions')}
        </Typography>
        <Typography style={{ paddingTop: Spacing.small }} use={'body2'}>
          {t('import.mockData.instruction_info')}
        </Typography>
        <TextInput
          value={url}
          onChangeText={setUrl}
          style={[
            Forms.textInputFormField,
            {
              marginVertical: 24,
              flex: undefined, // cancel flex set by textInputFormField
            },
          ]}
        />
        <Button
          disabled={!url}
          invert
          label={t('common.add')}
          onPress={importData}
        />
      </View>
    </NavigationBarWrapper>
  );
};
export default ImportFromUrl;

const styles = StyleSheet.create({
  wrapper: { padding: 24 },
});
