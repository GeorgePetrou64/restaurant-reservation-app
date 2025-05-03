// App.js
import React, { useContext } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'; // adjust path!
import UserTabs from './components/UserTabs'; // adjust path!

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ReservationScreen from './screens/ReservationScreen';
import MyReservationsScreen from './screens/MyReservationsScreen';
import AdminHomeScreen from './screens/AdminHomeScreen';
import AdminReservationsScreen from './screens/AdminReservationsScreen';
import EditReservationScreen from './screens/EditReservationScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminUsersScreen from './screens/AdminUsersScreen';

const Stack = createNativeStackNavigator();

// 🌟 Create MainApp that uses useContext
function MainApp() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={darkMode ? "#000" : "#f0f4f7"}
      />
      <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => <UserTabs {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Reserve" component={ReservationScreen} />
          <Stack.Screen name="MyReservations" component={MyReservationsScreen} />
          <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
          <Stack.Screen name="AdminReservations" component={AdminReservationsScreen} />
          <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
          <Stack.Screen name="EditReservation" component={EditReservationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

// 🌟 Export App wrapped in ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

