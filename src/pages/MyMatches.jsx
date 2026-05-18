import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api";
import { colors, page, card, button, formatTime12h, formatDateShort } from "../theme";

function MyMatches() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  const loadReservations = async () => {
    try {
      const data = await api("/slots/mine");
      data.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.startTime.localeCompare(b.startTime);
      });
      setReservations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadReservations(); }, [user]);

  const handleCancel = async (slotId) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await api("/slots/" + slotId + "/cancel", { method: "PUT" });
      loadReservations();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={page}>
      <h1>My Matches</h1>
      <p style={{ color: colors.muted, marginBottom: '20px' }}>Your upcoming reservations.</p>

      {error && (
        <div style={{
          padding: '10px 12px',
          background: '#fef2f2',
          color: colors.danger,
          borderRadius: '8px',
          marginBottom: '12px'
        }}>{error}</div>
      )}

      {reservations.length === 0 && (
        <div style={{ ...card, textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚽</div>
          <p style={{ color: colors.muted, marginBottom: '16px' }}>You haven't reserved any slots yet.</p>
          <NavLink to="/search" style={button.primary}>Find a stadium</NavLink>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {reservations.map(r => (
          <div key={r._id} style={{
            ...card,
            padding: '16px',
            borderLeft: '4px solid ' + colors.primary
          }}>
            <h3 style={{ margin: 0, marginBottom: '4px' }}>{r.stadium?.name || "Unknown stadium"}</h3>
            <p style={{ color: colors.muted, fontSize: '14px', marginBottom: '8px' }}>📍 {r.stadium?.location}</p>
            <p style={{ marginBottom: '12px' }}>
              📅 <strong>{formatDateShort(r.date)}</strong>
              <span style={{ marginLeft: '12px' }}>⏰ {formatTime12h(r.startTime)} - {formatTime12h(r.endTime)}</span>
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleCancel(r._id)}
                style={{ ...button.danger, padding: '8px 14px', fontSize: '13px' }}
              >
                Cancel Reservation
              </button>
              {r.stadium && r.stadium.owner && (
                <NavLink
                  to={"/messages?to=" + r.stadium.owner}
                  style={{ ...button.outline, padding: '8px 14px', fontSize: '13px' }}
                >
                  💬 Message owner
                </NavLink>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyMatches;
