import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import firestore from '@react-native-firebase/firestore';

interface ICategory {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

interface CategoriesContextType {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await firestore().collection('Categorías').where('activo', '==', true).get();
        const fetchedCategories = categorySnapshot.docs.map(doc => ({
          ...(doc.data() as ICategory),
          id: doc.id,
        }));
        console.log('Categorías obtenidas:', fetchedCategories);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('🚫 Error al obtener categorías:', err);
        setError('Error al cargar las categorías. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading, error, setCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};
