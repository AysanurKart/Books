import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, ScrollView, FlatList, Image, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const SellScreen = ({ navigation }) => {
  const [category, setCategory] = useState('');
  const [subcategory, setSubCategory] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [year, setYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(undefined);
  const [books, setBooks] = useState([]);

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
  }, []);

  const handleUpload = async () => {
    if (bookTitle && category && subcategory && year && publisher && price && author && postalCode && city) {
      const newBook = {
        category,
        subcategory,
        bookTitle,
        year,
        publisher,
        price,
        location,
        postalCode,
        city,
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
    setSubCategory('');
    setBookTitle('');
    setYear('');
    setPublisher('');
    setPrice('');
    setLocation('');
    setPostalCode('');
    setCity('');
    setAuthor('');
    setDescription('');
    setImageUri(undefined);
  };

  const deleteBook = async (bookToDelete) => {
    try {
      const updatedBooks = books.filter(book => book.bookTitle !== bookToDelete.bookTitle);
      setBooks(updatedBooks);
      await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
      Alert.alert('Bogen er blevet slettet!', `Titel: ${bookToDelete.bookTitle}`);
    } catch (error) {
      console.error("Fejl ved sletning af bog:", error);
      Alert.alert('Fejl', 'Kunne ikke slette bogen.');
    }
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('./assets/bog.png')}
          style={styles.logo}
        />
        <Text style={styles.headerText}>FlipShelf</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Sælg din bog</Text>

        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Vælg kategori" value="" />
          <Picker.Item label="Studiebøger" value="Studiebøger" />
          <Picker.Item label="Fantasy" value="Fantasy" />
          <Picker.Item label="Romatisk" value="Romantisk" />
          <Picker.Item label="Thriller" value="Thriller" />
          <Picker.Item label="Scifi" value="Scifi" />
          <Picker.Item label="Romcom" value="Romcom" />
          <Picker.Item label="Krimi" value="Krimi" />
          <Picker.Item label="Biografier" value="Biografier" />
          <Picker.Item label="Sundhed" value="Sundhed" />
          <Picker.Item label="Mad og Drikke" value="Mad og Drikke" />
          <Picker.Item label="Økonomi" value="Økonomi" />
          <Picker.Item label="Erhverv og ledelse" value="Erhverv og ledelse" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Studieretning"
          value={subcategory}
          onChangeText={setSubCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Overskrift på bog"
          value={bookTitle}
          onChangeText={setBookTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Årstal"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Forlag"
          value={publisher}
          onChangeText={setPublisher}
        />
        <TextInput
          style={styles.input}
          placeholder="Forfatter"
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          style={styles.input}
          placeholder="Pris"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Postnummer"
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="By"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Beskrivelse"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
        />
        
        <Button title="Vælg billede" onPress={selectImage} color="#007AFF" />
        
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        <Button title="Upload Bog" onPress={handleUpload} color="#007AFF" />
        
        <Text style={styles.title}>Dine bøger</Text>
        <FlatList
          data={books}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} style={styles.bookImage} />
              )}
              <View>
                <Text style={styles.bookTitle}>{item.bookTitle}</Text>
                <Text style={styles.bookDetails}>Forfatter: {item.author}</Text>
                <Text style={styles.bookDetails}>Kategori: {item.category}</Text>
                <Text style={styles.bookDetails}>År: {item.year}</Text>
                <Text style={styles.bookDetails}>Pris: {item.price} kr</Text>
                <Button title="Slet" onPress={() => deleteBook(item)} color="red" />
              </View>
            </View>
          )}
          keyExtractor={(item) => item.bookTitle}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  picker: {
    height: 50,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  bookImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default SellScreen;
 