import { Ionicons } from '@expo/vector-icons';
import { Container, Content, Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import styles from '../../../components/styles';
import Colors from '../../../constants/Colors';

const ThankYou = () => {
  return (
    <Content contentContainerStyle={{ flex: 1 }}>
      <Container>
        <View
          style={{
            width: wp('100%'),
            height: hp('50%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons
            name='md-checkmark-circle-outline'
            size={wp('22%')}
            color={Colors.green}
          />
          <Text style={[styles.subtitles, { alignSelf: 'center' }]}>
            ¡Gracias!
          </Text>
          <Text
            style={[
              styles.subtitles,
              {
                textAlign: 'center',
                marginTop: 0,
                width: wp('70%'),
                alignSelf: 'center',
              },
            ]}>
            Presiona Finalizar para culminar el proceso
          </Text>
        </View>
      </Container>
    </Content>
  );
};

export default ThankYou;