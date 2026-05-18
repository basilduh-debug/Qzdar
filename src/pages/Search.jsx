import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../api";
import { colors, page, card, button, input, label } from "../theme";

function Search() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/stadiums")
      .then(r => { setResults(r); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (date) {
        const slots = await api("/slots/search?date=" + encodeURIComponent(date) +
                                (location ? "&location=" + encodeURIComponent(location) : ""));
        const seen = new Set();
        const stadiums = [];
        for (const s of slots) {
          if (s.stadium && !seen.has(s.stadium._id)) {
            seen.add(s.stadium._id);
            stadiums.push(s.stadium);
          }
        }
        setResults(stadiums);
      } else {
        const r = await api("/stadiums?location=" + encodeURIComponent(location));
        setResults(r);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLocation(""); setDate("");
    setLoading(true);
    try {
      const all = await api("/stadiums");
      setResults(all);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <h1>Find a Stadium</h1>
      <p style={{ color: colors.muted, marginBottom: '20px' }}>Search by location or available date.</p>

      {/* Search form */}
      <div style={card}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={label}>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Riyadh"
                style={input}
              />
            </div>
            <div>
              <label style={label}>Available on date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={input} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={button.primary}>🔍 Search</button>
            <button type="button" onClick={handleReset} style={button.outline}>Reset</button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '10px 12px',
          background: '#fef2f2',
          color: colors.danger,
          borderRadius: '8px',
          marginBottom: '12px'
        }}>{error}</div>
      )}

      {/* Results */}
      <h2>Results <span style={{ color: colors.muted, fontWeight: 500, fontSize: '16px' }}>({results.length})</span></h2>

      {loading && <p style={{ color: colors.muted }}>Loading...</p>}
      {!loading && results.length === 0 && (
        <div style={{ ...card, textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔍</div>
          <p style={{ color: colors.muted }}>No stadiums match your criteria.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {results.map(s => (
          <div key={s._id} style={{
            ...card,
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            padding: '14px'
          }}>
            {s.photos && s.photos.length > 0 ? (
              <img src={s.photos[0]} alt={s.name} style={{ width: '140px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
            ) : (
              <div style={{
                width: '140px',
                height: '100px',
                background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px'
              }}>⚽</div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, marginBottom: '4px' }}>{s.name}</h3>
              <p style={{ color: colors.muted, fontSize: '14px', marginBottom: '8px' }}>📍 {s.location}</p>
              <p style={{ fontSize: '14px', marginBottom: '10px', color: colors.muted }}>{s.description}</p>
              <NavLink to={"/stadium/" + s._id} style={{ ...button.primary, padding: '6px 14px', fontSize: '13px' }}>
                View & book →
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
