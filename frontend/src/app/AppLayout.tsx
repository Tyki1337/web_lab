import { Outlet, Link } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="layout">
      {/* Шапка с разделением названия и ссылок */}
      <header className="header">
        <div className="brand">Expense Tracker</div>
        <nav className="nav">
          <Link to="/transactions">Операции</Link>
          <Link to="/transactions/new">Создать</Link>
        </nav>
      </header>

      {/* Контейнер страницы */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
