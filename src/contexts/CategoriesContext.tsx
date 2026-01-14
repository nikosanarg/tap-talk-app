import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CategoriesContextType, ICategory } from '../types/Category';
import { IPictogram } from '../types/Pictogram';
import { CategoriaApiService } from '../services/CategoriaApiService';
import { PictogramaApiService } from '../services/PictogramaApiService';

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
      const fetchedCategories = await CategoriaApiService.getAll();
      setCategories(fetchedCategories);
      await fetchAllPictograms({ categories: fetchedCategories });
      return fetchedCategories;
    } catch (err: any) {
      console.error('🚫 Error al obtener categorías:', err);
      // Propagar el error UNAUTHORIZED para que el componente lo maneje
      throw err;
    }
  };

  const fetchAllPictograms = async ({ categories }: any): Promise<Record<string, IPictogram[]>> => {
    console.log(`🟢 Iniciando fetch de Pictogramas para las ${categories?.length} Categorías`);
    if (!categories || categories.length === 0) {
      console.log('⚠️  No hay categorías cargadas para obtener pictogramas.');
      return {};
    }
    try {
      const allPictograms = await PictogramaApiService.getAll();
      const pictogramsByCategory: Record<string, IPictogram[]> = {};
      
      for (const category of categories) {
        const pictograms = allPictograms.filter(p => p.categoria_id === category.id && p.activo);
        pictogramsByCategory[category.id] = pictograms;
      }
      
      setPictograms(pictogramsByCategory);
      return pictogramsByCategory;
    } catch (err: any) {
      console.error('🚫 Error al obtener pictogramas:', err);
      // Propagar el error UNAUTHORIZED para que el componente lo maneje
      throw err;
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
    } catch (error: any) {
      console.error('🚫 Error al inicializar categorías y pictogramas:', error);
      
      // Si es error de autenticación, propagar para que el componente lo maneje
      if (error.message === 'UNAUTHORIZED') {
        throw error;
      }
      
      setError(`Error al inicializar: ${error.message || error}`);
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