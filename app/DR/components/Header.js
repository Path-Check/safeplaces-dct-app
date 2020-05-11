import React from 'react';
import { View } from 'react-native';
import {
  Button,
  Text,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import styles from './styles';

export default function Header({ title, text, navigation }) {
  return (
    <View>
      <View style={styles.header} />
      <View style={[styles.HeaderView, { padding: wp('3%') }]}>
        <Button transparent onPress={() => navigation.goBack()}>
          <Icon name="times" size={25} color="#fff" />
        </Button>

        <Text style={styles.headerText}>{title}</Text>
        <Text style={[styles.text, { color: '#fff', width: wp('80%') }]}>
          {text}
        </Text>
      </View>
    </View>
  );
}
