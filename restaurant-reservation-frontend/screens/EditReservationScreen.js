// screens/EditReservationScreen.js
import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, TouchableWithoutFeedback, Keyboard, Platform,
  Modal
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemeContext } from '../contexts/ThemeContext';

export default function EditReservationScreen({ route, navigation }) {
  const { reservation } = route.params;
  const { darkMode } = useContext(ThemeContext);

  // ─── Build local Date at noon to avoid back-shift ─────────────────────────
  const [date, setDate] = useState(() => {
    const [y, m, d] = reservation.date.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [time, setTime] = useState(() => {
    const [h, min, s = 0] = reservation.time.split(':').map(Number);
    return new Date(1970, 0, 1, h, min, s);
  });
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [peopleCount, setPeopleCount] = useState(reservation.people_count.toString());

  const handleUpdate = async () => {
    if (!peopleCount) return Alert.alert('Error','Enter # of people');
    try {
      const token = await AsyncStorage.getItem('token');
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
      const formattedTime = time.toTimeString().split(' ')[0];
      await axios.put(
        `http://192.168.1.146:5000/api/reservations/${reservation.reservation_id}`,
        { date: formattedDate, time: formattedTime, people_count: parseInt(peopleCount,10) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success','Updated!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message||'Failed');
    }
  };

  // onChange handler rebuilds pure-local date
  const onChangeDate = (_, selected) => {
    setShowDatePicker(false);
    if (selected) {
      const y = selected.getFullYear(),
            mo = selected.getMonth(),
            da = selected.getDate();
      setDate(new Date(y, mo, da, 12,0,0));
    }
  };

  const onChangeTime = (_, selected) => {
    setShowTimePicker(false);
    if (selected) setTime(selected);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: darkMode?'#121212':'#f2f2f2' }]}>
        <View style={[styles.card, { backgroundColor: darkMode?'#1e1e1e':'#fff' }]}>
          <Text style={[styles.title, { color: darkMode?'#fff':'#333' }]}>
            Edit Reservation
          </Text>

          {/* Date */}
          <TouchableOpacity onPress={()=>setShowDatePicker(true)} style={styles.pickerButton}>
            <Text style={[styles.pickerText, { color: darkMode?'#fff':'#333' }]}>Select Date</Text>
          </TouchableOpacity>
          <Text style={[styles.selectedText, { color: darkMode?'#ccc':'#555' }]}>
            {`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
          </Text>
          {showDatePicker && (
            <Modal transparent animationType="slide">
              <View style={styles.overlay}>
                <View style={[styles.modal, { backgroundColor: darkMode?'#1e1e1e':'#fff' }]}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS==='android'?'spinner':'inline'}
                    display={Platform.OS === 'ios' ? 'spinner' : 'inline'}
                    themeVariant={darkMode?'dark':'light'}
                    textColor={darkMode?'#fff':'#000'}
                    onChange={(e, selected) => {
                     if (selected) setDate(selected);
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.doneButton, { backgroundColor: darkMode?'#4a90e2':'#007aff' }]}
                    onPress={()=>setShowDatePicker(false)}
                  >
                    <Text style={styles.doneText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {/* Time */}
          <TouchableOpacity onPress={()=>setShowTimePicker(true)} style={styles.pickerButton}>
            <Text style={[styles.pickerText, { color: darkMode?'#fff':'#333' }]}>Select Time</Text>
          </TouchableOpacity>
          <Text style={[styles.selectedText, { color: darkMode?'#ccc':'#555' }]}>
            {time.toTimeString().split(' ')[0]}
          </Text>
          {showTimePicker && (
            <Modal transparent animationType="slide">
              <View style={styles.overlay}>
                <View style={[styles.modal, { backgroundColor: darkMode?'#1e1e1e':'#fff' }]}>
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display={Platform.OS==='android'?'spinner':'inline'}
                    themeVariant={darkMode?'dark':'light'}
                    textColor={darkMode?'#fff':'#000'}
                    onChange={(e, selected) => {
                    if (selected) setTime(selected);
                     }}
                  />
                  <TouchableOpacity
                    style={[styles.doneButton, { backgroundColor: darkMode?'#4a90e2':'#007aff' }]}
                    onPress={()=>setShowTimePicker(false)}
                  >
                    <Text style={styles.doneText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: darkMode?'#2a2a2a':'#f9f9f9',
                color: darkMode?'#fff':'#333',
                borderColor: darkMode?'#444':'#ddd'
              }
            ]}
            placeholder="Number of People"
            placeholderTextColor={darkMode?'#777':'#999'}
            value={peopleCount}
            onChangeText={setPeopleCount}
            keyboardType="numeric"
          />

          <TouchableOpacity style={[styles.submit, { backgroundColor: darkMode?'#4a90e2':'#007aff' }]} onPress={handleUpdate}>
            <Text style={styles.submitText}>Update Reservation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, justifyContent:'center' },
  card: {
    borderRadius:16,
    padding:24,
    shadowColor:'#000',
    shadowOffset:{width:0,height:4},
    shadowOpacity:0.1,
    shadowRadius:8,
    elevation:6,
  },
  title:{fontSize:24,fontWeight:'700',textAlign:'center',marginBottom:20},
  pickerButton:{alignSelf:'center',paddingVertical:8},
  pickerText:{fontSize:18,fontWeight:'500'},
  selectedText:{fontSize:16,textAlign:'center',marginBottom:12},
  overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.3)',justifyContent:'flex-end'},
  modal:{padding:16,borderTopLeftRadius:12,borderTopRightRadius:12},
  doneButton:{borderRadius:8,padding:12,alignItems:'center',marginTop:8},
  doneText:{color:'#fff',fontSize:16,fontWeight:'600'},
  input:{borderWidth:1,borderRadius:8,padding:12,marginVertical:16,fontSize:16},
  submit:{borderRadius:8,paddingVertical:14,alignItems:'center',marginTop:8},
  submitText:{color:'#fff',fontSize:18,fontWeight:'600'},
});
