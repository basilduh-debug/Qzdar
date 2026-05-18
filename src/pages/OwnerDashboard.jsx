import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api";
import { colors, page, card, button } from "../theme";
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

  useEffect(() => { loadData(); }, [user]);

  const handleStadiumAdded = () => loadData();

 

  const Stat = ({ label, value, color }) => (
    <div style={{
      ...card,
      flex: 1,
      minWidth: '140px',
      marginBottom: 0,
      borderLeft: '4px solid ' + color
    }}>
      <div style={{ fontSize: '28px', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '13px', color: colors.muted, marginTop: '4px' }}>{label}</div>
    </div>
  );

  return (
    <div style={page}>
      <h1>Owner Dashboard</h1>
      <p style={{ color: colors.muted, marginBottom: '20px' }}>Welcome back, {user?.name}</p>

      {error && (
        <div style={{
          padding: '10px 12px',
          background: '#fef2f2',
          color: colors.danger,
          borderRadius: '8px',
          marginBottom: '12px'
        }}>{error}</div>
      )}

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <Stat label="Stadiums" value={stats.stadiums} color={colors.primary} />
        <Stat label="Total slots" value={stats.totalSlots} color="#6c757d" />
        <Stat label="Reserved" value={stats.reserved} color={colors.danger} />
        <Stat label="Available" value={stats.available} color={colors.success} />
      </div>

      {/* Add stadium */}
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Add a New Stadium</h2>
        <StadiumForm onStadiumAdded={handleStadiumAdded} />
      </div>

      {/* My stadiums */}
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>My Stadiums</h2>
        {stadiums.length === 0 && <p style={{ color: colors.muted }}>You haven't added any stadiums yet.</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stadiums.map(s => (
            <div key={s._id} style={{
              padding: '14px',
              border: '1px solid ' + colors.border,
              borderRadius: '12px',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}>
              {s.photos && s.photos.length > 0 ? (
                <img src={s.photos[0]} alt={s.name} style={{ width: '110px', height: '85px', objectFit: 'cover', borderRadius: '8px' }} />
              ) : (
                <div style={{
                  width: '110px',
                  height: '85px',
                  background: '#f0f0f0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px'
                }}>⚽</div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: 0, marginBottom: '4px' }}>{s.name}</h3>
                <p style={{ color: colors.muted, fontSize: '14px', marginBottom: '4px' }}>{s.location}</p>
                <p style={{ fontSize: '14px', marginBottom: '10px' }}>{s.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <NavLink to={"/owner/stadium/" + s._id} style={{ ...button.primary, padding: '6px 12px', fontSize: '13px' }}>
                    Manage slots
                  </NavLink>
                  <NavLink to={"/stadium/" + s._id} style={{ ...button.outline, padding: '6px 12px', fontSize: '13px' }}>
                    View public page
                  </NavLink>
                 
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
