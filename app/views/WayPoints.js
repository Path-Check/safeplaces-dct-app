import Geolocation from '@react-native-community/geolocation';
import React, { Component } from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
} from 'react-native';
import MapView , { Circle, PROVIDER_DEFAULT, Polyline } from 'react-native-maps';

import languages from './../locales/languages';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import {WAYPOINTS_API} from '../constants/apis';
import Colors from '../constants/colors';

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
    Geolocation.getCurrentPosition(
      position => {
        if (position && position.coords) {
          this.getWayPoints(position.coords.latitude, position.coords.longitude);
        }
      },
      error => {
        console.log('get current position error: ' + JSON.stringify(error));
      },
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  
  async getWayPoints(latitude, longitude) {
    const url = `${WAYPOINTS_API}?lat=${latitude}&lon=${longitude}&radius=50`
    const response = await fetch(url);
    const json = await response.json();
    const fullLocationData = json.data

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
    const region = this.getRegionForCoordinates(latitude, longitude, locationDataForLine)
    this.setState({
      region,
      locationDataForLine,
      locationDataForCircle,
    });
  }
  
 getRegionForCoordinates(latitude, longitude, points) {
    // points should be an array of { latitude: X, longitude: Y }
    let minX = latitude;
    let maxX = latitude;
    let minY = longitude;
    let maxY = longitude;
  
    // calculate rect
    points.map((point) => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });
  
    // add default padding on delta
    const defaultPadding = 0.01
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    let deltaX = (maxX - minX) + defaultPadding;
    let deltaY = (maxY - minY) + defaultPadding;
  
    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY
    };
  }
  renderMap() {
    const {region, locationDataForLine, locationDataForCircle} = this.state;

    return (
      <MapView
      ref={ref => { this.map = ref }}
      provider={PROVIDER_DEFAULT}
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
        <Circle
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
});

export default WayPointsScreen;
