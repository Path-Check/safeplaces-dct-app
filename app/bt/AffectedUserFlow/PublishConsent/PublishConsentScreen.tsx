import React, { FunctionComponent } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useStatusBarEffect, Screens } from '../../../navigation';
import { useAffectedUserContext } from '../AffectedUserContext';
import PublishConsentForm from './PublishConsentForm';

const PublishConsentScreen: FunctionComponent = () => {
  useStatusBarEffect('light-content');
  const navigation = useNavigation();
  const { certificate, hmacKey } = useAffectedUserContext();

  if (hmacKey && certificate) {
    return <PublishConsentForm hmacKey={hmacKey} certificate={certificate} />;
  } else {
    return (
      <View>
        <Text>Invalid State</Text>
        <Button
          onPress={() => {
            navigation.navigate(Screens.More);
          }}
          title={'Go Back'}
        />
      </View>
    );
  }
};

export default PublishConsentScreen;
