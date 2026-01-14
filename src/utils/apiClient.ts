import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cliente HTTP configurado para incluir credenciales en todas las peticiones
 * Incluye automáticamente el token de Supabase en los headers
 */

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem('supabase_token');
  
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }
  return {};
}

export const apiClient = {
  async get(url: string, options: FetchOptions = {}): Promise<Response> {
    const authHeaders = await getAuthHeaders();
    
    return fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
    });
  },

  async post(url: string, body: any, options: FetchOptions = {}): Promise<Response> {
    const authHeaders = await getAuthHeaders();
    
    return fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      body: JSON.stringify(body),
    });
  },

  async put(url: string, body: any, options: FetchOptions = {}): Promise<Response> {
    const authHeaders = await getAuthHeaders();
    return fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      body: JSON.stringify(body),
    });
  },

  async delete(url: string, options: FetchOptions = {}): Promise<Response> {
    const authHeaders = await getAuthHeaders();
    return fetch(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
    });
  },
};
