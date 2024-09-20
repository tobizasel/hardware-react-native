import { View } from "react-native";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from "react";
import { Text, Button, StyleSheet, TouchableOpacity, Modal, Pressable } from "react-native";
import QRCode from 'react-native-qrcode-svg';

export default function About() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [dataBeenScanned, setDataBeenScanned] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Dame el celu</Text>
        <Button onPress={requestPermission} title="Conceder Permiso" />
      </View>
    );  
  }

  const handleBarCodeScanned = ({ data }) => {
    setScannedData(data);
    setDataBeenScanned(true);
    setCameraOpen(false);
  };

  const handleOpenCamera = () => {
    setCameraOpen(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HOLUUUU</Text>
      <QRCode
        value="Lo hicimos Tobias Zaselsky y Facundo Yuzefoff"
        size={200}
        color="#2c3e50"
        backgroundColor="#ecf0f1"
      />
      <TouchableOpacity style={styles.scanButton} onPress={handleOpenCamera}>
        <Text style={styles.scanButtonText}>Abrir Scanner</Text>
      </TouchableOpacity>

      {cameraOpen && (
        <CameraView
          style={styles.camera}
          onBarCodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
      )}

      {dataBeenScanned && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={dataBeenScanned}
          onRequestClose={() => {
            setDataBeenScanned(null);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Sigmas: {scannedData}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setDataBeenScanned(false)}
              >
                <Text style={styles.textStyle}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#34495e',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#7f8c8d',
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  scanButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
