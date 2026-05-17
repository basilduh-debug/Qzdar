import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api";
import ReservationGrid from "../src/components/Owner/ReservationGrid";

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
      // Only the owner can manage their stadium
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

  useEffect(() => {
    loadStadium();
  }, [id]);

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

  if (pageError) {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <p style={{ color: 'red' }}>{pageError}</p>
        <button
          onClick={() => navigate("/owner-dashboard")}
          style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!stadium) return <p style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>{stadium.name}</h1>
      <p style={{ color: '#666' }}>{stadium.location}</p>

      <h2>Add a Reservation Slot</h2>
      <p style={{ fontSize: '14px', color: '#666' }}>You can only add slots for the next 7 days.</p>

      <form onSubmit={handleAddSlot} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '30px' }}>
        {error && <div style={{ color: 'red', marginBottom: '10px', padding: '8px', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Start time:</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ padding: '8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>End time:</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ padding: '8px' }} />
          </div>
          <button
            type="submit"
            style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Slot
          </button>
        </div>
      </form>

      <h2>Reservation Status</h2>
      <ReservationGrid slots={slots} />
    </div>
  );
}

export default OwnerStadium;
