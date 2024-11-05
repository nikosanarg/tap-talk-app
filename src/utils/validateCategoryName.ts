import { PictogramsProps } from "../types/Pictogram";

export const validateCategoryName = (name: string): name is keyof PictogramsProps => {
  return ['Comida', 'Gente', 'Acciones', 'Salud'].includes(name);
};