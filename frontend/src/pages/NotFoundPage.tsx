import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="error-block">
      <h1>Страница не найдена (404)</h1>
      <p>Запрошенный адрес не существует.</p>
      <Link to="/transactions" className="btn">
        Перейти к списку операций
      </Link>
    </section>
  )
}