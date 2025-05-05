// screens/AdminReservationsScreen.js
import React, { useState, useRef, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Animated
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../contexts/ThemeContext';
import { BASE_URL } from '../components/config';

export default function AdminReservationsScreen() {
  const { darkMode } = useContext(ThemeContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/reservations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to load reservations');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever screen focuses
  useFocusEffect(
    useCallback(() => {
      fetchReservations();
    }, [])
  );

  const confirmDelete = id => {
    Alert.alert(
      'Delete Reservation?',
      'This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(id)
        }
      ]
    );
  };

  const handleDelete = async id => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(
        `${BASE_URL}/api/admin/reservations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Deleted', 'Reservation has been deleted');
      fetchReservations();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to delete');
    }
  };

  const formatDate = iso => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const formatTime = timeStr => {
    const [h, m] = timeStr.split(':');
    return `${h.padStart(2,'0')}:${m.padStart(2,'0')}`;
  };

  // Animated card component
  const ReservationCard = ({ item, index }) => {
    const fade = useRef(new Animated.Value(0)).current;
    useFocusEffect(
      useCallback(() => {
        fade.setValue(0);
        Animated.timing(fade, {
          toValue: 1,
          duration: 400,
          delay: index * 80,
          useNativeDriver: true
        }).start();
      }, [fade, index])
    );

    return (
      <Animated.View style={[styles.cardWrapper, { opacity: fade }]}>
        <View style={[styles.card, { backgroundColor: darkMode ? '#333' : '#fff' }]}>
          <Text style={[styles.user, { color: darkMode ? '#fff' : '#333' }]}>
            {item.user_name}
          </Text>
          <Text style={[styles.restaurant, { color: darkMode ? '#ccc' : '#555' }]}>
            {item.restaurant_name}
          </Text>
          <Text style={[styles.detail, { color: darkMode ? '#ccc' : '#555' }]}>
            {formatDate(item.date)} @ {formatTime(item.time)}
          </Text>
          <Text style={[styles.detail, { color: darkMode ? '#ccc' : '#555' }]}>
            {item.people_count} people
          </Text>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => confirmDelete(item.reservation_id)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
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
      <FlatList
        data={reservations}
        keyExtractor={item => item.reservation_id.toString()}
        renderItem={({ item, index }) => (
          <ReservationCard item={item} index={index} />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  cardWrapper: { marginBottom: 12 },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3
  },
  user: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  restaurant: { fontSize: 16, marginBottom: 4 },
  detail: { fontSize: 14, marginBottom: 4 },

  deleteBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#ff3b30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  deleteText: { color: '#fff', fontWeight: '600' }
});
