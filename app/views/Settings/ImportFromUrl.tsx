import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert, NativeModules } from 'react-native';
import { useTranslation } from 'react-i18next';

import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';

import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { NavigationProp } from '../../navigation';

import { Forms } from '../../styles';

type ImportFromUrlProps = {
  navigation: NavigationProp;
};

const ImportFromUrl = ({
  navigation,
}: ImportFromUrlProps): JSX.Element => {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');

  const getLocationsMockData = async (jsonURL: string) =>  await fetch(jsonURL).then(res => res.json())

  const importData = async () => {
      try {
        const mockData = await getLocationsMockData(url)

        if(mockData) {
            await NativeModules.SecureStorageManager.importGoogleLocations(
                mockData,
            )
            navigation.goBack();
        } else throw new Error

      } catch (e) {
        console.log('ERROR:::', e)
        Alert.alert(t('import.mockData.invalid_url'));
      }
  };

  return (
    <NavigationBarWrapper
      title={t('import.mockData.custom_url_title')}
      onBackPress={() => navigation.goBack()}>
      <View style={styles.wrapper}>
        <Typography use={'headline2'}>
          {t('import.mockData.url_instructions')}
        </Typography>
        <Typography use={'body2'}>
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
        <Button label={t('common.add')} onPress={importData} />
      </View>
    </NavigationBarWrapper>
  );
};
export default ImportFromUrl;

const styles = StyleSheet.create({
  wrapper: { padding: 24 },
});
