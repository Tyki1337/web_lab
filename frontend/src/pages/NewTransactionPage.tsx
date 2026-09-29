import { Link } from 'react-router-dom'

export function NewTransactionPage() {
  return (
    <section>
      <h1>Создание операции</h1>
      <p>Форма создания и сохранения новых транзакций появится в Лабораторной работе №3.</p>
      <Link to="/transactions" className="btn">
        Вернуться к списку операций
      </Link>
    </section>
  )
}