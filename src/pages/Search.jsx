import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Search() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [allStadiums, setAllStadiums] = useState([]);
  const [results, setResults] = useState([]);

  // Load all stadiums from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem("soccerBooker_stadiums") || "[]";
    const all = JSON.parse(raw);
    setAllStadiums(all);
    setResults(all);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    let filtered = allStadiums;

    // Filter by location (case-insensitive substring match)
    if (location.trim()) {
      const locLower = location.toLowerCase();
      filtered = filtered.filter(s => s.location.toLowerCase().includes(locLower));
    }

    // Filter by time-slot availability: keep stadiums with at least one available slot on this date
    if (date) {
      const allSlotsRaw = localStorage.getItem("soccerBooker_slots") || "[]";
      const allSlots = JSON.parse(allSlotsRaw);
      const stadiumsWithSlot = new Set(
        allSlots.filter(s => s.date === date && s.status === 'available').map(s => s.stadiumId)
      );
      filtered = filtered.filter(s => stadiumsWithSlot.has(s.id));
    }

    setResults(filtered);
  };

  const handleReset = () => {
    setLocation("");
    setDate("");
    setResults(allStadiums);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Search Stadiums</h1>

      <form onSubmit={handleSearch} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Algiers"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Available on date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '8px' }} />
          </div>
          <button
            type="submit"
            style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Reset
          </button>
        </div>
      </form>

      <h2>Results ({results.length})</h2>
      {results.length === 0 && <p style={{ color: '#666' }}>No stadiums match your criteria.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {results.map(s => (
          <div key={s.id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '6px', display: 'flex', gap: '15px' }}>
            {s.photos && s.photos.length > 0 && (
              <img src={s.photos[0]} alt={s.name} style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '4px' }} />
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 5px 0' }}>
                <NavLink to={"/stadium/" + s.id}>{s.name}</NavLink>
              </h3>
              <p style={{ margin: '0 0 5px 0', color: '#666' }}>{s.location}</p>
              <p style={{ margin: '0' }}>{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
