import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state && location.state.from) || '/';

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, displayName);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
      <h2 style={{ marginBottom: 8 }}>{mode === 'login' ? 'Login' : 'Create account'}</h2>
      <p style={{ marginTop: 0, color: '#64748b' }}>Access UrbanFlow with your account</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Display name (optional)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={styles.input}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={styles.primaryBtn}>
          {submitting ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
        </button>
      </form>
      <div style={{ height: 12 }} />
      <button onClick={handleGoogle} disabled={submitting} style={styles.googleBtn}>
        Continue with Google
      </button>
      <div style={{ marginTop: 16, fontSize: 14 }}>
        {mode === 'login' ? (
          <span>
            Don't have an account?{' '}
            <button onClick={() => setMode('register')} style={styles.linkBtn}>Sign up</button>
          </span>
        ) : (
          <span>
            Already have an account?{' '}
            <button onClick={() => setMode('login')} style={styles.linkBtn}>Log in</button>
          </span>
        )}
      </div>
    </div>
  );
}

const styles = {
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    fontSize: 14,
  },
  primaryBtn: {
    padding: '10px 12px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#3b82f6',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 600,
  },
  googleBtn: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontWeight: 600,
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    cursor: 'pointer',
    padding: 0,
    fontWeight: 600,
  },
};


