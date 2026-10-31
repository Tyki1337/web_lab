import { useState, type SyntheticEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);

    setLoading(false);
    if (authError) {
      setError(authError.message);
    }
  }

  return (
    <div className="auth-container" style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>{isSignUp ? 'Регистрация' : 'Вход в аккаунт'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Обработка...' : isSignUp ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>

      <button 
        type="button" 
        onClick={() => setIsSignUp(!isSignUp)}
        style={{ marginTop: 10, background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
      >
        {isSignUp ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
      </button>
    </div>
  );
}