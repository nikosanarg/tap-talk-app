import { IPictogram } from "./Pictogram";

export interface ICategory {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
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
}