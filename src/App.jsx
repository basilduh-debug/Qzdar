import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
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
import { colors } from './theme';

const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'inherit' }}>
    <h1>404</h1>
    <p style={{ color: colors.muted }}>Page not found</p>
  </div>
);

// One reusable nav link styled as a pill / button
function NavButton({ to, children, primary }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: '8px 16px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 600,
        transition: 'background 0.15s',
        background: primary
          ? colors.primary
          : isActive ? '#eef3ff' : 'transparent',
        color: primary
          ? 'white'
          : isActive ? colors.primary : colors.text
      })}
    >
      {children}
    </NavLink>
  );
}

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <BrowserRouter>
      <nav style={{
        background: 'white',
        padding: '12px 24px',
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <NavLink to="/" style={{
          fontSize: '20px',
          fontWeight: 800,
          color: colors.primary,
          textDecoration: 'none',
          marginRight: '20px',
          letterSpacing: '-0.02em'
        }}>
          ⚽ SoccerBooker
        </NavLink>

        <NavButton to="/">Home</NavButton>
        <NavButton to="/search">Search</NavButton>

        {isAuthenticated && user?.role === 'owner' && (
          <NavButton to="/owner-dashboard">Dashboard</NavButton>
        )}
        {isAuthenticated && user?.role === 'user' && (
          <NavButton to="/my-matches">My Matches</NavButton>
        )}
        {isAuthenticated && (
          <NavButton to="/messages">Messages</NavButton>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: colors.muted, fontSize: '14px' }}>Hi, <b style={{ color: colors.text }}>{user?.name}</b></span>
              <button
                onClick={logout}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  color: colors.danger,
                  border: '1px solid ' + colors.danger,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavButton to="/login">Login</NavButton>
              <NavButton to="/signup" primary>Sign Up</NavButton>
            </>
          )}
        </div>
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
    </BrowserRouter>
  );
}

export default App;
