import type {Category} from '../types/category.types'
export function getCategoryName(categories: Category[], categoryId: string): string {
  const found = categories.find((cat) => cat.id === categoryId);
  return found ? found.name : categoryId;
}