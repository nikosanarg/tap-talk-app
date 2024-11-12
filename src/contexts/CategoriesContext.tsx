import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  fetchCategories: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const fetchCategories = async () => {
    console.log('🟢 Iniciando fetch a Categorías');
    setLoading(true);
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
      setError(`Error al cargar las categorías "${err}"`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoriesContext.Provider value={{ categories, loading, error, setCategories, fetchCategories, selectedCategory, setSelectedCategory }}>
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
