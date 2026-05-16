import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function MyMatches() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);

  const loadReservations = () => {
    // Get all slots and keep the ones this user has reserved
    const slotsRaw = localStorage.getItem("soccerBooker_slots") || "[]";
    const allSlots = JSON.parse(slotsRaw);
    const myReservations = allSlots.filter(s => s.userId === user.id);

    // Enrich with stadium info for display
    const stadiumsRaw = localStorage.getItem("soccerBooker_stadiums") || "[]";
    const stadiums = JSON.parse(stadiumsRaw);
    const enriched = myReservations.map(r => ({
      ...r,
      stadium: stadiums.find(s => s.id === r.stadiumId)
    }));

    // Sort by date then time
    enriched.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });

    setReservations(enriched);
  };

  useEffect(() => {
    loadReservations();
  }, [user]);

  const handleCancel = (slotId) => {
    if (!window.confirm("Cancel this reservation?")) return;

    const slotsRaw = localStorage.getItem("soccerBooker_slots") || "[]";
    const allSlots = JSON.parse(slotsRaw);
    const idx = allSlots.findIndex(s => s.id === slotId);
    if (idx === -1) return;

    // Free up the slot
    allSlots[idx].status = 'available';
    allSlots[idx].userId = null;
    allSlots[idx].userName = null;
    localStorage.setItem("soccerBooker_slots", JSON.stringify(allSlots));

    loadReservations();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Matches</h1>
      {reservations.length === 0 && (
        <p style={{ color: '#666' }}>
          You haven't reserved any slots yet. <NavLink to="/search">Find a stadium</NavLink>
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {reservations.map(r => (
          <div key={r.id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '6px' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{r.stadium?.name || "Unknown stadium"}</h3>
            <p style={{ margin: '0 0 5px 0', color: '#666' }}>{r.stadium?.location}</p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>{r.date}</strong> · {r.startTime} - {r.endTime}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleCancel(r.id)}
                style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel Reservation
              </button>
              {r.stadium && (
                <NavLink
                  to={"/messages?to=" + r.stadium.ownerId}
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
