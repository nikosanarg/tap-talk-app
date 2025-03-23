import { ICategory } from "../types/Category";

export const getCategoryColor = (category: string, categories: ICategory[]) => categories.find((cat: ICategory) => cat.nombre === category)?.color || '#FFFFFF';

// DEPRECADA
// export const getCategoryColor = (categoryName: string) => {
//   const colors: Record<string, string> = {
//     'Comida': '#70FF70',
//     'Gente': '#FFC570',
//     'Acciones': '#FF70FF',
//     'Salud': '#90B0FF',
//   };
//   return colors[categoryName] || '#FFFFFF';
// };