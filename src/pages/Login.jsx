import { useAuth } from "../Context/AuthContext";
import { useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { colors, card, button, input, label } from "../theme";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) return setError("Please enter a username.");
    if (!password.trim()) return setError("Please enter your password.");

    try {
      const user = await login(username.trim(), password);
      const nextDestination = location.state?.from?.pathname ||
                              (user.role === 'owner' ? '/owner-dashboard' : '/my-matches');
      navigate(nextDestination, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div style={{
      maxWidth: '420px',
      margin: '50px auto',
      padding: '0 20px',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      <div style={card}>
        <h2 style={{ marginTop: 0, marginBottom: '6px' }}>Welcome back</h2>
        <p style={{ color: colors.muted, marginBottom: '20px' }}>Sign in to your SoccerBooker account.</p>

        {error && (
          <div style={{
            color: colors.danger,
            padding: '10px 12px',
            background: '#fef2f2',
            borderRadius: '8px',
            marginBottom: '14px'
          }}>{error}</div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={input}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={input}
            />
          </div>

          <button type="submit" style={{ ...button.primary, width: '100%', padding: '12px' }}>
            Sign In
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center', color: colors.muted }}>
          Don't have an account? <NavLink to="/signup" style={{ fontWeight: 600 }}>Register here</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
