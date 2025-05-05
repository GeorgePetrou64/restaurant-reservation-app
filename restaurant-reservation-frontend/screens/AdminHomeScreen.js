// screens/AdminHomeScreen.js
import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../contexts/ThemeContext';
import { BASE_URL } from '../components/config';

export default function AdminHomeScreen({ navigation }) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [stats, setStats] = useState({ users: 0, reservations: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats({ users: data.users, reservations: data.reservations });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to load stats');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: darkMode ? '#121212' : '#f2f2f2' }]}>  
        <ActivityIndicator size="large" color={darkMode ? '#fff' : '#333'} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#f2f2f2' }]}>      
      {/* Dark Mode Toggle */}
      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, { color: darkMode ? '#fff' : '#333' }]}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <Text style={[styles.heading, { color: darkMode ? '#fff' : '#333' }]}>Admin Dashboard</Text>

      {/* Stats Display */}
      <View style={[styles.statsContainer, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>        
        <Text style={[styles.statText, { color: darkMode ? '#fff' : '#333' }]}>Total Users: {stats.users}</Text>
        <Text style={[styles.statText, { color: darkMode ? '#fff' : '#333' }]}>Total Reservations: {stats.reservations}</Text>
      </View>

      {/* Quick Action Buttons */}
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: '#007aff' }]}
        onPress={() => navigation.navigate('AdminReservations')}
      >
        <Text style={styles.actionText}>View All Reservations</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: '#34c759' }]}
        onPress={() => navigation.navigate('AdminUsers')}
      >
        <Text style={styles.actionText}>Manage Users</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: '#ff3b30' }]}
        onPress={handleLogout}
      >
        <Text style={styles.actionText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  toggleLabel: { fontSize: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  statsContainer: { padding: 16, borderRadius: 12, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  statText: { fontSize: 18, marginBottom: 8 },
  actionBtn: { paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
