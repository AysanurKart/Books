import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, ScrollView, FlatList, Image, Text, TouchableOpacity } from 'react-native'; // Tilføjet TouchableOpacity
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';


// Definerer SellScreen komponenten
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
  
  // Profile relaterede states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState(null);

    // useEffect til at indlæse data ved komponentens opstart
  useEffect(() => {
        // Funktion til at indlæse bøger fra AsyncStorage
    const loadBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem('books'); // Hent bøger fra lagring
        if (storedBooks) {
          setBooks(JSON.parse(storedBooks));
        } else {
          console.log("Ingen bøger fundet i AsyncStorage.");
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af bøger:", error);
      }
    };

    loadBooks(); // Kald funktionen for at indlæse bøger




    // Hent brugerens placering til kortet
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); // Anmod om tilladelse til placering
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
      }); // Opdater state med placering
    };

    getLocation(); // Kald funktionen for at hente placering



    // Indlæs brugerprofil
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('userProfile');
        if (storedProfile) {
          const { name, address, phone, email } = JSON.parse(storedProfile);  // Parse og opdater state
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


  // Funktion til at uploade bogoplysninger
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

      const updatedBooks = [...books, newBook]; // Tilføj den nye bog til listen
      setBooks(updatedBooks); // Opdater state med bøger

      try {
        await AsyncStorage.setItem('books', JSON.stringify(updatedBooks)); // Gem bøger i lagring
        Alert.alert('Bogen er blevet uploadet!', `Titel: ${bookTitle}, Forfatter: ${author}`);
      } catch (error) {
        console.error("Fejl ved gemme bogen", error);
        Alert.alert('Fejl', 'Kunne ikke gemme bogen.');
      }

      // Reset fields
      resetFields();
    } else {
      Alert.alert('Fejl', 'Udfyld venligst alle felter.'); // Meddelelse hvis felter ikke er udfyldt
    }
  };

    // Funktion til at nulstille inputfelter
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

    // Funktion til at vælge billede
  const selectImage = () => {
    Alert.alert(
      'Vælg billede',
      'Hvordan vil du vælge billedet?',
      [
        { text: 'Kamera', onPress: openCamera }, // Vælg kamera
        { text: 'Bibliotek', onPress: openImageLibrary },// Vælg fra bibliotek
        { text: 'Annuller', style: 'cancel' },// Annuller
      ]
    );
  };

    // Funktion til at åbne kameraet
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync(); // Anmod om tilladelse til kamera
    if (permissionResult.granted === false) {
      alert('Adgang til kameraet er påkrævet!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) { // Tjek om billede er valgt
      setImageUri(result.assets[0].uri); // Opdater state med billede-URI
    }
  };

    // Funktion til at åbne billedbiblioteket
  const openImageLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Anmod om tilladelse til billedbibliotek
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

    // Funktion til at gemme brugerprofil
  const saveProfile = async () => {
    const profileData = {
      name,
      address,
      phone,
      email,
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));  // Gem profil i lagring
      Alert.alert('Profil gemt!', 'Dine oplysninger er blevet gemt.');
    } catch (error) {
      console.error('Fejl ved gemme profil:', error);
      Alert.alert('Fejl', 'Kunne ikke gemme profiloplysninger.');
    }
  };

    // Funktion til at slette en bog
  const deleteBook = async (bookTitle) => {
    // Filtrer bøgerne for at fjerne den valgte
    const updatedBooks = books.filter(book => book.bookTitle !== bookTitle);
     // Opdater state med bøger
    setBooks(updatedBooks);

    try {
      await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
      Alert.alert('Bogen er blevet slettet.');
    } catch (error) {
      console.error("Fejl ved sletning af bogen", error);
      Alert.alert('Fejl', 'Kunne ikke slette bogen.');
    }
  };

    // Renderer komponenten
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
       {/* Tilføje flere kategorier som nødvendigt */}
          <Picker.Item label="Vælg kategori" value="" />
          <Picker.Item label="Studiebøger" value="studiebøger" />
          <Picker.Item label="Fiktion" value="fiktion" />
          <Picker.Item label="Non-fiktion" value="non-fiktion" />
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
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        <Button title="Upload bog" onPress={handleUpload} />

        <Text style={styles.title}>Mine bøger</Text>
<FlatList
  data={books}
  keyExtractor={(item) => item.bookTitle}
  renderItem={({ item }) => (
    <View style={styles.bookItem}>
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.bookImage} />
      )}
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.bookTitle}</Text>
        <Text>Forfatter: {item.author}</Text>
        <Text>År: {item.year}</Text>
        <Text>Forlag: {item.publisher}</Text>
        <Text>Pris: {item.price} DKK</Text>
        <Text>Beskrivelse: {item.description}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteBook(item.bookTitle)}>
        <Text style={styles.deleteButton}>Slet</Text>
      </TouchableOpacity>
    </View>
  )}
/>
</View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  bookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  bookImage: {
    width: 80,
    height: 100,
    marginRight: 16,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deleteButton: {
    marginLeft:20,
    padding:10,
    backgroundColor:'red',
    color: 'white',
    marginTop: 8,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
});

export default SellScreen;
