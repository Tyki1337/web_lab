import { Link } from 'react-router-dom'
import type { Transaction } from '../types/transaction.type'

type TransactionCardProps = {
  transaction: Transaction
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const isIncome = transaction.type === 'income'

  return (
    <article className={`transaction-card ${transaction.type}`}>
      <div className="info">
        <h2>
          <Link to={`/transactions/${transaction.id}`}>{transaction.title}</Link>
        </h2>
        <span className="category">{transaction.category}</span>
      </div>
      <div className="meta">
        <span className="amount">
          {isIncome ? '+' : '-'}{transaction.amount} ₽
        </span>
        <span className="date">{transaction.date}</span>
      </div>
    </article>
  )
}