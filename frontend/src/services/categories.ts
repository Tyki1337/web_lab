import { supabase } from '../lib/supabase';
import type { Category } from '../types/category.types';

function isCategory(value: unknown): value is Category {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    value.id.trim().length > 0 &&
    value.id === value.id.trim() &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0
  );
}

export function parseCategories(value: unknown): Category[] {
  if (!Array.isArray(value) || !value.every(isCategory)) {
    throw new Error('Неверная структура справочника категорий.');
  }

  const categories: Category[] = value;
  const ids = new Set(categories.map((cat) => cat.id));

  if (ids.size !== categories.length) {
    throw new Error('В справочнике повторяются идентификаторы.');
  }

  return categories;
}

export async function getCategories(signal: AbortSignal): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')
    .abortSignal(signal);

  if (signal.aborted) {
    throw new DOMException('Запрос отменён', 'AbortError');
  }

  if (error) {
    throw new Error(`Не удалось загрузить категории: ${error.message}`);
  }

  return parseCategories(data);
}