import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role - match Login.jsx expectations
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    // 1. Get existing users from localStorage
    const existingUsersRaw = localStorage.getItem("soccerBooker_users");
    let usersArray = [];
    
    if (existingUsersRaw) {
      usersArray = JSON.parse(existingUsersRaw);
    }

    // 2. Check if username already exists
    if (usersArray.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      setError("Username already exists. Please choose a different one.");
      return;
    }

    // 3. Create the new user object with matching fields
    const newUser = {
      id: "id_" + Date.now(),
      username: username,
      password: password, // Note: In a real app, never save passwords in plain text!
      role: role // 'owner' or 'user'
    };

    // 4. Add to the array and save back to localStorage
    usersArray.push(newUser);
    localStorage.setItem("soccerBooker_users", JSON.stringify(usersArray));

    alert("Registration successful! Redirecting to login...");
    
    // 5. Send them to the login page
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2>Sign Up - SoccerBooker</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Choose a username"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter a password"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Account Role:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="user">Match Organizer (User)</option>
            <option value="owner">Stadium Owner (Owner)</option>
          </select>
        </div>
        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default SignUp;