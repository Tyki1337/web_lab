import type { Category } from '../types/category.types';

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_URL}/transactions/categories`, {
    signal,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить категории');
  }

  const data = await response.json();
  return data;
}