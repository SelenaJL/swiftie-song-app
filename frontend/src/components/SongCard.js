// src/components/SongCard.js
import React from 'react';
import '../SongCard.css'; // Import the new CSS file

function SongCard({ song }) {
  return (
    <div className="song-card-container">
      <h3>{song.title}</h3>
      {song.feature && <p>Feat. {song.feature}</p>}
      {song.from_the_vault && <div className="ftv-indicator">FTV 🔒</div>}
    </div>
  );
}

export default SongCard;