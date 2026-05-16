import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerStadium from './pages/OwnerStadium';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import StadiumDetails from './pages/StadiumDetails';
import MyMatches from './pages/MyMatches';
import Messages from './pages/Messages';
import PrivateRoute from './src/components/PrivateRoute';
import { useAuth } from './Context/AuthContext';

const NotFound = () => <h2 style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>404 - Page Not Found</h2>;


function App() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <BrowserRouter>
      <div>
        <nav style={{ background: '#f8f9fa', padding: '15px', display: 'flex', gap: '15px', alignItems: 'center', fontFamily: 'sans-serif' }}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/search">Search</NavLink>

          { isAuthenticated && user?.role === 'owner' && (<NavLink to="/owner-dashboard">Owner Dashboard</NavLink>) }
          { isAuthenticated && user?.role === 'user' && (<NavLink to="/my-matches">My Matches</NavLink>) }
          { isAuthenticated && (<NavLink to="/messages">Messages</NavLink>) }

          { isAuthenticated ? (
            <>
              <span style={{ marginLeft: 'auto' }}>Hi, {user?.name}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={{ marginLeft: 'auto' }}>Login</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          <Route path="/stadium/:id" element={<StadiumDetails />} />
          <Route path="/owner-dashboard" element={<PrivateRoute acceptedRole="owner"><OwnerDashboard /></PrivateRoute>} />
          <Route path="/owner/stadium/:id" element={<PrivateRoute acceptedRole="owner"><OwnerStadium /></PrivateRoute>} />
          <Route path="/my-matches" element={<PrivateRoute acceptedRole="user"><MyMatches /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
