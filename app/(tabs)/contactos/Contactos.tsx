import React, { useEffect, useState, useCallback  } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import Emergencia from "../../../components/Emergencia.js"

const handleErrors = (mensaje) => {
  Alert.alert("Error", mensaje);
  Vibration.vibrate(1000);
}

const Contactos = () => {
  const navigation = useRouter();
  const [contacts, setContacts] = useState([]);
  const [emergenciaHabilitado, setEmergenciaHabilitado] = useState(true)

  // Función para guardar contactos en AsyncStorage
  const saveContacts = async (contacts) => {
    try {
      await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
    } catch (error) {
      handleErrors("Error al guardar contactos")
      console.error('Error al guardar contactos', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [emergenciaHabilitado])
  );

  // Función para cargar contactos desde AsyncStorage
  const loadContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem('contacts');
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      } else {
        // Si no hay contactos guardados, guardamos los contactos iniciales
        const initialContacts = [
          { id: '1', name: 'Juan Pérez', phoneNumbers: [{ number: '+1234567890' }], isEmergency: false },
          { id: '2', name: 'Lucas Zasel', phoneNumbers: [{ number: '+0987654321' }], isEmergency: true },
          { id: '3', name: 'Tobias Zasel', phoneNumbers: [{ number: '+1122334455' }], isEmergency: false },
          { id: '4', name: 'Luquitas Rodríguez', phoneNumbers: [{ number: '+5566778899' }], isEmergency: false },
          { id: '5', name: 'Luis Fernández', phoneNumbers: [{ number: '+6677889955' }], isEmergency: true },
          { id: '6', name: 'Luis Fernández', phoneNumbers: [{ number: '+6677889955' }], isEmergency: true }
        ];
        setContacts(initialContacts);
        saveContacts(initialContacts);
      }
    } catch (error) {
      console.error('Error al cargar contactos', error);
      handleErrors("Error al cargar contactos")
    }
  };

  // Efecto para cargar contactos al montar el componente
  useEffect(() => {
    loadContacts();
  }, []);

  const renderItem = ({ item }) => {
    const principal = item.phoneNumbers[0]?.number;

    return (
            
      <View style={styles.itemContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phoneNumber}>{principal}</Text>
        </View>
        <View style={styles.iconContainer}>
          {item.isEmergency && (
            <MaterialCommunityIcons name="alert-circle" size={24} color="red" />
          )}
        </View>
      </View>
    );
  };

  return (

    <View style={styles.container}>
    {emergenciaHabilitado ? (
      <>
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <Button
          title="Configurar Número de Emergencia"
          onPress={() => setEmergenciaHabilitado(false)}
        />
      </>
    ) : (
      <Emergencia setEmergenciaHabilitado={setEmergenciaHabilitado}/>
    )}
  </View>
)}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#555',
  },
  iconContainer: {
    marginLeft: 10,
  },
});

export default Contactos;
