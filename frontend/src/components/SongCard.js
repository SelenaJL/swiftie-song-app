import React from 'react';
import useSpotifyPlayer from '../hooks/useSpotifyPlayer';

function SongCard({ song }) {
  const { isPlaying, currentTrack, togglePlay } = useSpotifyPlayer();

  return (
    <div className="song-card-container">
      <h3>{song.title}</h3>
      {song.feature && <p>Feat. {song.feature}</p>}
      {song.from_the_vault && <div className="ftv-indicator">FTV 🔒</div>}
      {song.spotify_track_id && (
        <button onClick={() => togglePlay(`spotify:track:${song.spotify_track_id}`)} className="play-button">
          {isPlaying && currentTrack && currentTrack.uri === `spotify:track:${song.spotify_track_id}` ? 'Pause' : 'Play'}
        </button>
      )}
    </div>
  );
}

export default SongCard;