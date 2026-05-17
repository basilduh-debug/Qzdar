import { NavLink } from "react-router-dom";

function ReservationGrid({ slots }) {
  if (!slots || slots.length === 0) {
    return <p style={{ color: '#666' }}>No slots created yet.</p>;
  }

  // Sort by date then start time
  const sortedSlots = [...slots].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
        {sortedSlots.map(s => (
          <div
            key={s._id}
            style={{
              padding: '10px 15px',
              borderRadius: '4px',
              color: 'white',
              background: s.status === 'reserved' ? '#dc3545' : '#28a745',
              minWidth: '180px'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{s.date}</div>
            <div>{s.startTime} - {s.endTime}</div>
            {s.status === 'reserved' && s.user && (
              <>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>Reserved by: {s.user.username}</div>
                <NavLink
                  to={"/messages?to=" + s.user._id}
                  style={{ color: 'white', fontSize: '12px', textDecoration: 'underline' }}
                >
                  Message user
                </NavLink>
              </>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: '14px', color: '#666' }}>
        <span style={{ background: '#28a745', color: 'white', padding: '2px 8px', borderRadius: '3px' }}>Green</span>
        {' = available '}
        <span style={{ background: '#dc3545', color: 'white', padding: '2px 8px', borderRadius: '3px', marginLeft: '10px' }}>Red</span>
        {' = reserved'}
      </p>
    </div>
  );
}

export default ReservationGrid;
