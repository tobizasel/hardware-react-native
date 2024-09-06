import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const PantallaConfiguracionEmergencia = () => {
  const navigation = useRouter();
  const [contacts, setContacts] = useState([]);

  // Cargar la lista de contactos al montar el componente
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const storedContacts = await AsyncStorage.getItem('contacts');
        if (storedContacts) {
          setContacts(JSON.parse(storedContacts));
        }
      } catch (error) {
        console.error('No se pudieron cargar los contactos', error);
      }
    };

    loadContacts();
  }, []);

  // Función para guardar la lista de contactos actualizada
  const saveContacts = async (updatedContacts) => {
    try {
      await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
      Alert.alert('Éxito', 'Contacto de emergencia guardado correctamente.');
      navigation.back(); // Regresa a la pantalla anterior después de guardar
    } catch (error) {
      console.error('No se pudo guardar el contacto de emergencia', error);
      Alert.alert('Error', 'No se pudo guardar el contacto de emergencia.');
    }
  };

  // Función para seleccionar un contacto como emergencia
  const setEmergencyContact = (id) => {
    const updatedContacts = contacts.map(contact =>
      contact.id === id ? { ...contact, isEmergency: true } : { ...contact, isEmergency: false }
    );
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => setEmergencyContact(item.id)}
    >
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactNumber}>{item.phoneNumbers[0]?.number}</Text>
      {item.isEmergency && <Text style={styles.emergencyText}>Contacto de Emergencia</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Seleccionar Contacto de Emergencia</Text>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contactItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
    color: '#555',
  },
  emergencyText: {
    marginTop: 8,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default PantallaConfiguracionEmergencia;
