// src/components/SongCard.js
import React from 'react';

function SongCard({ song }) {
  return (
    <div style={{ margin: '5px', padding: '10px' }}>
      <h3>{song.title}</h3>
      {song.feature && <p>Feat. {song.feature}</p>}
    </div>
  );
}

export default SongCard;