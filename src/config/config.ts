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

// Usar la variable de entorno API_URL si existe, si no usar la lógica del emulador
const apiUrl = process.env.API_URL 
  ? `https://${process.env.API_URL}` // Railway URL desde .env
  : getDefaultApiUrl(); // Fallback a red local/emulador

export const config: Config = {
  API_URL: apiUrl,
  FCM_KEY: process.env.FCM_KEY || '',
};

console.log('🔧 Config - API_URL:', config.API_URL);