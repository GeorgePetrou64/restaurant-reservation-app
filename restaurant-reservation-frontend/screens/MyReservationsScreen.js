// screens/MyReservationsScreen.js
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

// ─── AnimatedReservationCard ───────────────────────────────────────────────────
function AnimatedReservationCard({ item, index, onCancel, onEdit }) {
  const { darkMode } = useContext(ThemeContext);
  const fade = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fade.setValue(0);
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, [fade, index])
  );

  const formatDate = iso => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const formatTime = timeStr => {
  const [h, m] = timeStr.split(':');
  return `${h.padStart(2,'0')}:${m.padStart(2,'0')}`;
};


     return (
    <Animated.View style={[styles.cardWrapper, { opacity: fade }]}>
      <View style={[styles.card, { backgroundColor: darkMode ? '#222' : '#fff' }]}>
       <Text style={[styles.name, { color: darkMode ? '#fff' : '#333' }]}>
          {item.restaurant_name}
        </Text>
      <Text style={[styles.detail, { color: darkMode ? '#ccc' : '#555' }]}>
        {formatDate(item.date)} at {formatTime(item.time)}
        </Text>
        <Text style={[styles.detail, { color: darkMode ? '#ccc' : '#555' }]}>
          {item.people_count} people
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.cancelBtn, { borderColor: '#ff3b30' }]}
            onPress={() => onCancel(item.reservation_id)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: '#007aff' }]}
            onPress={() => onEdit(item)}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── MyReservationsScreen ──────────────────────────────────────────────────────
export default function MyReservationsScreen({ navigation }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(ThemeContext);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const { data } = await axios.get(
        'http://192.168.1.146:5000/api/reservations/my',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  // ← runs every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchReservations();
    }, [])
  );

  const handleCancel = id => {
    Alert.alert(
      'Cancel Reservation?',
      'Are you sure you want to cancel this?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(
                `http://192.168.1.146:5000/api/reservations/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              fetchReservations();
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Could not cancel reservation.');
            }
          }
        }
      ]
    );
  };

  const handleEdit = item => {
    navigation.navigate('EditReservation', { reservation: item });
  };

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: darkMode ? '#121212' : '#f2f2f2' }
        ]}
      >
        <ActivityIndicator size="large" color={darkMode ? '#fff' : '#333'} />
      </View>
    );
  }

  if (!reservations.length) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: darkMode ? '#121212' : '#f2f2f2' }
        ]}
      >
        <Text style={{ color: darkMode ? '#fff' : '#333' }}>
          No reservations yet.
        </Text>
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
      <FlatList
        data={reservations}
        keyExtractor={r => r.reservation_id.toString()}
        renderItem={({ item, index }) => (
          <AnimatedReservationCard
            item={item}
            index={index}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  cardWrapper: { marginBottom: 16 },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  detail: { fontSize: 14, marginBottom: 4 },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 8
  },
  cancelText: { color: '#ff3b30', fontWeight: '600' },
  editBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center'
  },
  editText: { color: '#fff', fontWeight: '600' }
});
