// screens/ReservationScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemeContext } from '../contexts/ThemeContext';

export default function ReservationScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const { darkMode } = useContext(ThemeContext);

  // State
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [peopleCount, setPeopleCount] = useState('');

  // Save reservation
  const handleReservation = async () => {
    if (!peopleCount) {
      return Alert.alert('Error', 'Please enter number of people.');
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `http://192.168.1.146:5000/api/reservations`,
        {
          restaurant_id: restaurant.restaurant_id,
          date: date.toISOString().split('T')[0],
          time: time.toTimeString().split(' ')[0],
          people_count: parseInt(peopleCount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Reservation created!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#f2f2f2' }]}>
        <View style={[styles.card, { backgroundColor: darkMode ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.title, { color: darkMode ? '#fff' : '#333' }]}>
            Reserve at {restaurant.name}
          </Text>

          {/* Select Date */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.pickerButton}>
            <Text style={[styles.pickerText, { color: darkMode ? '#fff' : '#333' }]}>
              Select Date
            </Text>
          </TouchableOpacity>
          <Text style={[styles.selectedText, { color: darkMode ? '#ccc' : '#555' }]}>
            {date.toISOString().split('T')[0]}
          </Text>

          {/* Date Picker Modal */}
            {showDatePicker && (
    <Modal transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: darkMode ? '#1e1e1e' : '#fff' }]}>

        <DateTimePicker
            value={date}
            mode="date"
   
           display={Platform.OS === 'android' ? 'spinner' : 'inline'}  
           display={Platform.OS === 'ios' ? 'spinner' : 'inline'}  
         
           themeVariant={darkMode ? 'dark' : 'light'}
           textColor={darkMode ? '#fff' : '#000'}
           accentColor={darkMode ? '#fff' : '#000'}
           onChange={(e, selected) => {
             if (selected) setDate(selected);
           }}
          />
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: darkMode ? '#4a90e2' : '#007aff' }]}
            onPress={() => setShowDatePicker(false)}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )}


          {/* Select Time */}
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.pickerButton}>
            <Text style={[styles.pickerText, { color: darkMode ? '#fff' : '#333' }]}>
              Select Time
            </Text>
          </TouchableOpacity>
          <Text style={[styles.selectedText, { color: darkMode ? '#ccc' : '#555' }]}>
            {time.toTimeString().split(' ')[0]}
          </Text>

          {/* Time Picker Modal */}
          {showTimePicker && (
    <Modal transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: darkMode ? '#1e1e1e' : '#fff' }]}>
         <DateTimePicker
            value={time}
            mode="time"      
           display={Platform.OS === 'android' ? 'spinner' : 'inline'}
           themeVariant={darkMode ? 'dark' : 'light'}
           textColor={darkMode ? '#fff' : '#000'}
           accentColor={darkMode ? '#fff' : '#000'}
            onChange={(e, selected) => {
              if (selected) setTime(selected);
            }}
          />
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: darkMode ? '#4a90e2' : '#007aff' }]}
            onPress={() => setShowTimePicker(false)}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )}

          {/* People Count */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: darkMode ? '#2a2a2a' : '#f9f9f9',
                color: darkMode ? '#fff' : '#333',
                borderColor: darkMode ? '#444' : '#ddd',
              },
            ]}
            placeholder="Number of People"
            placeholderTextColor={darkMode ? '#777' : '#999'}
            value={peopleCount}
            onChangeText={setPeopleCount}
            keyboardType="numeric"
          />

          {/* Book Now */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: darkMode ? '#4a90e2' : '#007aff' }]}
            onPress={handleReservation}
          >
            <Text style={styles.submitText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  card: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  pickerButton: { alignSelf: 'center', paddingVertical: 8 },
  pickerText: { fontSize: 18, fontWeight: '500' },
  selectedText: { fontSize: 16, textAlign: 'center', marginBottom: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  modalContent: { padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  doneButton: { borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 8 },
  doneText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginVertical: 16, fontSize: 16 },
  submitButton: { borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
