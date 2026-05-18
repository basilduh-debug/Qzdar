import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { colors, card, button, input, label } from "../theme";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) return setError("Please fill in all fields");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    try {
      const user = await signup(username.trim(), password, role);
      navigate(user.role === 'owner' ? '/owner-dashboard' : '/my-matches');
    } catch (err) {
      setError(err.message || "Sign up failed");
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
        <h2 style={{ marginTop: 0, marginBottom: '6px' }}>Create an account</h2>
        <p style={{ color: colors.muted, marginBottom: '20px' }}>Join SoccerBooker to book or list stadiums.</p>

        {error && (
          <div style={{
            color: colors.danger,
            padding: '10px 12px',
            background: '#fef2f2',
            borderRadius: '8px',
            marginBottom: '14px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '14px' }}>
            <label style={label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              style={input}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password"
              style={input}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={label}>Account role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={input}>
              <option value="user">Match Organizer (User)</option>
              <option value="owner">Stadium Owner</option>
            </select>
          </div>

          <button type="submit" style={{ ...button.success, width: '100%', padding: '12px' }}>
            Register
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center', color: colors.muted }}>
          Already have an account? <NavLink to="/login" style={{ fontWeight: 600 }}>Sign in</NavLink>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
