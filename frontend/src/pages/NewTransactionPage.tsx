import { useNavigate } from 'react-router-dom';
import { TransactionForm } from '../components/TransactionForm';
import type { TransactionDraft } from '../types/transaction.type';

type NewTransactionPageProps = {
  onCreate: (draft: TransactionDraft) => string;
};

const emptyTransaction: TransactionDraft = {
  title: '',
  amount: 0,
  type: 'expense',
  category: '',
  date: new Date().toISOString().split('T')[0],
};

export function NewTransactionPage({ onCreate }: NewTransactionPageProps) {
  const navigate = useNavigate();

  function handleSave(draft: TransactionDraft) {
    const id = onCreate(draft);
    navigate(`/transactions/${id}`);
  }

  return (
    <section>
      <h1>Создание транзакции</h1>
      <TransactionForm
        initialValues={emptyTransaction}
        onSave={handleSave}
        onCancel={() => navigate('/transactions')}
      />
    </section>
  );
}