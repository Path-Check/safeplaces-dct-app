import { Button, Text } from 'native-base';
import React, { useContext } from 'react';
import { View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

import context from '../Reduces/context.js';
import styles from './style';

export default function Header({ title, text, navigation, close, style }) {
  const [, setGlobalState] = useContext(context);
  const onPress = () => {
    navigation.goBack();
    setGlobalState({ type: 'CLEAN_ANSWERS' });
  };
  return (
    <View>
      <View style={[styles.header, style]} />
      <View style={[styles.HeaderView, style, { padding: wp('3%') }]}>
        {close && (
          <Button transparent onPress={onPress}>
            <Icon name='times' size={25} color='#fff' />
          </Button>
        )}

        <Text style={styles.headerText}>{title}</Text>
        <Text style={[styles.text, { color: '#fff', width: wp('80%') }]}>
          {text}
        </Text>
      </View>
    </View>
  );
}
