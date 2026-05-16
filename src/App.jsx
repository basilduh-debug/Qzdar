import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import OwnerDashboard from './pages/OwnerDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './src/components/PrivateRoute';
import { useAuth } from './Context/AuthContext';

// mock components incase we don't have actual implementations yet
const MyMatches = () => <h2>Match Organizer Dashboard</h2>;
const NotFound = () => <h2>404 - Page Not Found</h2>;


function App() {
 const {isAuthenticated, user,logout } = useAuth();
  return (
    <BrowserRouter>
      <div>
        <nav style={{ background: '#f8f9fa', padding: '15px', display: 'flex', gap: '15px' }}>
          <NavLink to="/">Home</NavLink>
          { isAuthenticated&& user?.role === 'owner' && (<NavLink to="/owner-dashboard">Owner Dashboard</NavLink>) }

          { isAuthenticated&& user?.role === 'user' && (<NavLink to="/my-matches">My Matches</NavLink>) }

          

          { isAuthenticated ? (   // If user is authenticated, show logout button, otherwise show login link
            <button onClick={logout} style={{ marginLeft: 'auto' }}>Logout</button>
          ) : (
            <NavLink to="/login" style={{ marginLeft: 'auto' }}>Login</NavLink>
          )}  
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/owner-dashboard" element={<PrivateRoute acceptedRole="owner"><OwnerDashboard /></PrivateRoute>} /> //Protected Owner Route
          <Route path="/my-matches" element={<PrivateRoute acceptedRole="user"><MyMatches /></PrivateRoute>} /> //Protected Regular User Route
          <Route path="*" element={<NotFound />} /> // Catch-all route for undefined paths
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;