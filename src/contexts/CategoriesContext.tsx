import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
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
    try {
      const categorySnapshot = await firestore().collection('Categorías').where('activo', '==', true).get();
      const fetchedCategories = categorySnapshot.docs.map(doc => ({
        ...(doc.data() as ICategory),
        id: doc.id,
      }));
      setCategories(fetchedCategories);
      // fetchAllPictograms({ categories: fetchedCategories });
      return fetchedCategories;
    } catch (err) {
      console.error('🚫 Error al obtener categorías:', err);
      setError(`Error al cargar las categorías: ${err}`);
      return []
    }
  };

  const fetchAllPictograms = async ({ categories }: any): Promise<Record<string, IPictogram[]>> => {
    console.log(`🟢 Iniciando fetch de Pictogramas para las ${categories?.length} Categorías`);
    if (!categories || categories.length === 0) {
      console.log('⚠️  No hay categorías cargadas para obtener pictogramas.');
      return {};
    }
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
    }
  };

  const initCategoriesAndPictograms = async () => {
    setLoading(true);
    let initStatus = true;
    console.log('🟢 Iniciando inicialización de categorías y pictogramas');
    try {
      const fetchedCategories = await fetchCategories();
      console.log(`📥 Categorías descargadas: [${fetchedCategories.map(c => c.nombre).join(', ')}]`);
      const fetchedPictograms = await fetchAllPictograms({ categories: fetchedCategories });
      console.log(
        '📥 Pictogramas descargados:',
        Object.entries(fetchedPictograms)
          .map(([key, arr]) => `${key.slice(0, 4)}…: ${arr.length}`)
          .join(', ')
      );
      return true
    } catch (error) {
      console.error('🚫 Error al inicializar categorías y pictogramas:', error);
      setError(`Error al inicializar: ${error}`);
      initStatus = false
    } finally {
      setLoading(false);
    }
    return initStatus
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
        initCategoriesAndPictograms,
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