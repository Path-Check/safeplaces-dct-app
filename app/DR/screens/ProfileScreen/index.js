import * as React from 'react';
import {
  SafeAreaView, ScrollView, StyleSheet, View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CreateAccount, Tester } from '../../components/Profile/index';
import { Contact } from '../../components/ActionCards';

const ProfileScreen = () => (
  <SafeAreaView style={profile.container}>
    <ScrollView style={profile.scroll}>
      <CreateAccount />
      <Tester />
      {/* <View style={profile.contactContainer}>
        <Contact isProfile />
      </View> */}
    </ScrollView>
  </SafeAreaView>
);

const profile = StyleSheet.create({
  scroll: {
    flex: 1,
  },

  container: {
    backgroundColor: 'white',
    flex: 1,
    height: hp('100%'),
  },

  contactContainer: {
    alignItems: 'center',
  },
});

export default ProfileScreen;
