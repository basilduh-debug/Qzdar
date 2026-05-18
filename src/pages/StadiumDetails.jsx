import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api";
import { colors, page, card, button, formatTime12h } from "../theme";

function StadiumDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [stadium, setStadium] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const s = await api("/stadiums/" + id);
      setStadium(s);
      const slotsData = await api("/slots/stadium/" + id);
      setSlots(slotsData);
      // Auto-select the first day that has slots
      if (slotsData.length > 0 && !selectedDate) {
        const sorted = [...slotsData].sort((a, b) => a.date.localeCompare(b.date));
        setSelectedDate(sorted[0].date);
      }
    } catch (err) {
      setStadium(null);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleReserve = async (slotId) => {
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
    return (
      <div style={{ ...page, textAlign: 'center', marginTop: '80px' }}>
        <p style={{ color: colors.muted }}>Stadium not found.</p>
      </div>
    );
  }

  // Build the next 7 days array (for the day picker)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push({
      value: `${yyyy}-${mm}-${dd}`,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      num: dd,
      month: d.toLocaleDateString('en-US', { month: 'short' })
    });
  }

  const slotsForDay = slots.filter(s => s.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const ownerId = stadium.owner?._id || stadium.owner;
  const ownerName = stadium.owner?.username || "owner";

  return (
    <div style={page}>
      {/* Hero header */}
      <div style={{
        ...card,
        padding: 0,
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        {stadium.photos && stadium.photos.length > 0 ? (
          <img
            src={stadium.photos[0]}
            alt={stadium.name}
            style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            height: '180px',
            background: 'linear-gradient(135deg, #0d6efd, #1d3557)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '72px'
          }}>⚽</div>
        )}

        <div style={{ padding: '24px' }}>
          <h1 style={{ marginBottom: '4px' }}>{stadium.name}</h1>
          <p style={{ color: colors.muted, marginBottom: '16px' }}>📍 {stadium.location}</p>
          <p style={{ marginBottom: '16px' }}>{stadium.description}</p>

          {isAuthenticated && String(ownerId) !== user?.id && (
            <NavLink to={"/messages?to=" + ownerId} style={{ ...button.outline, padding: '8px 16px' }}>
              💬 Message {ownerName}
            </NavLink>
          )}
        </div>
      </div>

      {/* Photo gallery */}
      {stadium.photos && stadium.photos.length > 1 && (
        <div style={{ ...card, marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>Photos</h3>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {stadium.photos.slice(1).map((p, i) => (
              <img key={i} src={p} alt="" style={{
                width: '180px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '8px',
                flexShrink: 0
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Day picker — mimics the reference design */}
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Book a slot</h2>

        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px'
        }}>
          {days.map(d => {
            const selected = d.value === selectedDate;
            return (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                style={{
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: selected ? colors.selected : 'white',
                  color: selected ? 'white' : colors.text,
                  cursor: 'pointer',
                  minWidth: '70px',
                  textAlign: 'center',
                  boxShadow: selected ? 'none' : '0 1px 2px rgba(0,0,0,0.06)',
                  border: selected ? 'none' : '1px solid ' + colors.border
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.8 }}>{d.day}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, margin: '4px 0' }}>{d.num}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>{d.month}</div>
              </button>
            );
          })}
        </div>

        {message && (
          <div style={{
            padding: '12px 14px',
            background: '#d1e7dd',
            color: '#0a3622',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {message}
          </div>
        )}

        {/* Slot grid — clean white cards like the reference */}
        {slotsForDay.length === 0 ? (
          <p style={{ color: colors.muted, textAlign: 'center', padding: '20px' }}>
            No slots for this day.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '10px'
          }}>
            {slotsForDay.map(s => {
              const slotUserId = s.user?._id || s.user;
              const reserved = s.status === 'reserved';
              const mine = reserved && String(slotUserId) === user?.id;

              return (
                <button
                  key={s._id}
                  onClick={() => !reserved && handleReserve(s._id)}
                  disabled={reserved}
                  style={{
                    border: '1px solid ' + (reserved ? '#fecaca' : colors.border),
                    padding: '14px 8px',
                    borderRadius: '10px',
                    background: reserved ? '#fef2f2' : 'white',
                    color: reserved ? colors.danger : colors.text,
                    cursor: reserved ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                    opacity: reserved && !mine ? 0.6 : 1
                  }}
                >
                  <div>{formatTime12h(s.startTime)}</div>
                  <div style={{ fontSize: '11px', fontWeight: 500, opacity: 0.7, marginTop: '2px' }}>
                    {formatTime12h(s.endTime)}
                  </div>
                  {mine && <div style={{ fontSize: '10px', marginTop: '4px', color: colors.primary }}>Yours</div>}
                </button>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: '16px', fontSize: '13px', color: colors.muted, display: 'flex', gap: '14px' }}>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: 'white', border: '1px solid ' + colors.border, borderRadius: '3px', marginRight: '4px' }}></span> Available</span>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '3px', marginRight: '4px' }}></span> Reserved</span>
        </div>
      </div>
    </div>
  );
}

export default StadiumDetails;
