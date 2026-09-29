import { NavLink, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="app">
      <header className="app-header">
        <p className="app-title">Expense Tracker</p>
        <nav aria-label="Основная навигация">
          <NavLink to="/transactions" end>
            Операции
          </NavLink>
          <NavLink to="/transactions/new">
            Создать
          </NavLink>
        </nav>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}