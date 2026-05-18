import { NavLink } from "react-router-dom";
import { colors, formatTime12h, formatDateShort } from "../../../theme";

function ReservationGrid({ slots }) {
  if (!slots || slots.length === 0) {
    return <p style={{ color: colors.muted }}>No slots created yet.</p>;
  }

  // Sort by date then start time
  const sortedSlots = [...slots].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  // Group slots by date
  const grouped = {};
  for (const s of sortedSlots) {
    if (!grouped[s.date]) grouped[s.date] = [];
    grouped[s.date].push(s);
  }

  return (
    <div>
      {Object.entries(grouped).map(([date, daySlots]) => (
        <div key={date} style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: 600, color: colors.muted, fontSize: '13px', marginBottom: '8px' }}>
            {formatDateShort(date)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
            {daySlots.map(s => (
              <div
                key={s._id}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: s.status === 'reserved' ? '#fef2f2' : '#f0fdf4',
                  border: '1px solid ' + (s.status === 'reserved' ? '#fecaca' : '#bbf7d0'),
                  color: s.status === 'reserved' ? '#991b1b' : '#166534'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {formatTime12h(s.startTime)} - {formatTime12h(s.endTime)}
                </div>
                {s.status === 'reserved' && s.user && (
                  <>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>By {s.user.username}</div>
                    <NavLink
                      to={"/messages?to=" + s.user._id}
                      style={{ fontSize: '12px', color: '#991b1b', textDecoration: 'underline' }}
                    >
                      Message
                    </NavLink>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ fontSize: '13px', color: colors.muted, display: 'flex', gap: '14px', marginTop: '12px' }}>
        <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '3px', marginRight: '4px' }}></span> Available</span>
        <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '3px', marginRight: '4px' }}></span> Reserved</span>
      </div>
    </div>
  );
}

export default ReservationGrid;
