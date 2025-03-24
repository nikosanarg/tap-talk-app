import { ICategory } from "../types/Category";

export const getCategoryColor = (category: string, categories: ICategory[]) => categories.find((cat: ICategory) => cat.nombre === category)?.color || '#FFFFFF';
