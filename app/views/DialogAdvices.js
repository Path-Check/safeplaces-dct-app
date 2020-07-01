import { Button, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dialog } from 'react-native-simple-dialogs';

import DialogStyle from '../components/DR/Header/style';
import Colors from '../constants/colors';

const DialogAdvices = ({ visible, text, close }) => {
  const { t } = useTranslation();
  return (
    <Dialog visible={visible} dialogStyle={{ backgroundColor: Colors.WHITE }}>
      <View>
        <Text style={DialogStyle.textSemiBold}>{text}</Text>
        <Button
          style={[
            DialogStyle.buttons,
            {
              backgroundColor: Colors.GREEN,
              width: '70%',
              marginTop: hp('3%'),
            },
          ]}
          onPress={() => {
            close();
          }}>
          <Text style={[DialogStyle.text, { color: Colors.WHITE }]}>
            {t('label.accept')}
          </Text>
        </Button>
      </View>
    </Dialog>
  );
};

export default DialogAdvices;
