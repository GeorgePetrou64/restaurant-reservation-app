// /navigation/UserTabs.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MyReservationsScreen from '../screens/MyReservationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import React from 'react';

const Tab = createBottomTabNavigator();

export default function UserTabs({ darkMode, setDarkMode }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Restaurants">
        {(props) => <HomeScreen {...props} darkMode={darkMode} />}
      </Tab.Screen>
      <Tab.Screen name="MyReservations">
        {(props) => <MyReservationsScreen {...props} darkMode={darkMode} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} darkMode={darkMode} setDarkMode={setDarkMode} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
