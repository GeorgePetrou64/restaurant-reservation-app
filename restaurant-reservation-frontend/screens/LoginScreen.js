// screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../components/config';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      navigation.replace('Home');
    }
  };
  checkToken();
}, []);

    
    
    

  const handleLogin = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/login`, {
      email,
      password,
    });

    const token = response.data.token;
    await AsyncStorage.setItem('token', token);

    const userResponse = await axios.get(`${BASE_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userRole = userResponse.data.role;

    if (userRole === 'admin') {
      navigation.replace('AdminHome');
    } else {
      navigation.replace('Home');
    }

  } catch (error) {
    console.error(error);
    Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
});
