import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To manage login state

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        // Replace this with your actual authentication logic
        const validUsername = 'user'; // Example valid username
        const validPassword = 'password'; // Example valid password

        if (username === validUsername && password === validPassword) {
            // Save login state to AsyncStorage
            await AsyncStorage.setItem('isLoggedIn', 'true');
            Alert.alert('Login Successful', 'You are now logged in!');
            navigation.navigate('Home'); // Navigate to the home screen after login
        } else {
            Alert.alert('Login Failed', 'Invalid username or password. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log Ind</Text>
            <TextInput
                style={styles.input}
                placeholder="Brugernavn"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Adgangskode"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log Ind</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.link}
                onPress={() => navigation.navigate('Opret')}
            >
                <Text style={styles.linkText}>Opret Bruger</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#FF5733',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 15,
    },
    linkText: {
        color: '#FF5733',
        fontSize: 16,
    },
});

export default LoginScreen;
