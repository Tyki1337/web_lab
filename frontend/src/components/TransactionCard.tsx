import { Link } from "react-router-dom";
import type { TransactionCardProps } from "../types/transaction.type";

export function TransactionCard({ transaction }: TransactionCardProps) {
  const isIncome = transaction.type === "income";

  return (
    <article className="transaction-card">
      <div className="card-info">
        <h3 className="card-title">
          <Link to={`/transactions/${transaction.id}`}>
            {transaction.title}
          </Link>
        </h3>
        <span className="card-category">{transaction.category}</span>
      </div>

      <div className="card-meta">
        <span className={`card-amount ${isIncome ? "income" : "expense"}`}>
          {isIncome ? "+" : "-"}
          {Math.abs(transaction.amount)} ₽
        </span>
        <time className="card-date">{transaction.date}</time>
      </div>
    </article>
  );
}
