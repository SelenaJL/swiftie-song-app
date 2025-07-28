// frontend/src/hooks/useAlbumData.js
import { useState, useEffect } from 'react';
import { getMetadata } from '../utils/apiUtils';
import axios from 'axios';


const useAlbumData = (albumId) => {
  const metadata = getMetadata();
  const [tiers, setTiers] = useState([]);
  const [album, setAlbum] = useState(null);
  const [rankedSongsByTier, setRankedSongsByTier] = useState({});
  const [unrankedSongs, setUnrankedSongs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to rank songs from this album.');
          return;
        }

        const tiersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tiers`);
        const albumResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/albums/${albumId}`);
        const songsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/albums/${albumId}/songs`);
        const rankingsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/albums/${albumId}/rankings`, metadata);

        const songs = songsResponse.data;
        const songsById = songs.reduce((acc, song) => {
          acc[song.id] = song;
          return acc;
        }, {});
        const rankedSongIds = new Set();
        const initialRankedSongs = tiersResponse.data.reduce((acc, tier) => {
          acc[tier.id] = [];
          return acc;
        }, {});
        rankingsResponse.data.forEach(ranking => {
          const song = songsById[ranking.song_id];
          if (song && initialRankedSongs[ranking.tier_id]) {
            initialRankedSongs[ranking.tier_id].push({ ...song, rankingId: ranking.id });
            rankedSongIds.add(ranking.song_id);
          }
        });
        const initialUnrankedSongs = songs.filter(song => !rankedSongIds.has(song.id));

        setTiers(tiersResponse.data);
        setAlbum(albumResponse.data);
        setRankedSongsByTier(initialRankedSongs);
        setUnrankedSongs(initialUnrankedSongs);
      } catch (err) {
        console.error('Error fetching album data:', err);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    if (albumId) {
      fetchAlbumData();
    }
  }, [albumId]);

  return { tiers, album, rankedSongsByTier, unrankedSongs, setRankedSongsByTier, setUnrankedSongs, error };
};

export default useAlbumData;