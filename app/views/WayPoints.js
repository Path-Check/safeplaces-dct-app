import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, { Component } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';

import languages from './../locales/languages';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { WAYPOINTS_API } from '../constants/apis';
import Colors from '../constants/colors';
import CustomCircle from '../helpers/customCircle';

const InitialRegion = {
  latitude: 35.692863,
  longitude: -98.090517,
  latitudeDelta: 55,
  longitudeDelta: 55,
};

/**
 * Component to display points returned by WayPoints API
 */
class WayPointsScreen extends Component {
  map = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      region: InitialRegion,
      loading: true,
      locationDataForLine: [],
      locationDataForCircle: [],
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getCurrentLocation();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  getCurrentLocation() {
    Geolocation.getCurrentPosition(
      position => {
        if (position && position.coords) {
          this.postWayPoints(
            position.coords.latitude,
            position.coords.longitude,
          );
        }
      },
      error => {
        console.log('get current position error: ' + JSON.stringify(error));
      },
    );
  }

  async postWayPoints(latitude, longitude) {
    // Comment out to fake location data for now until we have
    // minimu 2 required
    const locationData = [
      { latitude: 40.703271, longitude: -74.053579 },
      { latitude: 37.7118, longitude: -121.864 },
    ];
    // const locationService = new LocationData();
    // const locationData = await locationService.getLocationData();
    if (locationData.length > 1) {
      // has location data, proceed with upload
      const postData = [];
      for (let i = 0; i < locationData.length; i++) {
        postData.push({
          id: '00010203-0405-0607-0809-0a0b0c0d0e0f',
          timestamp: '2020-04-11T22:47:10',
          point: {
            lat: locationData[i].latitude,
            lon: locationData[i].longitude,
          },
        });
      }
      axios
        .post(WAYPOINTS_API, postData)
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          console.log('Waypoints Upload Success');
          this.getWayPoints(latitude, longitude);
        })
        .catch(error => {
          console.error(`Waypoints Upload Success, ${error}`);
          this.getWayPoints(latitude, longitude);
        });
    } else {
      this.getWayPoints(latitude, longitude);
    }
  }

  async getWayPoints(latitude, longitude) {
    const url = `${WAYPOINTS_API}?lat=${latitude}&lon=${longitude}&radius=50`;
    axios
      .get(url)
      .then(res => {
        const fullLocationData = res.data.data;

        const locationDataForLine = [];
        const locationDataForCircle = [];
        for (let i = 0; i < fullLocationData.length; i++) {
          const location = fullLocationData[i];
          const lat = parseFloat(location.point.lat);
          const lon = parseFloat(location.point.lon);
          locationDataForLine.push({
            latitude: lat,
            longitude: lon,
          });
          locationDataForCircle.push({
            key: `circle ${i}`,
            center: {
              latitude: lat,
              longitude: lon,
            },
          });
        }
        const region = this.getRegionForCoordinates(
          latitude,
          longitude,
          locationDataForLine,
        );
        this.setState({
          region,
          locationDataForLine,
          locationDataForCircle,
          loading: false,
        });
      })
      .catch(error => {
        console.log('get Waypoints error: ' + JSON.stringify(error));
      });
  }

  getRegionForCoordinates(latitude, longitude, points) {
    // points should be an array of { latitude: X, longitude: Y }
    let minX = latitude;
    let maxX = latitude;
    let minY = longitude;
    let maxY = longitude;

    // calculate rect
    points.map(point => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });

    // add default padding on delta
    const defaultPadding = 0.01;
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    let deltaX = maxX - minX + defaultPadding;
    let deltaY = maxY - minY + defaultPadding;

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY,
    };
  }

  renderLoading() {
    const { loading } = this.state;
    if (!loading) {
      return null;
    }
    return <ActivityIndicator style={styles.loading} size='large' />;
  }

  renderMap() {
    const { region, locationDataForLine, locationDataForCircle } = this.state;

    return (
      <MapView
        ref={ref => {
          this.map = ref;
        }}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        loadingEnabled
        showsUserLocation>
        <Polyline
          coordinates={locationDataForLine}
          strokeColor={Colors.MAP_LINE_STROKE}
          strokeWidth={1}
        />
        {locationDataForCircle.map(circle => (
          <CustomCircle
            key={circle.key}
            center={circle.center}
            radius={20}
            lineCap='round'
            lineJoin='round'
            strokeWidth={5}
            strokeColor={Colors.MAP_LINE_STROKE}
            fillColor={Colors.MAP_LINE_STROKE}
          />
        ))}
      </MapView>
    );
  }

  render() {
    return (
      <NavigationBarWrapper
        title={languages.t('waypoints.title')}
        onBackPress={this.backToMain.bind(this)}>
        <View style={styles.mainContainer}>
          {this.renderMap()}
          {this.renderLoading()}
        </View>
      </NavigationBarWrapper>
    );
  }
}

const styles = StyleSheet.create({
  // Container covers the entire screen
  mainContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loading: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.DARK_ALPHA,
    width: '100%', // applied to Image
    height: '100%',
  },
});

export default WayPointsScreen;
