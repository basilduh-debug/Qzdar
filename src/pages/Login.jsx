import { useAuth } from "../Context/AuthContext";
import { useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";

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

    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    } 



    try {
      // Calls the backend /api/auth/signin endpoint via AuthContext
      const user = await login(username.trim(), password);

      // Send the user back to the page they wanted, or to their dashboard
      const nextDestination = location.state?.from?.pathname ||
                              (user.role === 'owner' ? '/owner-dashboard' : '/my-matches');
      navigate(nextDestination, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2>Sign In - SoccerBooker</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>{error}</div>}
      <form onSubmit={handleFormSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        Don't have an account? <NavLink to="/signup">Register here</NavLink>
      </p>
    </div>
  );
}

export default Login;
