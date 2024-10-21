// opret.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateUserScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateUser = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    // Store user data in AsyncStorage
    try {
      const userData = { username, password };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      Alert.alert('Success', 'User created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create user');
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
      <Button title="Create User" onPress={handleCreateUser} />
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
});

export default CreateUserScreen;
