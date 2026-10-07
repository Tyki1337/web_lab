import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Transaction } from '../types/transaction.type';

type TransactionDetailsPageProps = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
};

export function TransactionDetailsPage({ transactions, onDelete }: TransactionDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) {
    return (
      <section>
        <h1>Транзакция не найдена</h1>
        <p>Запись была удалена или никогда не существовала.</p>
        <Link to="/transactions">К списку транзакций</Link>
      </section>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Удалить транзакцию «${transaction.title}»?`)) {
      onDelete(transaction.id);
      navigate('/transactions', { replace: true });
    }
  };

  return (
    <section className="transaction-details">
      <h1>{transaction.title}</h1>
      <div className="details-card">
        <p>
          <strong>Тип:</strong> {transaction.type === 'income' ? 'Доход' : 'Расход'}
        </p>
        <p>
          <strong>Сумма:</strong> {transaction.amount} руб.
        </p>
        <p>
          <strong>Категория:</strong> {transaction.category}
        </p>
        <p>
          <strong>Дата:</strong> {transaction.date}
        </p>
      </div>

      <div className="actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Link to={`/transactions/${transaction.id}/edit`}>
          <button type="button">Редактировать</button>
        </Link>
        <button type="button" onClick={handleDelete} style={{ color: 'red' }}>
          Удалить
        </button>
        <Link to="/transactions">
          <button type="button">Назад к списку</button>
        </Link>
      </div>
    </section>
  );
}