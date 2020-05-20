import React from 'react';  
import { View } from 'react-native';  
import { createAppContainer} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import LocationTracking from './views/LocationTracking';
import EntryScreen from './Entry';


import Icon from 'react-native-vector-icons/Ionicons';

const TabNavigator = createBottomTabNavigator(  
    {  
        Home: { screen: EntryScreen,  
            navigationOptions:{  
                tabBarLabel:'Home',  
                tabBarIcon: ({ tintColor }) => (  
                    <View name="home" >  
                        <Icon style={[{color: tintColor}]} size={25} name={'ios-home'}/>  
                    </View>),  
            }  
        },  
        Image: { screen: LocationTracking,  
            navigationOptions:{  
                tabBarLabel:'Location',  
                tabBarIcon: ({ tintColor }) => (  
                    <View name="radio">  
                        <Icon style={[{color: tintColor}]} size={25} name={'ios-radio'}/>  
                    </View>),  
                activeColor: '#615af6',  
                inactiveColor: '#46f6d7',  
                barStyle: { backgroundColor: '#67baf6' },  
            }  
        },  
    },  
    {  
      initialRouteName: "Home",
      activeColor: '#f0edf6', 
      inactiveColor: '#226557',  
      barStyle: { backgroundColor: '#3BAD87' },
    },
);

const NavEntry = createAppContainer(TabNavigator);
  
export default NavEntry;  
