import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api";
import { colors, page, card, button, input, label, generateTimeOptions } from "../theme";
import ReservationGrid from "../src/components/Owner/ReservationGrid";

const TIME_OPTIONS = generateTimeOptions();

function OwnerStadium() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stadium, setStadium] = useState(null);
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");

  const loadStadium = async () => {
    try {
      const s = await api("/stadiums/" + id);
      const ownerId = s.owner?._id || s.owner;
      if (String(ownerId) !== user.id) {
        setPageError("This is not your stadium.");
        return;
      }
      setStadium(s);

      const slotsData = await api("/slots/stadium/" + id);
      setSlots(slotsData);
    } catch (err) {
      setPageError(err.message || "Stadium not found.");
    }
  };

  useEffect(() => { loadStadium(); }, [id]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setError("");

    if (!date || !startTime || !endTime) {
      setError("Please fill date, start time and end time.");
      return;
    }
    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }

    try {
      await api("/slots", {
        method: "POST",
        body: JSON.stringify({ stadium: id, date, startTime, endTime })
      });
      setDate("");
      setStartTime("");
      setEndTime("");
      loadStadium();
    } catch (err) {
      setError(err.message || "Could not add slot");
    }
  };

  const handleDeleteStadium = async () => {
    if (!window.confirm("Delete this stadium and ALL its slots? This cannot be undone.")) return;
    try {
      await api("/stadiums/" + id, { method: "DELETE" });
      navigate("/owner-dashboard");
    } catch (err) {
      setError(err.message || "Could not delete");
    }
  };

  if (pageError) {
    return (
      <div style={{ ...page, textAlign: 'center', marginTop: '60px' }}>
        <p style={{ color: colors.danger, marginBottom: '16px' }}>{pageError}</p>
        <button onClick={() => navigate("/owner-dashboard")} style={button.primary}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!stadium) return <p style={{ ...page, textAlign: 'center' }}>Loading...</p>;

  return (
    <div style={page}>
      {/* Header */}
      <div style={{ ...card, display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, marginBottom: '4px' }}>{stadium.name}</h1>
          <p style={{ color: colors.muted }}>📍 {stadium.location}</p>
        </div>
        <button onClick={handleDeleteStadium} style={button.danger}>
          🗑 Delete Stadium
        </button>
      </div>

      {/* Add slot form */}
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Add a Reservation Slot</h2>
        <p style={{ color: colors.muted, fontSize: '14px', marginBottom: '16px' }}>
          You can only add slots for the next 7 days. Times are in 30-minute increments.
        </p>

        {error && (
          <div style={{
            color: colors.danger,
            padding: '10px 12px',
            background: '#fef2f2',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>{error}</div>
        )}

        <form onSubmit={handleAddSlot}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={label}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={input} />
            </div>
            <div>
              <label style={label}>Start time</label>
              <select value={startTime} onChange={(e) => setStartTime(e.target.value)} style={input}>
                <option value="">Select...</option>
                {TIME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>End time</label>
              <select value={endTime} onChange={(e) => setEndTime(e.target.value)} style={input}>
                <option value="">Select...</option>
                {TIME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" style={button.primary}>+ Add Slot</button>
        </form>
      </div>

      {/* Reservation status grid */}
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Reservation Status</h2>
        <ReservationGrid slots={slots} />
      </div>
    </div>
  );
}

export default OwnerStadium;
