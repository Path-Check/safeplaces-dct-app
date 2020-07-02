import { Button, Container, Content, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Header from '../../../components/DR/Header';
import Colors from '../../../constants/colors';
import styles from './style';

export default function Main({ route, navigation }) {
  const { t } = useTranslation();
  const canBack = route.params?.back ?? false;
  return (
    <Container>
      <Content>
        <View style={{ flex: 1 }}>
          <Header
            iconName='chevron-left'
            close={canBack}
            title={t('report.title')}
            text={t('report.usage.header_selector')}
            navigation={navigation}
            style={{ height: hp('18%') }}
          />
          <View style={styles.formContainer}>
            <Text style={[styles.text, { marginVertical: 30, fontSize: 17 }]}>
              {t('report.usage.selector')}
            </Text>
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
                navigation.navigate('ReportType', { type: 'PositiveReport' });
              }}>
              <Text
                style={[
                  styles.text,
                  { color: Colors.WHITE, textTransform: 'capitalize' },
                ]}>
                {t('report.usage.positive_select')}
              </Text>
            </Button>
            <Button
              onPress={() => {
                navigation.navigate('ReportType', { type: false });
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
                {t('report.usage.symptoms_select')}
              </Text>
            </Button>
          </View>
        </View>
      </Content>
    </Container>
  );
}
