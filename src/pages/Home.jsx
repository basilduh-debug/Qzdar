import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>SoccerBooker</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        Find a stadium, reserve a slot, and organize your match.
      </p>

      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>For Match Organizers</h3>
          <p>Search stadiums by location or time, reserve slots, and message owners.</p>
          {!isAuthenticated && <NavLink to="/signup">Register as a user</NavLink>}
          {isAuthenticated && user?.role === 'user' && <NavLink to="/search">Find a stadium</NavLink>}
        </div>

        <div style={{ flex: 1, minWidth: '250px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>For Stadium Owners</h3>
          <p>Add your stadium, manage reservation slots, and see statistics.</p>
          {!isAuthenticated && <NavLink to="/signup">Register as an owner</NavLink>}
          {isAuthenticated && user?.role === 'owner' && <NavLink to="/owner-dashboard">Go to dashboard</NavLink>}
        </div>
      </div>
    </div>
  );
}

export default Home;
