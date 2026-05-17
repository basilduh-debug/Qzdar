import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api";
import StadiumForm from "../src/components/Owner/StadiumForm";

function OwnerDashboard() {
  const { user } = useAuth();
  const [stadiums, setStadiums] = useState([]);
  const [stats, setStats] = useState({ stadiums: 0, totalSlots: 0, reserved: 0, available: 0 });
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const myStadiums = await api("/stadiums/mine");
      setStadiums(myStadiums);

      const s = await api("/slots/stats");
      setStats(s);
    } catch (err) {
      setError(err.message || "Could not load data");
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Reload after a new stadium is added
  const handleStadiumAdded = () => {
    loadData();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Owner Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Statistics</h2>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
        <div style={{ padding: '15px 20px', background: '#e8f4ff', borderRadius: '6px', minWidth: '120px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.stadiums}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Stadiums</div>
        </div>
        <div style={{ padding: '15px 20px', background: '#f0f0f0', borderRadius: '6px', minWidth: '120px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalSlots}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total slots</div>
        </div>
        <div style={{ padding: '15px 20px', background: '#ffe0e0', borderRadius: '6px', minWidth: '120px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.reserved}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Reserved</div>
        </div>
        <div style={{ padding: '15px 20px', background: '#d4edda', borderRadius: '6px', minWidth: '120px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.available}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Available</div>
        </div>
      </div>

      <h2>Add a New Stadium</h2>
      <StadiumForm onStadiumAdded={handleStadiumAdded} />

      <h2 style={{ marginTop: '30px' }}>My Stadiums</h2>
      {stadiums.length === 0 && <p style={{ color: '#666' }}>You haven't added any stadiums yet.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {stadiums.map(s => (
          <div key={s._id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '6px', display: 'flex', gap: '15px' }}>
            {s.photos && s.photos.length > 0 && (
              <img src={s.photos[0]} alt={s.name} style={{ width: '100px', height: '75px', objectFit: 'cover', borderRadius: '4px' }} />
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{s.name}</h3>
              <p style={{ margin: '0 0 5px 0', color: '#666' }}>{s.location}</p>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>{s.description}</p>
              <NavLink to={"/owner/stadium/" + s._id} style={{ marginRight: '10px' }}>Manage slots & reservations</NavLink>
              <NavLink to={"/stadium/" + s._id}>View public page</NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OwnerDashboard;
