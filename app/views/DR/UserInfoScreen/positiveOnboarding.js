import { Button, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Dialog } from 'react-native-simple-dialogs';

import styles from '../../../components/DR/Header/style';
import Input from '../../../components/DR/Input/index';
import NavigationBarWrapper from '../../../components/NavigationBarWrapper';
import Colors from '../../../constants/colors';
import {
  RemoveStoreData,
  SetStoreData,
  getUsers,
} from '../../../helpers/General';

const PositiveOnboarding = ({ route, navigation }) => {
  const { positive, body, usage } = route.params;
  const { t } = useTranslation();
  const [showShareLocDialog, setShowShareLocDialog] = useState(false);
  const [error, showError] = useState(false);
  const [nickname, setNickname] = useState('');
  const [nicknameArray, setNicknameArray] = useState([]);

  useEffect(() => {
    getUsers().then(data => setNicknameArray(data !== null ? data : []));
  }, []);

  const createEntry = (nickname, data, positive) => {
    return {
      name: nickname,
      data,
      positive,
      usage,
    };
  };

  const getNicknamesCoincidences = (users, nickname) => {
    let coincidence = false;
    if (users.length > 0) {
      users.map(user => {
        if (user.name === nickname) {
          coincidence = true;
        }
      });
    }
    return coincidence;
  };
  const verifyAndAccept = async () => {
    if (!getNicknamesCoincidences(nicknameArray, nickname)) {
      nicknameArray.push(createEntry(nickname, body, positive, usage));
      await SetStoreData('users', nicknameArray);
      setShowShareLocDialog(true);
      navigation.navigate('EpidemiologicResponse', {
        screen: 'EpidemiologicReport',
        params: { nickname: nickname, path: false },
      });
    } else {
      showError(true);
    }
  };
  const enabled = nickname.length > 2 ? true : false;

  return (
    <NavigationBarWrapper
      title={t('label.epidemiologic_report_title')}
      onBackPress={() => navigation.popToTop()}>
      <ScrollView>
        <KeyboardAvoidingView
          behavior='position'
          keyboardVerticalOffset={50}
          style={{ flex: 1, backgroundColor: Colors.WHITE }}>
          <View>
            <Dialog
              visible={showShareLocDialog && usage === 'mySelf'}
              dialogStyle={{ backgroundColor: Colors.WHITE }}>
              <View>
                <Text style={styles.textSemiBold}>
                  {t('positives.share_location_data_title')}
                </Text>
                <Text style={styles.text}>
                  {t('positives.share_location_data_subtitle')}
                </Text>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Button
                    style={[
                      styles.buttons,
                      {
                        borderWidth: 1.5,
                        borderColor: Colors.RED_BUTTON,
                        backgroundColor: Colors.WHITE,
                        width: '40%',
                        marginTop: hp('3%'),
                      },
                    ]}
                    onPress={() => {
                      setTimeout(async () => {
                        await RemoveStoreData('shareLocation');
                        setShowShareLocDialog(false);
                      }, 500);
                    }}>
                    <Text style={[styles.text, { color: Colors.RED_BUTTON }]}>
                      {t('report.no')}
                    </Text>
                  </Button>
                  <Button
                    style={[
                      styles.buttons,
                      {
                        borderWidth: 1.5,
                        borderColor: Colors.GREEN,
                        backgroundColor: Colors.WHITE,
                        width: '40%',
                        marginTop: hp('3%'),
                      },
                    ]}
                    onPress={() => {
                      setTimeout(() => {
                        SetStoreData('shareLocation', 'yes');
                        setShowShareLocDialog(false);
                      }, 900);
                    }}>
                    <Text
                      style={[styles.textSemiBold, { color: Colors.GREEN }]}>
                      {t('report.yes')}
                    </Text>
                  </Button>
                </View>
              </View>
            </Dialog>

            <View
              style={[
                styles.formContainer,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: hp('80%'),
                  padding: 15,
                },
              ]}>
              <View>
                <Image
                  resizeMode='contain'
                  style={{
                    height: 230,
                    width: 310,
                    alignSelf: 'center',
                    marginBottom: 25,
                  }}
                  source={require('../../../assets/images/covidSick.jpg')}
                />
              </View>

              <Text
                style={[
                  styles.subtitles,
                  { textAlign: 'center', alignSelf: 'center', marginLeft: 10 },
                ]}>
                {t('positives.you_are_positive')}
              </Text>
              <View
                style={[
                  styles.bottomLine,
                  { alignSelf: 'center', marginVertical: 10 },
                ]}
              />
              <Text style={[styles.text, { textAlign: 'center' }]}>
                {t('positives.insert_nickname')}
              </Text>
              {error && (
                <Text style={[styles.text, { color: Colors.RED_TEXT }]}>
                  {t('positives.nickname_exist')}
                </Text>
              )}
              <Input
                value={nickname}
                onChange={text => setNickname(text)}
                style={{
                  marginBottom: 22,
                  width: wp('50%'),
                  textAlign: 'center',
                }}
                autoFocus
                keyboardType={'default'}
                maxLength={16}
              />
              <Button
                disabled={!enabled}
                style={[
                  styles.buttons,
                  { width: wp('70%') },
                  !enabled && { backgroundColor: Colors.BLUE_DISABLED },
                ]}
                onPress={() => verifyAndAccept()}>
                <Text style={[styles.text, { color: Colors.WHITE }]}>
                  {t('common.done')}
                </Text>
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </NavigationBarWrapper>
  );
};

export default PositiveOnboarding;
