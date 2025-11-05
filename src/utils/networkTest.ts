import { Platform } from 'react-native';

export const testApiConnection = async (apiUrl: string) => {
    try {
        const response = await fetch(apiUrl);
        const text = await response.text();
        console.log('DEBUG - Network Test:');
        console.log('- Platform:', Platform.OS);
        console.log('- Test URL:', apiUrl);
        console.log('- Status:', response.status);
        console.log('- Response:', text);
        return true;
    } catch (error) {
        console.log('DEBUG - Network Test Failed:');
        console.log('- Platform:', Platform.OS);
        console.log('- Test URL:', apiUrl);
        console.log('- Error:', error);
        // Información adicional de depuración
        if (Platform.OS === 'android') {
            console.log('Tips para Android:');
            console.log('1. Verifica que el servidor esté corriendo en 0.0.0.0');
            console.log('2. Revisa el firewall de Windows');
            console.log('3. Prueba acceder desde el navegador del emulador a:', apiUrl);
        }
        return false;
    }
};