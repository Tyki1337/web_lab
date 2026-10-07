import { useState, type SyntheticEvent } from 'react';
import type { TransactionDraft, TransactionType } from '../types/transaction.type';

type TransactionFormProps = {
  initialValues: TransactionDraft;
  onSave: (draft: TransactionDraft) => void;
  onCancel: () => void;
};

export function TransactionForm({ initialValues, onSave, onCancel }: TransactionFormProps) {
  const [draft, setDraft] = useState<TransactionDraft>(() => ({ ...initialValues }));
  const [error, setError] = useState<string>('');

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = draft.title.trim();
    const amountNum = Number(draft.amount);
    const category = draft.category.trim();

    // Валидация названия
    if (title.length < 3 || title.length > 100) {
      setError('Название транзакции должно содержать от 3 до 100 символов.');
      return;
    }

    // Предметная проверка: сумма должна быть строго больше 0
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError('Сумма должна быть положительным числом больше 0.');
      return;
    }

    if (!category) {
      setError('Укажите категорию.');
      return;
    }

    if (!draft.date) {
      setError('Укажите дату транзакции.');
      return;
    }

    setError('');
    onSave({
      ...draft,
      title,
      amount: amountNum,
      category
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="transaction-form">
      <div className="form-group">
        <label htmlFor="tx-title">Название</label>
        <input
          id="tx-title"
          type="text"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="tx-amount">Сумма</label>
        <input
          id="tx-amount"
          type="number"
          step="0.01"
          value={draft.amount || ''}
          onChange={(e) => setDraft({ ...draft, amount: parseFloat(e.target.value) || 0 })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="tx-type">Тип операции</label>
        <select
          id="tx-type"
          value={draft.type}
          onChange={(e) => setDraft({ ...draft, type: e.target.value as TransactionType })}
        >
          <option value="expense">Расход</option>
          <option value="income">Доход</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tx-category">Категория</label>
        <input
          id="tx-category"
          type="text"
          value={draft.category}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="tx-date">Дата</label>
        <input
          id="tx-date"
          type="date"
          value={draft.date}
          onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          required
        />
      </div>

      {error && (
        <p role="alert" className="error-message" style={{ color: 'red' }}>
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
}