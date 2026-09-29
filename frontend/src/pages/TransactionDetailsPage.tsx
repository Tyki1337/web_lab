import { Link, useParams } from 'react-router-dom'
import { transactions } from '../data/transactions.data'

export function TransactionDetailsPage() {
  const { id } = useParams()
  const transaction = transactions.find((item) => item.id === id)

  if (!transaction) {
    return (
      <section className="error-block">
        <h1>Запись не найдена</h1>
        <p>Операции с идентификатором "{id}" не существует.</p>
        <Link to="/transactions" className="btn">
          К списку операций
        </Link>
      </section>
    )
  }

  const isIncome = transaction.type === 'income'

  return (
    <section className="details-page">
      <h1>{transaction.title}</h1>
      <div className="details-card">
        <p><strong>Тип операции:</strong> {isIncome ? 'Доход' : 'Расход'}</p>
        <p><strong>Сумма:</strong> {isIncome ? '+' : '-'}{transaction.amount} ₽</p>
        <p><strong>Категория:</strong> {transaction.category}</p>
        <p><strong>Дата:</strong> {transaction.date}</p>
        {transaction.note && <p><strong>Заметка:</strong> {transaction.note}</p>}
        <p><strong>ID записи:</strong> {transaction.id}</p>
      </div>
      <div className="actions">
        <Link to="/transactions" className="btn">
          ← К списку операций
        </Link>
      </div>
    </section>
  )
}