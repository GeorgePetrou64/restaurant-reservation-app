// screens/HomeScreen.js
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  TextInput
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');

  const fetchRestaurants = async (q = '') => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const url   = q
        ? `http://192.168.1.146:5000/api/restaurants?q=${encodeURIComponent(q)}`
        : 'http://192.168.1.146:5000/api/restaurants';
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#000' : '#fff' }]}>
      {/* Search bar + button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchBar,
            {
              backgroundColor: darkMode ? '#222' : '#eee',
              color: darkMode ? '#fff' : '#333',
              borderColor: darkMode ? '#555' : '#ccc',
            }
          ]}
          placeholder="Search by name or location…"
          placeholderTextColor={darkMode ? '#777' : '#888'}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={[
            styles.searchButton,
            { backgroundColor: darkMode ? '#4a90e2' : '#007aff' }
          ]}
          onPress={() => fetchRestaurants(search)}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={darkMode ? '#fff' : '#333'} />
        </View>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={item => item.restaurant_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.restaurantItem,
                { backgroundColor: darkMode ? '#333' : '#fff' }
              ]}
              onPress={() => navigation.navigate('Reserve', { restaurant: item })}
            >
              <Text style={[styles.restaurantName, { color: darkMode ? '#fff' : '#333' }]}>
                {item.name}
              </Text>
              <Text style={[styles.restaurantLocation, { color: darkMode ? '#aaa' : '#555' }]}>
                {item.location}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loadingContainer: { flex:1,justifyContent:'center',alignItems:'center' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  restaurantItem: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  restaurantLocation: {
    fontSize: 14,
    marginTop: 4,
  },
});
