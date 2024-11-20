import React, { createContext, useContext, useState, ReactNode } from 'react';
import firestore from '@react-native-firebase/firestore';
import { CategoriesContextType, ICategory } from '../types/Category';
import { IPictogram } from '../types/Pictogram';

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [pictograms, setPictograms] = useState<Record<string, IPictogram[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)

  const fetchCategories = async () => {
    console.log('🟢 Iniciando fetch de Categorías');
    setLoading(true);
    try {
      const categorySnapshot = await firestore().collection('Categorías').where('activo', '==', true).get();
      console.log(categorySnapshot.docs[0].data())
      const fetchedCategories = categorySnapshot.docs.map(doc => ({
        ...(doc.data() as ICategory),
        id: doc.id,
      }));
      setCategories(fetchedCategories);
      return fetchedCategories;
    } catch (err) {
      console.error('🚫 Error al obtener categorías:', err);
      setError(`Error al cargar las categorías: ${err}`);
      return []
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPictograms = async ({ categories }: any): Promise<Record<string, IPictogram[]>> => {
    console.log(`🟢 Iniciando fetch de Pictogramas para las ${categories?.length} Categorías`);
    if (!categories || categories.length === 0) {
      console.log('⚠️  No hay categorías cargadas para obtener pictogramas.');
      return {};
    }
    setLoading(true);
    try {
      const pictogramsByCategory: Record<string, IPictogram[]> = {};
      for (const category of categories) {
        const pictogramsSnapshot = await firestore()
          .collection('Categorías')
          .doc(category.id)
          .collection('Pictogramas')
          .where('activo', '==', true)
          .get();
        const pictograms = pictogramsSnapshot.docs.map(doc => ({
          ...(doc.data() as IPictogram),
          id: doc.id,
        }));
        pictogramsByCategory[category.id] = pictograms;
      }
      setPictograms(pictogramsByCategory);
      return pictogramsByCategory;
    } catch (err) {
      console.error('🚫 Error al obtener pictogramas:', err);
      setError(`Error al cargar los pictogramas: ${err}`);
      return {}; 
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <CategoriesContext.Provider
      value={{
        categories,
        pictograms,
        loading,
        error,
        fetchCategories,
        fetchAllPictograms,
        setCategories,
        selectedCategory,
        setSelectedCategory
      }}
    >
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