import { Link } from 'react-router-dom'
import { TransactionCard } from '../components/TransactionCard'
import { transactions } from '../data/transactions.data'

export function TransactionPage() {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  return (
    <section>
      <div className="page-header">
        <h1>История операций</h1>
        <Link to="/transactions/new" className="btn">
          Добавить операцию
        </Link>
      </div>

      <div className="summary-section">
        <div className={`summary-card ${balance >= 0 ? 'positive' : 'negative'}`}>
          <span>Баланс:</span>
          <strong>{balance} ₽</strong>
        </div>
        <div className="summary-card income">
          <span>Доходы:</span>
          <strong>+{totalIncome} ₽</strong>
        </div>
        <div className="summary-card expense">
          <span>Расходы:</span>
          <strong>-{totalExpense} ₽</strong>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="empty-state">Записи о доходах и расходах пока отсутствуют.</p>
      ) : (
        <div className="transaction-list">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </section>
  )
}