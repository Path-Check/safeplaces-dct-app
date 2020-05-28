import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PermissionsAndroid } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import sortByDistance from 'sort-by-distance';

import posIconHos from '../../../assets/images/pinPositiveHos.png';
import posIconLab from '../../../assets/images/pinPositiveLab.png';
import BottonUpPanel from '../../../components/DR/ButtonUpDrawer';
import {
  requestCovid19Hospitals,
  requestCovid19Laboratories,
} from '../../../helpers/Request';

const latitudeDelta = 0.0052;
const longitudeDelta = 0.0081;
const rdCoords = { latitude: 18.7009, longitude: -70.1655 };
const { height } = Dimensions.get('window');

export default function HospitalMap({ route: { name: type } }) {
  const [hospitals, setHospitals] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [coordinates, setCoordinates] = useState(rdCoords);
  const [bottomRef, setBottomRef] = useState(null);
  const [sortedMarkers, setSortedMarkers] = useState([]);

  // This is to change to hospitals or laboratories markers and icons depending on which screen you are
  const selectedMarker = type === 'Hospitals' ? hospitals : laboratories;
  const posIcon = type === 'Hospitals' ? posIconHos : posIconLab;
  useEffect(async () => {
    if (type === 'Hospitals') {
      const value = await requestCovid19Hospitals();
      setHospitals(value);
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          const sorted = sortByDistance({ latitude, longitude }, value, {
            yName: 'latitude',
            xName: 'longitude',
          });
          setSortedMarkers(sorted);
        },
        () => {},
        { enableHighAccuracy: true },
      );
    } else {
      await requestCovid19Laboratories().then(value => {
        setLaboratories(value);
        Geolocation.getCurrentPosition(
          ({ coords }) => {
            const { latitude, longitude } = coords;
            const sorted = sortByDistance({ latitude, longitude }, value, {
              yName: 'latitude',
              xName: 'longitude',
            });
            setSortedMarkers(sorted);
          },
          () => {},
          { enableHighAccuracy: true },
        );
      });
    }
  }, []);

  const getCurrentLocation = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted) {
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          setCoordinates({ latitude, longitude });
        },
        () => {},
        { enableHighAccuracy: true },
      );
    }
  };

  const goLocation = ({ latitude, longitude }) => {
    bottomRef.close();
    setCoordinates({ latitude, longitude });
  };

  const renderBottomUpPanelContent = () => (
    <View style={[styles.row, { flex: 0, backgroundColor: '#fff' }]}>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 100, paddingLeft: 5 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={sortedMarkers}
          keyExtractor={(item, index) => `list-item-${index}`}
          renderItem={({ item }) => {
            const { latitude, longitude, name, phone } = item;
            return (
              <View key={item.id} style={{ backgroundColor: 'white' }}>
                <TouchableOpacity
                  onPress={() => goLocation({ latitude, longitude })}>
                  <View style={styles.row}>
                    <View style={styles.itemImg}>
                      {type === 'Hospitals' ? (
                        <Icon name='hospital-o' size={22} color='#4372e8' />
                      ) : (
                        <Icon
                          name='thermometer-quarter'
                          size={22}
                          color='#4372e8'
                        />
                      )}
                    </View>
                    <View style={styles.listItem}>
                      <Text style={styles.title}>{name}</Text>
                      <Text style={styles.subtitle}>{phone}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </View>
  );

  const renderBottomUpPanelIcon = () => (
    <Icon name='angle-up' style={{ color: 'black' }} size={25} />
  );

  const renderBottomUpPanelHeader = (
    <View style={styles.listHeader}>
      {type === 'Hospitals' ? (
        <Icon name='hospital-o' size={22} color='#4372e8' />
      ) : (
        <Icon name='thermometer-quarter' size={22} color='#4372e8' />
      )}
      <Text style={styles.cardTitle}>
        {type === 'Hospitals' ? 'Hospitales' : 'Laboratorios'}
      </Text>
      <Text style={styles.cardText}>
        {`(${selectedMarker.length} acreditados)`}
      </Text>
    </View>
  );

  return (
    <View style={[styles.flexContainer]}>
      <View style={styles.flexContainer}>
        <MapView
          showsMyLocationButton={false}
          style={styles.map}
          region={{
            ...coordinates,
            latitudeDelta,
            longitudeDelta,
          }}
          initialRegion={{
            ...rdCoords,
            latitudeDelta,
            longitudeDelta,
          }}
          showsUserLocation>
          {selectedMarker.map(({ id, latitude, longitude }) => (
            <Marker
              image={posIcon}
              pinColor={posIcon}
              key={id}
              coordinate={{ latitude, longitude }}
            />
          ))}
        </MapView>

        <TouchableOpacity
          onPress={() => getCurrentLocation()}
          style={[styles.locationButtonContainer, styles.shadow]}>
          <Icon name='crosshairs' size={28} color='#333' />
        </TouchableOpacity>
      </View>

      <BottonUpPanel
        ref={component => setBottomRef(component)}
        content={renderBottomUpPanelContent}
        icon={renderBottomUpPanelIcon}
        topEnd={height - height * 0.7}
        startHeight={80}
        headerText={renderBottomUpPanelHeader}
        headerTextStyle={{
          backgroundColor: 'white',
        }}
        bottomUpSlideBtn={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'flex-start',
          backgroundColor: 'white',
          alignItems: 'center',
          paddingLeft: 15,
          paddingRight: 15,
          borderBottomColor: '#DDDDDD',
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomUpSlideBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
  },
  list: {
    height: '100%',
    width: wp('95%'),
    overflow: 'scroll',
    padding: 10,
    paddingBottom: 10,
  },
  listHeader: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  listItem: {
    padding: 10,
  },
  listContainer: {
    padding: 10,
  },
  borderRadius: {
    borderTopEndRadius: wp('10%'),
    borderTopStartRadius: wp('10%'),
  },
  box: {
    alignItems: 'center',
    backgroundColor: '#fff',
    bottom: 0,
    height: hp('100%'),
    left: 0,
    position: 'absolute',
    right: 0,
  },
  card: {
    backgroundColor: 'white',
    borderColor: '#d4d4d4',
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    height: hp('70%'),
    marginTop: hp('2%'),
    margin: 10,
    padding: 10,
    overflow: 'scroll',
  },
  itemImg: {
    alignSelf: 'center',
  },
  cardText: {
    color: 'grey',
    fontSize: 11,
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  flexContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  drawer: {
    flex: 1,
  },
  locationButtonContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    top: hp('3%'),
    right: wp('5%'),
    width: 50,
  },
  optionsTabContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    height: hp('10%'),
    justifyContent: 'space-between',
    maxHeight: 50,
    width: wp('100%'),
  },
  optionTab: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 15,
  },
  optionTabBorder: (name, filter) =>
    filter === name
      ? { borderBottomColor: 'black', borderBottomWidth: 3 }
      : null,
  text: {
    color: '#FFF',
    fontSize: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  shadow: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  swippable: {
    backgroundColor: '#d4d4d4',
    borderRadius: 2.5,
    height: 5,
    margin: 10,
    width: wp('20%'),
  },
});
