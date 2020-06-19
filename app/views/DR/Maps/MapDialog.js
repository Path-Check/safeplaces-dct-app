import { Button, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Dialog } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../../constants/colors';

export default function MapDialog({ showDialog, setShowDialog }) {
  const { t } = useTranslation();

  return (
    <Dialog
      visible={showDialog}
      onTouchOutside={() => setShowDialog(false)}
      dialogStyle={{ backgroundColor: Colors.WHITE }}>
      <Icon
        name={'exclamation-circle'}
        color={Colors.RED_TEXT}
        size={30}
        style={styles.icon}
      />
      <Text>{t('maps.error_location')}</Text>
      <Button style={styles.button} onPress={() => setShowDialog(false)}>
        <Text style={styles.buttonText}>{t('report.close')}</Text>
      </Button>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  icon: { marginBottom: 12, alignSelf: 'center' },
  button: {
    alignSelf: 'center',
    borderRadius: 25,
    backgroundColor: Colors.GREEN,
    justifyContent: 'center',
    height: 38,
    marginTop: 25,
    width: '70%',
    marginLeft: 6,
    minWidth: wp('27%'),
  },
  buttonText: {
    color: Colors.WHITE,
  },
});
