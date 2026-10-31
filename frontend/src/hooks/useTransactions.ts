import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Transaction, TransactionDraft } from '../types/transaction.type';

export function useTransactions(userId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      setError(error.message);
    } else if (data) {
      setTransactions(
        data.map((t) => ({
          id: t.id,
          title: t.title,
          amount: Number(t.amount),
          type: t.type,
          category: t.category_id,
          date: t.date,
        }))
      );
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = async (draft: TransactionDraft): Promise<string> => {
    if (!userId) throw new Error('Пользователь не авторизован');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        owner_id: userId,
        category_id: draft.category,
        title: draft.title,
        amount: draft.amount,
        type: draft.type,
        date: draft.date,
      })
      .select()
      .single();

    if (error) throw error;

    const newTx: Transaction = {
      id: data.id,
      title: data.title,
      amount: Number(data.amount),
      type: data.type,
      category: data.category_id,
      date: data.date,
    };

    setTransactions((current) => [newTx, ...current]);
    return data.id;
  };

  const updateTransaction = async (id: string, draft: TransactionDraft): Promise<void> => {
    if (!userId) throw new Error('Пользователь не авторизован');

    const { error } = await supabase
      .from('transactions')
      .update({
        category_id: draft.category,
        title: draft.title,
        amount: draft.amount,
        type: draft.type,
        date: draft.date,
      })
      .eq('id', id);

    if (error) throw error;

    setTransactions((current) =>
      current.map((item) =>
        item.id === id ? { ...draft, id: item.id } : item
      )
    );
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    if (!userId) throw new Error('Пользователь не авторизован');

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;

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