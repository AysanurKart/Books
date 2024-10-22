import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BrowseScreen = ({ navigation }) => {
  const [books, setBooks] = React.useState([]);

  React.useEffect(() => {
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
  
    const unsubscribe = navigation.addListener('focus', () => {
      loadBooks(); // Reload books whenever the screen is focused
    });
  
    return unsubscribe; // Cleanup the listener on unmount
  }, [navigation]);
  

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.bookImage} />
      )}
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.bookTitle}</Text>
        <Text>Forfatter: {item.author}</Text>
        <Text>Pris: {item.price} DKK</Text>
        <Text>Kategori: {item.category}</Text>
        <Text>År: {item.year}</Text>
        <Text>Forlag: {item.publisher}</Text>
        <Text>By: {item.city}, {item.postalCode}</Text>
        <Text>Beskrivelse: {item.description}</Text>
        
        {/* Læs mere button */}
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => navigation.navigate('BookDetail', { book: item })}
        >
          <Text style={styles.moreButtonText}>Læs mere</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alle Bøger</Text>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.bookTitle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  bookImage: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontWeight: 'bold',
  },
  moreButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  moreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default BrowseScreen;
