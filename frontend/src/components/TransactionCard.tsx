import { Link } from "react-router-dom";
import { getCategoryName } from "../utils/transactionForm.utils";
import type { Transaction } from "../types/transaction.type";
import type { Category } from "../types/category.types";

type TransactionCardProps = {
  transaction: Transaction;
  categories: Category[];
};

export function TransactionCard({ transaction, categories }: TransactionCardProps) {
  const isIncome = transaction.type === "income";

  return (
    <article className="transaction-card">
      <div className="card-info">
        <h3 className="card-title">
          <Link to={`/transactions/${transaction.id}`}>
            {transaction.title}
          </Link>
        </h3>
        
        {/* 1. Показываем название категории */}
        <span className="card-category">
          {getCategoryName(categories, transaction.category)}
        </span>
      </div>

      <div className="card-meta">
        <span className={`card-amount ${isIncome ? "income" : "expense"}`}>
          {isIncome ? "+" : "-"}
          {Math.abs(transaction.amount)} ₽
        </span>
        
        {/* 2. Показываем дату в теге <time> */}
        <time className="card-date">{transaction.date}</time>
      </div>
    </article>
  );
}