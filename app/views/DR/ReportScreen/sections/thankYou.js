import React, {useContext} from 'react';
import { View } from 'react-native';
import { Text, Container, Content } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import Colors from '../../../constants/Colors';
import styles from '../../../components/styles';

const ThankYou = () => {
  return (
    <Content contentContainerStyle={{ flex: 1 }}>
      <Container>
        <View
          style={{
            width: wp('100%'),
            height: hp('50%'),
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Ionicons
            name="md-checkmark-circle-outline"
            size={wp('22%')}
            color={Colors.green}
          />
          <Text style={[styles.subtitles, { alignSelf: 'center' }]}>
            ¡Gracias!
          </Text>
          <Text style={[styles.subtitles, { textAlign: 'center', marginTop: 0, width: wp("70%"), alignSelf: 'center' }]}>
            Presiona Finalizar para culminar el proceso
          </Text>
        </View>
      </Container>
    </Content>
  );
};

export default ThankYou;
