import { useState } from "react";
import { useAuth } from "../../../Context/AuthContext";

function StadiumForm({ onStadiumAdded }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  // Convert uploaded files to base64 data URLs so we can store them in localStorage
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(dataUrls => setPhotos(dataUrls));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !location.trim()) {
      setError("Name and location are required.");
      return;
    }

    // 1. Read existing stadiums from our localStorage database
    const existingRaw = localStorage.getItem("soccerBooker_stadiums") || "[]";
    const stadiumsArray = JSON.parse(existingRaw);

    // 2. Build the new stadium object
    const newStadium = {
      id: "stadium_" + Date.now(),
      ownerId: user.id,
      ownerName: user.name,
      name: name,
      description: description,
      location: location,
      photos: photos
    };

    // 3. Push and save
    stadiumsArray.push(newStadium);
    localStorage.setItem("soccerBooker_stadiums", JSON.stringify(stadiumsArray));

    // Reset the form
    setName("");
    setDescription("");
    setLocation("");
    setPhotos([]);
    e.target.reset();

    if (onStadiumAdded) onStadiumAdded();
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      {error && <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>{error}</div>}

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Stadium name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Green Field Stadium"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Algiers"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the stadium and its facilities"
          rows="3"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Photos:</label>
        <input type="file" multiple accept="image/*" onChange={handlePhotoChange} />
        {photos.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {photos.map((p, i) => (
              <img key={i} src={p} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Add Stadium
      </button>
    </form>
  );
}

export default StadiumForm;
