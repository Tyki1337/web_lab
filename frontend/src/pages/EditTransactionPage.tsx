import { useParams, useNavigate, Link } from 'react-router-dom';
import { TransactionForm } from '../components/TransactionForm';
import type { Transaction, TransactionDraft } from '../types/transaction.type';

type EditTransactionPageProps = {
  transactions: Transaction[];
  onUpdate: (id: string, draft: TransactionDraft) => void;
};

export function EditTransactionPage({ transactions, onUpdate }: EditTransactionPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) {
    return (
      <section>
        <h1>Транзакция не найдена</h1>
        <Link to="/transactions">Вернуться к списку</Link>
      </section>
    );
  }

  const initialValues: TransactionDraft = {
    title: transaction.title,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    date: transaction.date,
  };

  return (
    <section>
      <h1>Редактирование транзакции</h1>
      <TransactionForm
        key={transaction.id}
        initialValues={initialValues}
        onSave={(draft) => {
          onUpdate(transaction.id, draft);
          navigate(`/transactions/${transaction.id}`);
        }}
        onCancel={() => navigate(`/transactions/${transaction.id}`)}
      />
    </section>
  );
}