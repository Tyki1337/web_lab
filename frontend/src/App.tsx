import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./app/AppLayout";
import { TransactionPage } from "./pages/TransactionPage";
import { NewTransactionPage } from "./pages/NewTransactionPage";
import { EditTransactionPage } from "./pages/EditTransactionPage";
import { TransactionDetailsPage } from "./pages/TransactionDetailsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AuthForm } from "./components/AuthForm";
import { useAuth } from "./hooks/useAuth";
import { useTransactions } from "./hooks/useTransactions";
import "./App.css";

export function App() {
  const { user, loading: authLoading } = useAuth();

  const {
    transactions,
    loading: txLoading,
    error: txError,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  if (authLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Загрузка сессии...
      </div>
    );
  }

  return (
    <Routes>
      {/* Корень: форма входа для гостя, редирект на операции для авторизованного */}
      <Route
        path="/"
        element={user ? <Navigate to="/transactions" replace /> : <AuthForm />}
      />

      {/* Защищённая зона: без user любой путь отправляет на / */}
      <Route
        element={user ? <AppLayout /> : <Navigate to="/" replace />}
      >
        <Route
          path="transactions"
          element={
            txLoading ? (
              <p style={{ padding: "20px" }}>Загрузка ваших транзакций...</p>
            ) : txError ? (
              <p style={{ padding: "20px", color: "red" }}>Ошибка: {txError}</p>
            ) : (
              <TransactionPage transactions={transactions} />
            )
          }
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