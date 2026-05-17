import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api";

function MyMatches() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  const loadReservations = async () => {
    try {
      const data = await api("/slots/mine");
      // Sort by date then time
      data.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.startTime.localeCompare(b.startTime);
      });
      setReservations(data);
    } catch (err) {
      setError(err.message || "Could not load reservations");
    }
  };

  useEffect(() => {
    loadReservations();
  }, [user]);

  const handleCancel = async (slotId) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await api("/slots/" + slotId + "/cancel", { method: "PUT" });
      loadReservations();
    } catch (err) {
      setError(err.message || "Could not cancel");
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Matches</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {reservations.length === 0 && (
        <p style={{ color: '#666' }}>
          You haven't reserved any slots yet. <NavLink to="/search">Find a stadium</NavLink>
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {reservations.map(r => (
          <div key={r._id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '6px' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{r.stadium?.name || "Unknown stadium"}</h3>
            <p style={{ margin: '0 0 5px 0', color: '#666' }}>{r.stadium?.location}</p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>{r.date}</strong> · {r.startTime} - {r.endTime}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleCancel(r._id)}
                style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel Reservation
              </button>
              {r.stadium && r.stadium.owner && (
                <NavLink
                  to={"/messages?to=" + r.stadium.owner}
                  style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}
                >
                  Message owner
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
