import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { config } from '../config/config';

type BackendIpContextType = {
  backendIp: string | null;
};

const BackendIpContext = createContext<BackendIpContextType | undefined>(undefined);

export const BackendIpProvider = ({ children }: { children: ReactNode }) => {
  const [backendIp, setBackendIp] = useState<string | null>(null);

  useEffect(() => {
    // Extraer solo la IP del config.API_URL (formato: http://IP:PORT)
    const extractIpFromUrl = (url: string): string | null => {
      try {
        const match = url.match(/https?:\/\/([^:]+)/);
        return match ? match[1] : null;
      } catch {
        return null;
      }
    };

    const ip = extractIpFromUrl(config.API_URL);
    setBackendIp(ip);
    
    if (!ip) {
      console.error('Error al extraer la dirección IP de config.API_URL');
    }
  }, []);

  return (
    <BackendIpContext.Provider value={{ backendIp }}>
      {children}
    </BackendIpContext.Provider>
  );
};

export const useBackendIp = () => {
  const context = useContext(BackendIpContext);
  if (context === undefined) {
    throw new Error('useBackendIp debe usarse dentro de un BackendIpProvider');
  }
  return context;
};
