import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="main-nav" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/transport">Transport</NavLink>
      <NavLink to="/food">Food</NavLink>
      <NavLink to="/assistant">Assistant</NavLink>
      <span style={{ flex: 1 }} />
      {!user && (
        <button onClick={() => navigate('/login')} style={styles.loginBtn}>Login</button>
      )}
      {user && (
        <>
          <span style={{ color: '#64748b', fontSize: 14 }}>
            {user.displayName || user.email}
          </span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </>
      )}
    </nav>
  );
}

const styles = {
  loginBtn: {
    background: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '6px 10px',
    cursor: 'pointer',
  },
  logoutBtn: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '6px 10px',
    cursor: 'pointer',
  }
}