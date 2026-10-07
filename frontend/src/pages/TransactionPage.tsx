import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TransactionCard } from '../components/TransactionCard';
import type { Transaction, TransactionType } from '../types/transaction.type';

type TransactionPageProps = {
  transactions: Transaction[];
};

export function TransactionPage({ transactions }: TransactionPageProps) {
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');

  const visibleTransactions = transactions.filter(
    (item) => typeFilter === 'all' || item.type === typeFilter
  );

  return (
    <section>
      <h1>Список транзакций</h1>

      <div
        className="filter-panel"
        style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}
      >
        <label htmlFor="filter-type">Фильтр по типу:</label>
        <select
          id="filter-type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'all')}
        >
          <option value="all">Все</option>
          <option value="income">Доходы</option>
          <option value="expense">Расходы</option>
        </select>

        {typeFilter !== 'all' && (
          <button type="button" onClick={() => setTypeFilter('all')}>
            Сбросить фильтр
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div>
          <p>Записи отсутствуют. Добавьте первую транзакцию!</p>
          <Link to="/transactions/new">Создать транзакцию</Link>
        </div>
      ) : visibleTransactions.length === 0 ? (
        <div>
          <p>Нет транзакций, соответствующих выбранному фильтру.</p>
          <button type="button" onClick={() => setTypeFilter('all')}>
            Показать все
          </button>
        </div>
      ) : (
        <div className="transactions-list">
          {visibleTransactions.map((tx) => (
            <TransactionCard key={tx.id} transaction={tx} />
          ))}
        </div>
      )}
    </section>
  );
}