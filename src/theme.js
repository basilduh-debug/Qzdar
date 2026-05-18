// Shared style helpers used across pages so the look stays consistent.

export const colors = {
  primary: '#0d6efd',
  primaryDark: '#0a58ca',
  success: '#198754',
  successDark: '#146c43',
  danger: '#dc3545',
  dangerDark: '#bb2d3b',
  text: '#1a1a1a',
  muted: '#6c757d',
  bg: '#f5f7fa',
  card: '#ffffff',
  border: '#e5e7eb',
  selected: '#1d3557'
};

export const page = {
  maxWidth: '1000px',
  margin: '30px auto',
  padding: '0 20px',
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  color: colors.text
};

export const card = {
  background: colors.card,
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  marginBottom: '15px'
};

export const button = {
  primary: {
    padding: '10px 20px',
    background: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block'
  },
  success: {
    padding: '10px 20px',
    background: colors.success,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block'
  },
  danger: {
    padding: '10px 20px',
    background: colors.danger,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block'
  },
  outline: {
    padding: '10px 20px',
    background: 'white',
    color: colors.primary,
    border: '1px solid ' + colors.primary,
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block'
  }
};

export const input = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid ' + colors.border,
  borderRadius: '8px',
  fontSize: '14px',
  boxSizing: 'border-box',
  background: 'white'
};

export const label = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: 600,
  color: colors.text
};

// Generate "00:00, 00:30, 01:00, ... 23:30" pairs for slot dropdowns
export function generateTimeOptions() {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const value = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
      const hour12 = h % 12 || 12;
      const period = h < 12 ? 'AM' : 'PM';
      const label = hour12 + ':' + String(m).padStart(2, '0') + ' ' + period;
      opts.push({ value, label });
    }
  }
  return opts;
}

// Convert "14:30" to "2:30 PM"
export function formatTime12h(hhmm) {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const hour12 = h % 12 || 12;
  const period = h < 12 ? 'AM' : 'PM';
  return hour12 + ':' + String(m).padStart(2, '0') + ' ' + period;
}

// "2026-05-18" -> "Mon 18 May"
export function formatDateShort(yyyymmdd) {
  if (!yyyymmdd) return '';
  const d = new Date(yyyymmdd);
  return d.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' });
}
