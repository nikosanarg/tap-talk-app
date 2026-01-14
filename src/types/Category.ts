import { IPictogram } from "./Pictogram";

export interface ICategory {
  id: number;                // SERIAL PRIMARY KEY
  nombre: string;            // VARCHAR(100) NOT NULL
  imagen?: string | null;    // VARCHAR(255) - nullable
  color?: string;            // VARCHAR(10) DEFAULT '#000000'
}

export interface CategoriesContextType {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  selectedCategory: ICategory | null;
  pictograms: Record<string, IPictogram[]>;
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<ICategory | null>>;
  fetchAllPictograms: ({ categories }: any) => Promise<Record<string, IPictogram[]>> ;
  fetchCategories: () => Promise<ICategory[]>;
  initCategoriesAndPictograms: () => Promise<any>;
}