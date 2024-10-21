import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';

const BookDetail = ({ route, navigation }) => {
  const { book } = route.params;
  const [messages, setMessages] = useState([]); // State to store messages
  const [newMessage, setNewMessage] = useState(''); // State to store new message

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return; // Prevent sending empty messages
    setMessages([...messages, newMessage]); // Add new message to the list
    setNewMessage(''); // Clear the input
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: book.imageUri }} style={styles.bookImage} />
      <Text style={styles.title}>{book.bookTitle}</Text>
      <Text style={styles.author}>By: {book.author}</Text>
      <Text style={styles.price}>Price: {book.price} DKK</Text>
      <Text style={styles.category}>Category: {book.category}</Text>
      <Text style={styles.year}>Year: {book.year}</Text>
      <Text style={styles.publisher}>Publisher: {book.publisher}</Text>
      <Text style={styles.location}>Location: {book.city}, {book.postalCode}</Text>
      <Text style={styles.description}>Description: {book.description}</Text>

      <View style={styles.chatContainer}>
        <Text style={styles.chatTitle}>Chat with Seller:</Text>
        <ScrollView style={styles.messageList}>
          {messages.map((message, index) => (
            <Text key={index} style={styles.message}>
              {message}
            </Text>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button title="Make a Bid" onPress={() => alert('Place your bid here.')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  bookImage: {
    width: '100%',
    height: '80%',
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    marginBottom: 5,
  },
  year: {
    fontSize: 16,
    marginBottom: 5,
  },
  publisher: {
    fontSize: 16,
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  chatContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageList: {
    maxHeight: 150, // Limit height of the message list
    marginBottom: 10,
  },
  message: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BookDetail;
