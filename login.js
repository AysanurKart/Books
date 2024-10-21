import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native'; // Import CommonActions for stack manipulation

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const { username: storedUsername, password: storedPassword } = JSON.parse(userData);
        if (storedUsername === username && storedPassword === password) {
          // Store login status
          await AsyncStorage.setItem('isLoggedIn', 'true');
          Alert.alert('Success', 'Login successful!');
          // Navigate to the home screen
          navigation.navigate('Home');
        } else {
          Alert.alert('Error', 'Invalid username or password');
        }
      } else {
        Alert.alert('Error', 'User not found. Please create an account.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to login');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {/* Add a button to handle login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log Ind</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#FF5733', // Customize the button color
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // Button text color
    fontWeight: 'bold',
  },
});

export default LoginScreen;
