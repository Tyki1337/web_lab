import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Путь к вашему хуку useAuth

export function AppLayout() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <div className="layout">
      {/* Шапка с разделением названия и ссылок */}
      <header
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="brand">Expense Tracker</div>
          <nav className="nav">
            <Link to="/transactions">Операции</Link>
            <Link to="/transactions/new">Создать</Link>
          </nav>
        </div>

        {/* Блок пользователя и кнопка выхода */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", color: "#555" }}>
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            >
              Выйти
            </button>
          </div>
        )}
      </header>

      {/* Контейнер страницы */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
