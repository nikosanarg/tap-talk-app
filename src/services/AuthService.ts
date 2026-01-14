import { ISupabaseUser } from '../types/User';
import { config } from '../config/config';
import { testApiConnection } from '../utils/networkTest';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthResponse {
  success: boolean;
  user?: ISupabaseUser;
  error?: string;
  session?: {
    access_token: string;
    refresh_token: string;
  };
}

export const AuthService = {
  registerUser: async (email: string, password: string, nombre: string): Promise<ISupabaseUser> => {
    try {
      // Prueba detallada de conectividad
      const isConnected = await testApiConnection(config.API_URL);

      // DEBUG: Información detallada de la petición de registro
      const url = `${config.API_URL}/api/auth/register`;
      console.log('DEBUG - Registration URL:', url);
      
      const requestBody = { email, password, nombre };
      console.log('DEBUG - Request body:', JSON.stringify(requestBody));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }).catch(e => {
        console.log('DEBUG - Network error during fetch:', e);
        throw new Error(`Network error: ${e.message}`);
      });

      // DEBUG: Ver la respuesta completa
      console.log('DEBUG - Response status:', response.status);
      console.log('DEBUG - Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));
      
      const responseData = await response.text();
      console.log('DEBUG - Raw response:', responseData);
      
      const data: AuthResponse = responseData ? JSON.parse(responseData) : {};
      
      if (!data.success || !data.user) {
        throw new Error(data.error || 'Error durante el registro');
      }

      return data.user;
    } catch (error: any) {
      throw new Error(`Error registering user: ${error.message}`);
    }
  },

  loginUser: async (email: string, password: string): Promise<ISupabaseUser> => {
    try {
      const response = await fetch(`${config.API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();
      
      if (!data.success || !data.user) {
        throw new Error(data.error || 'Error durante el inicio de sesión');
      }

      // Guardar el access_token en AsyncStorage
      if (data.session?.access_token) {
        await AsyncStorage.setItem('supabase_token', data.session.access_token);
      }

      return data.user;
    } catch (error: any) {
      throw new Error(`Error logging in: ${error.message}`);
    }
  },

  logoutUser: async () => {
    try {
      // Eliminar el token local
      await AsyncStorage.removeItem('supabase_token');
      
      const response = await fetch(`${config.API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: AuthResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error durante el cierre de sesión');
      }
    } catch (error: any) {
      throw new Error(`Error logging out: ${error.message}`);
    }
  },

  getCurrentUser: async (): Promise<ISupabaseUser | null> => {
    try {
      const response = await fetch(`${config.API_URL}/api/auth/session`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      const data: AuthResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error obteniendo la sesión actual');
      }

      return data.user || null;
    } catch (error: any) {
      // En caso de error de red o sesión no existente, simplemente retornamos null
      console.error('Error getting current user:', error);
      return null;
    }
  },
};