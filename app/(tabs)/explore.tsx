import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

const API_KEY = 'a8fa00e4b999f29151f36f7004450e75'; // Reemplaza con tu clave de API de OpenWeatherMap

const Clima = () => {
  const [location, setLocation] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Llamar a la API de clima con la ubicación actual
      getWeather(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const getWeather = async (latitude, longitude) => {
    try {      
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=a8fa00e4b999f29151f36f7004450e75`
      );
      setTemperature(response.data.main.temp);
    } catch (error) {
      setErrorMsg('No se pudo obtener la temperatura');
      console.error(error);
    }
  };

  const getCurrentTime = () => {
    const date = new Date();
    return date.toLocaleTimeString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hora Actual: {getCurrentTime()}</Text>
      <Text style={styles.text}>
        Ubicación: {location ? `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}` : 'Cargando...'}
      </Text>
      <Text style={styles.text}>
        Temperatura: {temperature !== null ? `${temperature}°C` : 'Cargando...'}
      </Text>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Clima;
