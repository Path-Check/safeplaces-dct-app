import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  Entypo,
} from '@expo/vector-icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import sortByDistance from 'sort-by-distance';

import BottomUpPanel from './components/BottomUpDrawer';
import Colors from '../../constants/Colors';
import context from '../../components/reduces/context';
import posIconHos from '../../assets/images/pinPositive.png';
import posIconLab from '../../assets/images/pinPositive2.png';

const latitudeDelta = 0.0052;
const longitudeDelta = 0.0081;
const rdCoords = { latitude: 18.7009, longitude: -70.1655 };
const { height } = Dimensions.get('window');

export default function HospitalMap({
  navigation,
  route: { name: routeName },
}) {
  const [globaState] = useContext(context);
  const { hospitals, laboratories } = globaState;
  const [coordinates, setCoordinates] = useState(rdCoords);
  const [sortedMarkers, setSortedMarkers] = useState([]);

  // This is to change to hospitals or laboratories markers and icons depending on which screen you are
  const selectedMarker = routeName === 'Hospitales' ? hospitals : laboratories;
  const posIcon = routeName === 'Hospitales' ? posIconHos : posIconLab;

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Map' });
    getCurrentLocation().then(({ latitude, longitude }) => {
      const sorted = sortByDistance({ latitude, longitude }, selectedMarker, {
        yName: 'latitude',
        xName: 'longitude',
      });
      setSortedMarkers(sorted);
    });
  }, []);

  const getCurrentLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      const { latitude, longitude } = (
        await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
      ).coords;
      setCoordinates({ latitude, longitude });

      return { latitude, longitude };
    }
  };

  const goLocation = ({ latitude, longitude }) => {
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
                  onPress={() => goLocation({ latitude, longitude })}
                >
                  <View style={styles.row}>
                    <View style={styles.itemImg}>
                      {routeName === 'Hospitales' ? (
                        <FontAwesome5
                          name="hospital-alt"
                          size={22}
                          color="#4372e8"
                        />
                      ) : (
                        <Entypo name="lab-flask" size={22} color="#4372e8" />
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
    <Ionicons name="ios-arrow-up" style={{ color: 'black' }} size={25} />
  );

  const renderBottomUpPanelHeader = (
    <View style={styles.listHeader}>
      {routeName === 'Hospitales' ? (
        <FontAwesome5 name="hospital-alt" size={22} color="#4372e8" />
      ) : (
        <Entypo name="lab-flask" size={22} color="#4372e8" />
      )}
      <Text style={styles.cardTitle}>{routeName}</Text>
      <Text
        style={styles.cardText}
      >{`(${selectedMarker.length} acreditados)`}</Text>
    </View>
  );

  return (
    <View style={[styles.flexContainer]}>
      <View style={styles.flexContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
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
          showsUserLocation
          showsMyLocationButton
        >
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
          style={[styles.locationButtonContainer, styles.shadow]}
        >
          <MaterialIcons name="my-location" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <BottomUpPanel
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
  optionTabBorder: (name, filter, color) =>
    filter === name
      ? { borderBottomColor: Colors.map[color], borderBottomWidth: 3 }
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
