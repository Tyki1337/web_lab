import { useState, useEffect, useCallback } from 'react';
import type { Transaction, TransactionDraft } from '../types/transaction.type';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const getAuthData = () => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, userId: user?.id };
  };

  const fetchTransactions = useCallback(async () => {
    const { token, userId } = getAuthData();
    if (!userId || !token) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Не удалось загрузить транзакции');

      const data = await response.json();
      
      setTransactions(
        data.map((t) => ({
          id: t.id,
          title: t.title,
          amount: Number(t.amount),
          type: t.type,
          category: t.categoryId || t.category_id,
          date: t.date,
        }))
      );
    } catch (err) {
      setError(err.message || 'Ошибка сервера');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = async (draft: TransactionDraft): Promise<string> => {
    const { token, userId } = getAuthData();
    if (!userId || !token) throw new Error('Пользователь не авторизован');

    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(draft),
    });

    if (!response.ok) throw new Error('Не удалось создать транзакцию');

    const t = await response.json();
    const newTx: Transaction = {
      id: t.id,
      title: t.title,
      amount: Number(t.amount),
      type: t.type,
      category: t.categoryId || t.category_id,
      date: t.date,
    };

    setTransactions((current) => [newTx, ...current]);
    return t.id;
  };

  const updateTransaction = async (id: string, draft: TransactionDraft): Promise<void> => {
    const { token, userId } = getAuthData();
    if (!userId || !token) throw new Error('Пользователь не авторизован');

    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(draft),
    });

    if (!response.ok) throw new Error('Не удалось обновить транзакцию');

    const t = await response.json();
    const updatedTx: Transaction = {
      id: t.id,
      title: t.title,
      amount: Number(t.amount),
      type: t.type,
      category: t.categoryId || t.category_id,
      date: t.date,
    };

    setTransactions((current) =>
      current.map((item) => (item.id === id ? updatedTx : item))
    );
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    const { token, userId } = getAuthData();
    if (!userId || !token) throw new Error('Пользователь не авторизован');

    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Не удалось удалить транзакцию');

    setTransactions((current) => current.filter((item) => item.id !== id));
  };

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: fetchTransactions,
  };
}