import { useState } from "react";
import { api } from "../../../api";
import { colors, button, input, label } from "../../../theme";

function StadiumForm({ onStadiumAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  // Convert uploaded files to base64 data URLs so we can send them as JSON
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(dataUrls => setPhotos(dataUrls));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !location.trim()) {
      setError("Name and location are required.");
      return;
    }

    try {
      await api("/stadiums", {
        method: "POST",
        body: JSON.stringify({ name, description, location, photos })
      });

      setName(""); setDescription(""); setLocation(""); setPhotos([]);
      e.target.reset();
      if (onStadiumAdded) onStadiumAdded();
    } catch (err) {
      setError(err.message || "Could not add stadium");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{
          color: colors.danger,
          padding: '10px 12px',
          background: '#fef2f2',
          borderRadius: '8px',
          marginBottom: '12px'
        }}>{error}</div>
      )}

      <div style={{ marginBottom: '14px' }}>
        <label style={label}>Stadium name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Green Field Stadium"
          style={input}
        />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={label}>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Riyadh"
          style={input}
        />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the stadium and its facilities"
          rows="3"
          style={input}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={label}>Photos</label>
        <input type="file" multiple accept="image/*" onChange={handlePhotoChange} />
        {photos.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {photos.map((p, i) => (
              <img key={i} src={p} alt="" style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
            ))}
          </div>
        )}
      </div>

      <button type="submit" style={button.success}>+ Add Stadium</button>
    </form>
  );
}

export default StadiumForm;
