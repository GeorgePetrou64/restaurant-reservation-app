// screens/AdminUsersScreen.js
import React, { useState, useRef, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
  Animated
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../contexts/ThemeContext';
import { BASE_URL } from '../components/config';

// ─── AnimatedUserCard Component ─────────────────────────────────────────────
function AnimatedUserCard({ user, index, onDelete, onToggleRole }) {
  const { darkMode } = useContext(ThemeContext);
  const fade = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fade.setValue(0);
      Animated.timing(fade, {
        toValue: 1,
        duration: 300,
        delay: index * 80,
        useNativeDriver: true,
      }).start();
    }, [fade, index])
  );

  return (
    <Animated.View style={[styles.cardWrapper, { opacity: fade }]}>        
      <View style={[styles.card, { backgroundColor: darkMode ? '#333' : '#fff' }]}>
        <Text style={[styles.name, { color: darkMode ? '#fff' : '#333' }]}>
          {user.name}
        </Text>
        <Text style={[styles.email, { color: darkMode ? '#ccc' : '#555' }]}>  
          {user.email}
        </Text>
        <Text style={[styles.role, { color: darkMode ? '#aaa' : '#666' }]}>    
          Role: {user.role}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.roleBtn, { backgroundColor: '#007aff' }]}
            onPress={() => onToggleRole(user)}
          >
            <Text style={styles.roleBtnText}>
              {user.role === 'admin' ? 'Demote' : 'Promote'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() =>
              Alert.alert(
                'Delete User?',
                'This will remove the user permanently.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => onDelete(user.user_id) }
                ]
              )
            }
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── AdminUsersScreen ─────────────────────────────────────────────────────────
export default function AdminUsersScreen() {
  const { darkMode } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const { data } = await axios.get(
        `${BASE_URL}/api/admin/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const handleDelete = async userId => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(
        `${BASE_URL}/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleRole = async user => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${BASE_URL}/api/admin/users/${user.user_id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch {
      Alert.alert('Error', 'Unable to update role');
    }
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
        data={users}
        keyExtractor={item => item.user_id.toString()}
        renderItem={({ item, index }) => (
          <AnimatedUserCard
            user={item}
            index={index}
            onDelete={handleDelete}
            onToggleRole={handleToggleRole}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
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
  name: { fontSize: 18, fontWeight: '600' },
  email: { fontSize: 14, marginBottom: 4 },
  role: { fontSize: 14, marginBottom: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  roleBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 8
  },
  roleBtnText: { color: '#fff', fontWeight: '600' },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center'
  },
  deleteText: { color: '#fff', fontWeight: '600' }
});
