import { useState, useEffect, useCallback, useRef } from 'react';
import { getMetadata } from '../utils/apiUtils';
import axios from 'axios';

const useSpotifyPlayer = () => {
  const metadata = getMetadata();
  const [deviceId, setDeviceId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const playerRef = useRef(null);

  const getSpotifyToken = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/me/spotify_token`, metadata);
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching Spotify token:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    const handleSpotifySDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Swiftie Song App',
        getOAuthToken: cb => {
          getSpotifyToken().then(token => cb(token));
        },
        volume: 0.5,
      });

      playerRef.current = player;

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', state => {
        if (!state) {
          return;
        }

        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
      });

      player.connect();
    };

    // If the SDK is already ready (e.g., component mounts after SDK loads)
    if (window.Spotify) {
      handleSpotifySDKReady();
    } else {
      window.addEventListener('spotifySDKReady', handleSpotifySDKReady);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      window.removeEventListener('spotifySDKReady', handleSpotifySDKReady);
    };
  }, [getSpotifyToken]);

  const play = useCallback((spotify_uri) => {
    if (!playerRef.current || !deviceId) return;

    axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      uris: [spotify_uri],
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('spotify_access_token')}`,
      },
    });
  }, [deviceId]);

  const pause = useCallback(() => {
    if (!playerRef.current) return;
    playerRef.current.pause();
  }, []);

  const togglePlay = useCallback((spotify_uri) => {
    if (isPlaying && currentTrack && currentTrack.uri === spotify_uri) {
      pause();
    } else {
      play(spotify_uri);
    }
  }, [isPlaying, currentTrack, play, pause]);

  return { player: playerRef.current, deviceId, isPlaying, currentTrack, togglePlay };
};

export default useSpotifyPlayer;
