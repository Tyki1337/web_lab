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
  
  // Хук транзакций вызываем всегда, но внутри себя он делает запросы 
  // только если есть авторизация
  const {
    transactions,
    loading: txLoading,
    error: txError,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  if (authLoading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Загрузка сессии...</div>;
  }

  return (
    <Routes>
      {/* Если пользователь не авторизован, корень ведет на AuthForm */}
      {!user ? (
        <>
          <Route path="/" element={<AuthForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        /* Если авторизован, доступны все защищенные маршруты */
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/transactions" replace />} />
          
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
      )}
    </Routes>
  );
}

export default App;