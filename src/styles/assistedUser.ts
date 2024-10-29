export const getCategoryColor = (categoryName: string) => {
  const colors: Record<string, string> = {
    'Comida': '#70FF70',
    'Gente': '#FFC570',
    'Acciones': '#FF70FF',
    'Salud': '#7070FF',
  };
  return colors[categoryName] || '#FFFFFF';
};