// screens/ProfileScreen.js
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';

export default function ProfileScreen({ navigation }) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('Login');
          return;
        }
        // 🔥 Corrected endpoint:
        const res = await axios.get(
          'http://192.168.1.146:5000/api/users/me',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data); // { user_id, name, email, role }
      } catch (err) {
        console.error(err);
        Alert.alert(
          'Error',
          'Could not load profile. Please log in again.'
        );
        await AsyncStorage.clear();
        navigation.replace('Login');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: darkMode ? '#121212' : '#f2f2f2' }
        ]}
      >
        <ActivityIndicator
          size="large"
          color={darkMode ? '#fff' : '#333'}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#121212' : '#f2f2f2' }
      ]}
    >
      <Text style={[styles.title, { color: darkMode ? '#fff' : '#333' }]}>
        Profile
      </Text>
      {user && (
        <>
          <Text
            style={[styles.label, { color: darkMode ? '#fff' : '#333' }]}
          >
            Name: {user.name}
          </Text>
          <Text
            style={[styles.label, { color: darkMode ? '#fff' : '#333' }]}
          >
            Email: {user.email}
          </Text>
          <Text
            style={[styles.label, { color: darkMode ? '#fff' : '#333' }]}
          >
            Role: {user.role}
          </Text>
        </>
      )}

      <View style={styles.row}>
        <Text style={{ color: darkMode ? '#fff' : '#333', fontSize: 16 }}>
          Dark Mode
        </Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 18, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
