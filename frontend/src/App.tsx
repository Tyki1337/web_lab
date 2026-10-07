import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./app/AppLayout";
import { TransactionPage } from "./pages/TransactionPage";
import { NewTransactionPage } from "./pages/NewTransactionPage";
import { EditTransactionPage } from "./pages/EditTransactionPage";
import { TransactionDetailsPage } from "./pages/TransactionDetailsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { transactions as initialTransactions } from "./data/transactions.data";
import type { Transaction, TransactionDraft } from "./types/transaction.type";
import "./App.css";

export function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    initialTransactions.map((item) => ({ ...item })),
  );

  function createTransaction(draft: TransactionDraft): string {
    const id = crypto.randomUUID();
    setTransactions((current) => [...current, { ...draft, id }]);
    return id;
  }

  function updateTransaction(id: string, draft: TransactionDraft): void {
    setTransactions((current) =>
      current.map((item) =>
        item.id === id ? { ...draft, id: item.id } : item,
      ),
    );
  }

  function deleteTransaction(id: string): void {
    setTransactions((current) => current.filter((item) => item.id !== id));
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/transactions" replace />} />
        <Route
          path="transactions"
          element={<TransactionPage transactions={transactions} />}
        />
        <Route
          path="transactions/new"
          element={<NewTransactionPage onCreate={createTransaction} />}
        />
        <Route
          path="transactions/:id"
          element={
            <TransactionDetailsPage
              transactions={transactions}
              onDelete={deleteTransaction}
            />
          }
        />
        <Route
          path="transactions/:id/edit"
          element={
            <EditTransactionPage
              transactions={transactions}
              onUpdate={updateTransaction}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
