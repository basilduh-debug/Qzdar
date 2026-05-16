import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function StadiumDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [stadium, setStadium] = useState(null);
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");

  const loadData = () => {
    // Find the stadium by id in our localStorage database
    const stadiumsRaw = localStorage.getItem("soccerBooker_stadiums") || "[]";
    const stadiums = JSON.parse(stadiumsRaw);
    const found = stadiums.find(s => s.id === id);
    setStadium(found || null);

    // Load all slots for this stadium
    const slotsRaw = localStorage.getItem("soccerBooker_slots") || "[]";
    const allSlots = JSON.parse(slotsRaw);
    setSlots(allSlots.filter(s => s.stadiumId === id));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleReserve = (slotId) => {
    // Reserving requires being signed in
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/stadium/" + id } } });
      return;
    }
    if (user.role !== 'user') {
      setMessage("Only match organizers can reserve.");
      return;
    }

    const slotsRaw = localStorage.getItem("soccerBooker_slots") || "[]";
    const allSlots = JSON.parse(slotsRaw);
    const idx = allSlots.findIndex(s => s.id === slotId);
    if (idx === -1) return;

    if (allSlots[idx].status === 'reserved') {
      setMessage("This slot is already reserved.");
      return;
    }

    // Mark the slot as reserved by this user
    allSlots[idx].status = 'reserved';
    allSlots[idx].userId = user.id;
    allSlots[idx].userName = user.name;
    localStorage.setItem("soccerBooker_slots", JSON.stringify(allSlots));

    setMessage("Reservation confirmed!");
    loadData();
  };

  if (!stadium) {
    return <p style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Stadium not found.</p>;
  }

  // Sort slots by date then time
  const sortedSlots = [...slots].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

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

      {isAuthenticated && stadium.ownerId !== user?.id && (
        <p>
          <NavLink to={"/messages?to=" + stadium.ownerId}>Message the owner ({stadium.ownerName})</NavLink>
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
        {sortedSlots.map(s => (
          <div key={s.id} style={{
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
                onClick={() => handleReserve(s.id)}
                style={{ marginTop: '5px', padding: '4px 10px', background: 'white', color: '#28a745', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Reserve
              </button>
            )}
            {s.status === 'reserved' && s.userId === user?.id && (
              <div style={{ fontSize: '12px', marginTop: '5px' }}>Yours</div>
            )}
          </div>
        ))}
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
