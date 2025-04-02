import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import firestore from '@react-native-firebase/firestore';

type BackendIpContextType = {
  backendIp: string | null;
};

const BackendIpContext = createContext<BackendIpContextType | undefined>(undefined);

export const BackendIpProvider = ({ children }: { children: ReactNode }) => {
  const [backendIp, setBackendIp] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackendIp = async () => {
      try {
        const doc = await firestore().collection('Constantes').doc('backendip').get();
        if (doc.exists) {
          const ip = doc.data()?.valor;
          setBackendIp(ip);
        } else {
          console.error('Error al obtener la dirección IP de la API');
        }
      } catch (error) {
        console.error('Error al obtener la dirección IP de la API:', error);
      }
    };

    fetchBackendIp();
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
