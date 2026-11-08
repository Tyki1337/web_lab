import { useState, type SyntheticEvent } from "react";
import { useAuth } from "../hooks/useAuth";

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      window.location.reload();
    }
  }

  return (
    <div
      className="auth-container"
      style={{ maxWidth: 400, margin: "40px auto" }}
    >
      <h2>{isSignUp ? "Регистрация" : "Вход в аккаунт"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: 15 }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: 5 }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 15 }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: 5 }}
          >
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {error && (
          <p role="alert" style={{ color: "red", marginBottom: 15 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10 }}
        >
          {loading ? "Обработка..." : isSignUp ? "Зарегистрироваться" : "Войти"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError("");
        }}
        style={{
          marginTop: 10,
          background: "none",
          border: "none",
          color: "blue",
          cursor: "pointer",
          padding: 0,
        }}
      >
        {isSignUp
          ? "Уже есть аккаунт? Войти"
          : "Нет аккаунта? Зарегистрироваться"}
      </button>
    </div>
  );
}
