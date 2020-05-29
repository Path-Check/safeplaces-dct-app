import React, { useState } from 'react';
import { Alert, NativeModules } from 'react-native';

import { Icons } from '../../assets';
import ExportTemplate from './ExportTemplate';

const MOCK_ENDPOINT =
  'https://private-anon-da01e87e46-safeplaces.apiary-mock.com/upload';

export const ExportComplete = ({ navigation, route }) => {
  const [isUploading, setIsUploading] = useState(false);
  const onClose = () => navigation.navigate('SettingsScreen');

  const { selectedAuthority, code } = route.params;

  const upload = async () => {
    setIsUploading(true);
    try {
      const concernPoints = await NativeModules.SecureStorageManager.getLocations();
      console.log({ concernPoints });

      const res = await fetch(`${MOCK_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode: code, concernPoints }),
      });
      const success = res.status === 201;
      if (success) {
        navigation.navigate('ExportComplete');
      } else {
        Alert.alert('failure');
      }
      setIsUploading(false);
    } catch (e) {
      Alert.alert('Something went wrong');
      console.log(e);
      setIsUploading(false);
    }
  };

  // TODO: use localized text
  return (
    <ExportTemplate
      onClose={onClose}
      onNext={upload}
      nextButtonLabel={'Send Location History'}
      headline={'Send your location history to your HA'}
      body={`This will help in contact tracing efforts.\n\nIf you choose not to send your Location History to ${selectedAuthority.name}, you are choosing to opt out of contact tracing efforts that help keep your community safe.`}
      icon={Icons.Upload}
      buttonLoading={isUploading}
    />
  );
};

export default ExportComplete;
