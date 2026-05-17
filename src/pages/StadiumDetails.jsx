import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api";

function StadiumDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [stadium, setStadium] = useState(null);
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const s = await api("/stadiums/" + id);
      setStadium(s);
      const slotsData = await api("/slots/stadium/" + id);
      setSlots(slotsData);
    } catch (err) {
      setStadium(null);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleReserve = async (slotId) => {
    // Reserving requires being signed in
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/stadium/" + id } } });
      return;
    }
    if (user.role !== 'user') {
      setMessage("Only match organizers can reserve.");
      return;
    }

    try {
      await api("/slots/" + slotId + "/reserve", { method: "PUT" });
      setMessage("Reservation confirmed!");
      loadData();
    } catch (err) {
      setMessage(err.message || "Could not reserve");
    }
  };

  if (!stadium) {
    return <p style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Stadium not found.</p>;
  }

  // Sort slots
  const sortedSlots = [...slots].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  const ownerId = stadium.owner?._id || stadium.owner;
  const ownerName = stadium.owner?.username || "owner";

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>{stadium.name}</h1>
      <p style={{ color: '#666' }}>Location: {stadium.location}</p>
      <p>{stadium.description}</p>

      {stadium.photos && stadium.photos.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '15px 0' }}>
          {stadium.photos.map((p, i) => (
            <img key={i} src={p} alt="" style={{ width: '180px', height: '130px', objectFit: 'cover', borderRadius: '6px' }} />
          ))}
        </div>
      )}

      {isAuthenticated && String(ownerId) !== user?.id && (
        <p>
          <NavLink to={"/messages?to=" + ownerId}>Message the owner ({ownerName})</NavLink>
        </p>
      )}

      {message && (
        <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px' }}>
          {message}
        </div>
      )}

      <h2>Schedule</h2>
      {sortedSlots.length === 0 && <p style={{ color: '#666' }}>No slots available yet.</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {sortedSlots.map(s => {
          const slotUserId = s.user?._id || s.user;
          return (
            <div key={s._id} style={{
              padding: '10px 15px',
              borderRadius: '4px',
              color: 'white',
              background: s.status === 'reserved' ? '#dc3545' : '#28a745',
              minWidth: '180px'
            }}>
              <div style={{ fontWeight: 'bold' }}>{s.date}</div>
              <div>{s.startTime} - {s.endTime}</div>
              {s.status === 'available' && (
                <button
                  onClick={() => handleReserve(s._id)}
                  style={{ marginTop: '5px', padding: '4px 10px', background: 'white', color: '#28a745', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Reserve
                </button>
              )}
              {s.status === 'reserved' && String(slotUserId) === user?.id && (
                <div style={{ fontSize: '12px', marginTop: '5px' }}>Yours</div>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: '14px', color: '#666', marginTop: '15px' }}>
        <span style={{ background: '#28a745', color: 'white', padding: '2px 8px', borderRadius: '3px' }}>Green</span>
        {' = available '}
        <span style={{ background: '#dc3545', color: 'white', padding: '2px 8px', borderRadius: '3px', marginLeft: '10px' }}>Red</span>
        {' = reserved'}
      </p>
    </div>
  );
}

export default StadiumDetails;
