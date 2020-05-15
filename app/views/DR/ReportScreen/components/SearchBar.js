import React from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Right, Left } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';

export default class SearchBar extends React.Component {
  state = {
    writable: false
  };
  render() {
    return (
      <View style={{ width: wp('50%'), marginRight: wp('3%') }}>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            placeholder=" Buscar..."
            placeholderTextColor="#d1d1d1"
            style={styles.textInput}
          />

          <Right>
            <TouchableOpacity
              transparent
              onPress={() => this.setState({ writable: true })}>
              <Icon name="search" color={'#fff'} size={wp('5%')} />
            </TouchableOpacity>
          </Right>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: wp('4%'),
    fontFamily: 'OpenSans-Regular',
    width: wp('42%'),
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    color: '#fff'
  }
});
