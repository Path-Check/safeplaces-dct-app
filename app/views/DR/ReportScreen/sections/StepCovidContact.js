import 'moment/locale/es';

import moment from 'moment';
import { Container, Content, Picker, Text } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import CalendarButton from '../../../../components/DR/CalendarButton';
import Checkbox from '../../../../components/DR/Checkbox';
import styles from '../../../../components/DR/Header/style';
import context from '../../../../components/DR/Reduces/context';
import ToggleButtons from '../../../../components/DR/ToggleButtons';
import Colors from '../../../../constants/colors';
import { REST_COUNTRIES_SERVICE } from '../../../../constants/DR/baseUrls';

const StepCovidContact = ({ setCompleted }) => {
  const { t } = useTranslation();

  const [
    {
      answers: {
        usage,
        dontKnowArea,
        dontKnowExposition,
        hadCloseContact,
        hadFarContact,
        liveIn,
        liveWith,
        noneAbove,
        notExposed,
        traveled,
        dateArrived,
        countriesVisited,
        traveledIn,
        visitedArea,
        usedProtection,
      },
    },
    setGlobalState,
  ] = useContext(context);
  const [countries, setCountries] = useState([]);

  const getCountries = async () => {
    let countries = [];
    let response = await fetch(REST_COUNTRIES_SERVICE);
    response = await response.json();
    response.map(country => {
      countries.push(country.name);
    });
    return setCountries(countries);
  };
  useEffect(() => {
    getCountries();
  }, []);

  const [selection, setSelection] = useState(
    traveled == true
      ? t('report.yes')
      : traveled == false
      ? t('report.no')
      : '',
  );

  const live =
    usage === 'others'
      ? t('report.cov_contact.live_in_area_others')
      : t('report.cov_contact.live_in_area_myself');
  const visited =
    usage === 'others'
      ? t('report.cov_contact.visited_area_others')
      : t('report.cov_contact.visited_area_myself');
  const notKnow =
    usage === 'others'
      ? t('report.cov_contact.dont_know_others')
      : t('report.cov_contact.dont_know_myself');

  const setOption = option => {
    setSelection(option);
    if (option === t('report.yes')) {
      setSelectedOption('traveled', true);
    } else {
      setSelectedOption('traveled', false);
      setSelectedOption('countriesVisited', '');
      setSelectedOption('traveledIn', '');
    }
  };

  const setSelectedOption = (
    option,
    selected,
    notExposureCheck,
    noneAboveCheck,
  ) => {
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: {
        [option]: selected,
        ...(notExposureCheck &&
          noneAboveCheck && {
            [notExposureCheck]: false,
            [noneAboveCheck]: false,
          }),
      },
    });
  };

  const minimum = new Date().setDate(new Date().getDate() - 50);
  if (
    (traveled === false ||
      (traveled && dateArrived && countriesVisited && traveledIn)) &&
    (liveIn || visitedArea || dontKnowArea || noneAbove) &&
    (((liveWith || hadCloseContact || hadFarContact) && usedProtection) ||
      notExposed ||
      dontKnowExposition)
  ) {
    setCompleted(true);
  } else {
    setCompleted(false);
  }

  return (
    <Container>
      <Content>
        <View>
          <ScrollView>
            <View style={[styles.formContainer, { marginRight: wp('10%') }]}>
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                {t('report.cov_contact.traveled_title')}
              </Text>
              <ToggleButtons
                options={[t('report.yes'), t('report.no')]}
                onSelection={selected => setOption(selected)}
                selectedOption={selection}
              />
              {selection === t('report.yes') && (
                <View>
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                    {t('report.cov_contact.when_arrived')}
                  </Text>
                  <CalendarButton
                    date={moment(dateArrived).format('DD-MM-YYYY')}
                    onChange={date =>
                      setSelectedOption(
                        'dateArrived',
                        moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                      )
                    }
                    minDate={moment(minimum)}
                  />
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                    {t('report.cov_contact.country_visited')}
                  </Text>
                  <Picker
                    note
                    mode='dropdown'
                    placeholder={t('report.cov_contact.select_country')}
                    style={[
                      styles.rectButtons,
                      {
                        width: wp('65%'),
                        backgroundColor: Colors.LIGHT_BLUE,
                        alignSelf: 'flex-start',
                        borderBottomColor: Colors.MAIN_BLUE,
                        borderBottomWidth: 1.5,
                      },
                    ]}
                    selectedValue={countriesVisited}
                    onValueChange={value => {
                      setSelectedOption('countriesVisited', value);
                    }}>
                    {countries.map((country, index) => (
                      <Picker.Item
                        label={country}
                        value={country}
                        key={index}
                      />
                    ))}
                  </Picker>
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                    {t('report.cov_contact.transportation')}
                  </Text>
                  <ToggleButtons
                    options={[
                      t('report.cov_contact.airplane'),
                      t('report.cov_contact.ship'),
                      t('report.cov_contact.overland'),
                    ]}
                    onSelection={selected =>
                      setSelectedOption('traveledIn', selected)
                    }
                    selectedOption={traveledIn}
                  />
                </View>
              )}
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                {t('report.cov_contact.infected_area_title')}
              </Text>
              <Text style={[styles.text, { marginBottom: 10 }]}>
                {t('report.cov_contact.infected_subtitle')}
              </Text>
              <Checkbox
                text={live}
                id='liveIn'
                setValue={(id, value) =>
                  setSelectedOption(id, value, 'dontKnowArea', 'noneAbove')
                }
                initialCheck={liveIn}
              />
              <Checkbox
                text={visited}
                id='visitedArea'
                setValue={(id, value) =>
                  setSelectedOption(id, value, 'dontKnowArea', 'noneAbove')
                }
                initialCheck={visitedArea}
              />
              <Checkbox
                text={notKnow}
                id='dontKnowArea'
                setValue={(id, value) =>
                  setGlobalState({
                    type: 'ADD_ANSWERS',
                    value: {
                      liveIn: false,
                      visitedArea: false,
                      noneAbove: false,
                      [id]: value,
                    },
                  })
                }
                initialCheck={dontKnowArea}
              />
              <Checkbox
                text={t('report.cov_contact.none_above')}
                id='noneAbove'
                setValue={(id, value) =>
                  setGlobalState({
                    type: 'ADD_ANSWERS',
                    value: {
                      liveIn: false,
                      visitedArea: false,
                      dontKnowArea: false,
                      [id]: value,
                    },
                  })
                }
                initialCheck={noneAbove}
              />

              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                {t('report.cov_contact.infected_contact_title')}
              </Text>
              <Text style={[styles.text, { marginBottom: 10 }]}>
                {t('report.cov_contact.infected_subtitle')}
              </Text>
              <Checkbox
                text={
                  usage === 'others'
                    ? t('report.cov_contact.live_with_others')
                    : t('report.cov_contact.live_with_myself')
                }
                id='liveWith'
                setValue={(id, value) =>
                  setSelectedOption(
                    id,
                    value,
                    'notExposed',
                    'dontKnowExposition',
                  )
                }
                initialCheck={liveWith}
              />
              <Checkbox
                text={
                  usage === 'others'
                    ? t('report.cov_contact.had_close_contact_others')
                    : t('report.cov_contact.had_close_contact_myself')
                }
                id='hadCloseContact'
                setValue={(id, value) =>
                  setSelectedOption(
                    id,
                    value,
                    'notExposed',
                    'dontKnowExposition',
                  )
                }
                initialCheck={hadCloseContact}
              />
              <Text
                style={[styles.text, { fontSize: 12, marginLeft: wp('9%') }]}>
                {usage === 'others'
                  ? t('report.cov_contact.had_close_contact_subtitle_others')
                  : t('report.cov_contact.had_close_contact_subtitle_myself')}
              </Text>
              <Checkbox
                text={
                  usage === 'others'
                    ? t('report.cov_contact.had_far_contact_others')
                    : t('report.cov_contact.had_far_contact_myself')
                }
                id='hadFarContact'
                setValue={(id, value) =>
                  setSelectedOption(
                    id,
                    value,
                    'notExposed',
                    'dontKnowExposition',
                  )
                }
                initialCheck={hadFarContact}
              />
              <Text
                style={[styles.text, { fontSize: 12, marginLeft: wp('9%') }]}>
                {usage === 'others'
                  ? t('report.cov_contact.had_far_contact_subtitle_others')
                  : t('report.cov_contact.had_far_contact_subtitle_myself')}
              </Text>
              <Checkbox
                text={
                  usage === 'others'
                    ? t('report.cov_contact.not_exposed_others')
                    : t('report.cov_contact.not_exposed_myself')
                }
                id='notExposed'
                setValue={(id, value) =>
                  setGlobalState({
                    type: 'ADD_ANSWERS',
                    value: {
                      liveWith: false,
                      hadCloseContact: false,
                      hadFarContact: false,
                      dontKnowExposition: false,
                      [id]: value,
                    },
                  })
                }
                initialCheck={notExposed}
              />
              <Text
                style={[styles.text, { fontSize: 12, marginLeft: wp('9%') }]}>
                {usage === 'others'
                  ? t('report.cov_contact.not_exposed_subtitle_others')
                  : t('report.cov_contact.not_exposed_subtitle_myself')}
              </Text>
              <Checkbox
                text={notKnow}
                id='dontKnowExposition'
                setValue={(id, value) =>
                  setGlobalState({
                    type: 'ADD_ANSWERS',
                    value: {
                      liveWith: false,
                      hadCloseContact: false,
                      hadFarContact: false,
                      notExposed: false,
                      [id]: value,
                    },
                  })
                }
                initialCheck={dontKnowExposition}
              />
              {(liveWith || hadCloseContact || hadFarContact) && (
                <View>
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                    {t('report.cov_contact.used_protection_title')}
                  </Text>
                  <ToggleButtons
                    options={[t('report.yes'), t('report.no')]}
                    onSelection={selected =>
                      setSelectedOption('usedProtection', selected)
                    }
                    selectedOption={usedProtection}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Content>
    </Container>
  );
};

export default StepCovidContact;
