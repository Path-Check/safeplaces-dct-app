import React, { useState } from 'react';
import { Alert } from 'react-native';

import { Icons } from '../../assets';
import ExportTemplate from './ExportTemplate';

const MOCK_ENDPOINT =
  'https://private-anon-da01e87e46-safeplaces.apiary-mock.com/consent';

export const ExportPublishConsent = ({ navigation, route }) => {
  const [isConsenting, setIsConsenting] = useState(false);
  const onClose = () => navigation.navigate('SettingsScreen');

  const { selectedAuthority, code } = route.params;

  const consent = async () => {
    setIsConsenting(true);
    try {
      const res = await fetch(`${MOCK_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consent: true, accessCode: code }),
      });
      const success = res.status === 200;
      if (success) {
        setIsConsenting(false);
        navigation.navigate('ExportConfirmUpload', { selectedAuthority, code });
      } else {
        setIsConsenting(false);
        throw res.status;
      }
    } catch (e) {
      Alert.alert('Something went wrong');
      console.log(e);
      setIsConsenting(false);
    }
  };

  // TODO: use localized text
  return (
    <ExportTemplate
      onClose={onClose}
      onNext={consent}
      nextButtonLabel={'I understand and consent'}
      headline={'Publish anonymized data'}
      body={`During the interview with ${selectedAuthority.name} your interviewer can remove private locations, such as homes and apartments. They can also add any additional places you believe should be included.\n\n${selectedAuthority.name} may share the GPS coordinates from your location history, including date, time, and duration of your visits to let others in your community know if they may have crossed paths with the virus.\n\nI understand that the ${selectedAuthority.name} representative will ask me verbally at the end of the interview if I consent.`}
      buttonSubtitle={
        'By proceeding, you agree that your Heathcare Authority can retain your data for a period of time.'
      }
      buttonLoading={isConsenting}
      icon={Icons.Publish}
    />
  );
};

export default ExportPublishConsent;
