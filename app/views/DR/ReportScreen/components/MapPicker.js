import React from 'react';
import { View } from 'native-base';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Image } from 'react-native';

import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Geocoder from 'react-native-geocoding';
import posIcon from '../assets/images/pinRecovered.png';

const latDelta = 0.0052;
const longDelta = 0.0081;
const rdCoords = { latitude: 18.7009, longitude: -70.1655 };

const mystyles = {
  mapField: {
    height: hp('45%'),
  },
  mapOverlay: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    bottom: 10,
    dispatch: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayPin: {
    width: 20,
    height: 20,
  },
};

export default function MapPicker({
  coordinates,
  latitudeDelta = latDelta,
  longitudeDelta = longDelta,
  handleOnChange,
  handleOnLocationError,
}) {
  const handleLocationChange = (latitude, longitude) => {
    handleOnChange({ coordinates: { latitude, longitude } });
    Geocoder.from(latitude, longitude)
      .then((json) => {
        const address = json.results[0].formatted_address;
        handleOnChange({ address });
      })
      .catch((error) => {
        handleOnLocationError(error);
      });
  };

  return (
    <View style={mystyles.mapField}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
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
        onRegionChangeComplete={({ latitude, longitude }) => handleLocationChange(
          latitude, longitude,
        )}
      />
      <View style={mystyles.mapOverlay}>
        <Image
          source={posIcon}
          width={20}
          style={mystyles.mapOverlayPin}
        />
      </View>
    </View>
  );
}
