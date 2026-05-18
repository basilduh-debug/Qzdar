import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { colors, page, card, button } from "../theme";

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ ...page, maxWidth: '900px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0d6efd 0%, #1d3557 100%)',
        color: 'white',
        padding: '50px 30px',
        borderRadius: '16px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'white', fontSize: '36px', marginBottom: '12px' }}>SoccerBooker</h1>
        <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '24px' }}>
          Find a stadium, reserve a slot, and organize your match.
        </p>
        <NavLink to="/search" style={{
          ...button.primary,
          background: 'white',
          color: colors.primary,
          padding: '12px 28px',
          fontSize: '16px'
        }}>
          Search stadiums
        </NavLink>
      </div>

      {/* Two role cards */}
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div style={card}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
          <h3>For Match Organizers</h3>
          <p style={{ color: colors.muted, marginBottom: '16px' }}>
            Search stadiums by location or time, reserve slots, and message owners.
          </p>
          {!isAuthenticated && (
            <NavLink to="/signup" style={button.primary}>Register as a user</NavLink>
          )}
          {isAuthenticated && user?.role === 'user' && (
            <NavLink to="/search" style={button.primary}>Find a stadium</NavLink>
          )}
        </div>

        <div style={card}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏟️</div>
          <h3>For Stadium Owners</h3>
          <p style={{ color: colors.muted, marginBottom: '16px' }}>
            Add your stadium, manage reservation slots, and see statistics.
          </p>
          {!isAuthenticated && (
            <NavLink to="/signup" style={button.success}>Register as an owner</NavLink>
          )}
          {isAuthenticated && user?.role === 'owner' && (
            <NavLink to="/owner-dashboard" style={button.success}>Go to dashboard</NavLink>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
