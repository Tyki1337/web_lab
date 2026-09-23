import { useState } from 'react'
import './App.css'

interface Transaction {
  id: number
  title: string
  amount: number
  type: 'income' | 'expense'
}

const appTitle: string = 'Expense Tracker'

export default function App() {
  // 2. Локальное состояние для списка транзакций
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, title: 'Стипендия', amount: 1500, type: 'income' },
    { id: 2, title: 'Проездной', amount: 300, type: 'expense' },
  ])

  // Состояние полей формы
  const [title, setTitle] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [type, setType] = useState<'income' | 'expense'>('expense')

  // 3. Обработчик добавления новой записи
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    
    const parsedAmount = Number(amount)
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Заполните корректно название и сумму!')
      return
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      title: title.trim(),
      amount: parsedAmount,
      type: type,
    }

    setTransactions([newTransaction, ...transactions])
    setTitle('')
    setAmount('')
  }

  // 4. Обработчик удаления записи
  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((item) => item.id !== id))
  }

  // 5. Расчет финансовой сводки
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  return (
    <main className="app">
      <header className="app-header">
        <h1>{appTitle}</h1>
        <p>Учет доходов, расходов и управление категориями.</p>
      </header>

      {/* Карточки с общей сводкой */}
      <section className="summary-section">
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
      </section>

      {/* Форма добавления операции */}
      <section className="form-section">
        <h2>Добавить операцию</h2>
        <form onSubmit={handleAddTransaction} className="transaction-form">
          <input
            type="text"
            placeholder="Название (например: Продукты)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Сумма"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
          >
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
          <button type="submit">Добавить</button>
        </form>
      </section>

      {/* Список транзакций */}
      <section aria-labelledby="items-title" className="transactions-section">
        <h2 id="items-title">История операций</h2>
        {transactions.length === 0 ? (
          <p className="empty-state">Записи о доходах и расходах пока отсутствуют.</p>
        ) : (
          <ul className="transaction-list">
            {transactions.map((item) => (
              <li key={item.id} className={`transaction-item ${item.type}`}>
                <div className="info">
                  <span className="title">{item.title}</span>
                  <span className="amount">
                    {item.type === 'income' ? '+' : '-'}{item.amount} ₽
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="delete-btn"
                  title="Удалить"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}