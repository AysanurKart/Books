import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, ScrollView, FlatList, Image, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const SellScreen = ({ navigation }) => {
  const [category, setCategory] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [year, setYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [price, setPrice] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(undefined);
  const [books, setBooks] = useState([]);
  
  // Profile related states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem('books');
        if (storedBooks) {
          setBooks(JSON.parse(storedBooks));
        } else {
          console.log("Ingen bøger fundet i AsyncStorage.");
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af bøger:", error);
      }
    };

    loadBooks();

    // Get user location for the map
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Tilladelse til at få adgang til din placering er nødvendig for at vise kortet.');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    };

    getLocation();

    // Load user profile
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('userProfile');
        if (storedProfile) {
          const { name, address, phone, email } = JSON.parse(storedProfile);
          setName(name);
          setAddress(address);
          setPhone(phone);
          setEmail(email);
        }
      } catch (error) {
        console.error('Fejl ved indlæsning af profil:', error);
      }
    };

    loadProfile();
  }, []);

  const handleUpload = async () => {
    if (bookTitle && category && year && publisher && price && author) {
      const newBook = {
        category,
        bookTitle,
        year,
        publisher,
        price,
        author,
        description,
        imageUri,
      };

      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);

      try {
        await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
        Alert.alert('Bogen er blevet uploadet!', `Titel: ${bookTitle}, Forfatter: ${author}`);
      } catch (error) {
        console.error("Fejl ved gemme bogen", error);
        Alert.alert('Fejl', 'Kunne ikke gemme bogen.');
      }

      // Reset fields
      resetFields();
    } else {
      Alert.alert('Fejl', 'Udfyld venligst alle felter.');
    }
  };

  const resetFields = () => {
    setCategory('');
    setBookTitle('');
    setYear('');
    setPublisher('');
    setPrice('');
    setAuthor('');
    setDescription('');
    setImageUri(undefined);
  };

  const selectImage = () => {
    Alert.alert(
      'Vælg billede',
      'Hvordan vil du vælge billedet?',
      [
        { text: 'Kamera', onPress: openCamera },
        { text: 'Bibliotek', onPress: openImageLibrary },
        { text: 'Annuller', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Adgang til kameraet er påkrævet!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Adgang til billedbiblioteket er påkrævet!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    const profileData = {
      name,
      address,
      phone,
      email,
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
      Alert.alert('Profil gemt!', 'Dine oplysninger er blevet gemt.');
    } catch (error) {
      console.error('Fejl ved gemme profil:', error);
      Alert.alert('Fejl', 'Kunne ikke gemme profiloplysninger.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Brugerprofil</Text>
        <TextInput
          style={styles.input}
          placeholder="Navn"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Adresse"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefon"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        {location && (
          <MapView
            style={styles.map}
            initialRegion={location}
          >
            <Marker coordinate={location} title="Din placering" />
          </MapView>
        )}
        <Button title="Gem Profil" onPress={saveProfile} />

        <Text style={styles.title}>Sælg en bog</Text>
        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Vælg kategori" value="" />
          <Picker.Item label="Fiktion" value="fiktion" />
          <Picker.Item label="Non-fiktion" value="non-fiktion" />
          <Picker.Item label="Studiebøger" value="studiebøger" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Titel"
          value={bookTitle}
          onChangeText={setBookTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="År"
          value={year}
          onChangeText={setYear}
        />
        <TextInput
          style={styles.input}
          placeholder="Forlag"
          value={publisher}
          onChangeText={setPublisher}
        />
        <TextInput
          style={styles.input}
          placeholder="Pris"
          value={price}
          onChangeText={setPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Forfatter"
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          style={styles.input}
          placeholder="Beskrivelse"
          value={description}
          onChangeText={setDescription}
        />
        <Button title="Vælg billede" onPress={selectImage} />
        {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
        <Button title="Upload bog" onPress={handleUpload} />
        <FlatList
          data={books}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.bookImage} />}
              <View>
                <Text style={styles.bookTitle}>{item.bookTitle}</Text>
                <Text style={styles.bookDetails}>Forfatter: {item.author}</Text>
                <Text style={styles.bookDetails}>Kategori: {item.category}</Text>
                <Text style={styles.bookDetails}>Pris: {item.price} DKK</Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 40,

  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    marginBottom: 15,
    
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
    marginTop:40,

  },
  bookImage: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookDetails: {
    fontSize: 14,
  },
});

export default SellScreen;
