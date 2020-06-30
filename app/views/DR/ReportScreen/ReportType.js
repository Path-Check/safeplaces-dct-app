import { Button, Container, Content, Text } from 'native-base';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Header from '../../../components/DR/Header';
import context from '../../../components/DR/Reduces/context.js';
import Colors from '../../../constants/colors';
import { getMyself, getUsers } from '../../../helpers/General';
import styles from './style';

export default function ReportScreen({
  navigation,
  route: {
    params: { type },
  },
}) {
  navigation.setOptions({
    headerShown: false,
  });
  const { t } = useTranslation();

  const [, setGlobalState] = useContext(context);
  const [users, setUsers] = useState([]);

  getUsers().then(data => {
    setUsers(data !== null ? data : []);
  });

  const setSelectedOption = selected => {
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: { usage: selected },
    });
  };
  return (
    <Container>
      <Content>
        <View style={{ flex: 1 }}>
          <Header
            title={t('report.title')}
            text={t('report.usage.header_subtitle')}
            close
            iconName='chevron-left'
            navigation={navigation}
            style={{ height: hp('18%') }}
          />
          <View style={styles.formContainer}>
            <Text style={[styles.text, { marginVertical: 30, fontSize: 17 }]}>
              {t('report.usage.subtitle')}
            </Text>
            {!(users.length > 0 && getMyself(users)) && (
              <Button
                style={[
                  styles.buttons,
                  {
                    width: wp('70%'),
                    height: 38,
                    backgroundColor: Colors.BLUE_RIBBON,
                    marginBottom: 10,
                  },
                ]}
                onPress={() => {
                  setSelectedOption('mySelf');
                  navigation.navigate('UserInfo', { type });
                }}>
                <Text
                  style={[
                    styles.text,
                    { color: Colors.WHITE, textTransform: 'capitalize' },
                  ]}>
                  {t('report.usage.use_myself')}
                </Text>
              </Button>
            )}
            <Button
              onPress={() => {
                setSelectedOption('others');
                navigation.navigate('UserInfo', { type });
              }}
              style={[
                styles.buttons,
                {
                  width: wp('70%'),
                  height: 38,
                  backgroundColor: Colors.LIGHT_BLUE,
                },
              ]}>
              <Text
                style={[
                  styles.text,
                  { color: Colors.BLUE_RIBBON, textTransform: 'capitalize' },
                ]}>
                {t('report.usage.use_others')}
              </Text>
            </Button>
          </View>
        </View>
      </Content>
    </Container>
  );
}
