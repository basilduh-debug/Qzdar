 import { useAuth } from "../Context/AuthContext";
import { useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // Hook to move pages programmatically
  const location = useLocation(); // Hook to remember the blocked page
  const { login } = useAuth();    // Consume global login action

  const handleFormSubmit = (e) => {
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

    // 1. Fetch our list of registered users from the fake localStorage database
    const existingUsersRaw = localStorage.getItem("soccerBooker_users");
    
    if (!existingUsersRaw) {
      setError("No registered users found. Please use the link below to Register first!");
      return;
    }

    // 2. Convert the text string back into a usable JavaScript array
    const usersArray = JSON.parse(existingUsersRaw);

    // 3. Find if a user matches the typed username/email
    const foundUser = usersArray.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!foundUser) {
      setError("User not found. Check your spelling or Register a new account.");
      return;
    }

    // 4. Verify the password matches
    if (foundUser.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    // 5. Prepare the successful user data payload using the stored database values
    const loggedInUser = {
      id: foundUser.id,
      name: foundUser.username,
      role: foundUser.role // Successfully uses 'owner' or 'user' matching what they signed up with!
    };

    // Update our global state umbrella
    login(loggedInUser);

    // Redirect back to their blocked destination or to their dashboard panels
    const nextDestination = location.state?.from?.pathname || 
                            (foundUser.role === 'owner' ? '/owner-dashboard' : '/my-matches');
                        
    navigate(nextDestination, { replace: true }); // Smooth history transition
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2>Sign In - SoccerBooker</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>{error}</div>}
      <form onSubmit={handleFormSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username / Email:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter your registered username"
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
 
/*
 import { useAuth } from "../Context/AuthContext";
import { useState } from "react";
import { NavLink, useLocation, Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user'); // Default role is user
  
  const navigate = useNavigate(); // Hook to move pages programmatically
  const location = useLocation(); // Hook to remember the blocked page
  const { login } = useAuth();    // Consume global login action

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Please enter a username.");
      return;
    }

    // Prepare mock user data to test our two distinct actors
    const loggedInUser = {
      id: "id_" + Date.now(),
      name: username,
      role: role // 'owner' or 'user'
    };

    // Update our global state umbrella
    login(loggedInUser);

    // Redirect back to their blocked destination or to their dashboard panels
    const nextDestination = location.state?.from?.pathname || 
                            (role === 'owner' ? '/owner-dashboard' : '/my-matches');
                        
    navigate(nextDestination, { replace: true }); // Smooth history transition
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2>Sign In - SoccerBooker</h2>
      <form onSubmit={handleFormSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username / Email:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter your name"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Select Account Role:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="user">Match Organizer (User)</option>
            <option value="owner">Stadium Owner (Owner)</option>
          </select>
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Mock Sign In
        </button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        Don't have an account? <Link to="/signup">Register here</Link>
      </p>
    </div>
  );
}

export default Login; */