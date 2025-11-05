import { Platform } from 'react-native';

interface Config {
  API_URL: string;
  FCM_KEY: string;
}

// Si no hay variable de entorno API_URL, usar la lógica del emulador como fallback
const getDefaultApiUrl = () => {
  if (Platform.OS === 'android') {
    // Para dispositivo físico Android, usa la IP de tu máquina en la red local
    return 'http://192.168.1.37:3000';
  }
  return 'http://localhost:3000'; // iOS emulator or web
};

// Para desarrollo, ignoramos la variable de entorno y usamos siempre la lógica del emulador
export const config: Config = {
  API_URL: getDefaultApiUrl(), // Forzamos a usar la lógica del emulador
  FCM_KEY: process.env.FCM_KEY || '',
};