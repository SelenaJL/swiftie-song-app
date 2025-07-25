// frontend/src/hooks/useAlbumData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useAlbumData = (albumId) => {
  const [tiers, setTiers] = useState([]);
  const [album, setAlbum] = useState(null);
  const [songsById, setSongsById] = useState({});
  const [rankedSongsByTier, setRankedSongsByTier] = useState({});
  const [unrankedSongs, setUnrankedSongs] = useState([]);

  const metadata = {
    headers: {
      Authorization: `PLACEHOLDER` // TODO: Replace with logged in user's JWT.
    }
  };

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const tiersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tiers`);
        const albumResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/albums/${albumId}`);
        const songsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/albums/${albumId}/songs`);
        const rankingsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/albums/${albumId}/rankings`, metadata);

        const songs = songsResponse.data;
        const initialSongsById = songs.reduce((acc, song) => {
          acc[song.id] = song;
          return acc;
        }, {});
        const rankedSongIds = new Set();
        const initialRankedSongs = tiersResponse.data.reduce((acc, tier) => {
          acc[tier.id] = [];
          return acc;
        }, {});
        rankingsResponse.data.forEach(ranking => {
          const song = initialSongsById[ranking.song_id];
          if (song && initialRankedSongs[ranking.tier_id]) {
            initialRankedSongs[ranking.tier_id].push({ ...song, rankingId: ranking.id });
            rankedSongIds.add(ranking.song_id);
          }
        });
        const initialUnrankedSongs = songs.filter(song => !rankedSongIds.has(song.id));

        setTiers(tiersResponse.data);
        setAlbum(albumResponse.data);
        setSongsById(initialSongsById);
        setRankedSongsByTier(initialRankedSongs);
        setUnrankedSongs(initialUnrankedSongs);
      } catch (error) {
        console.error('Error fetching album data:', error);
      }
    };

    if (albumId) {
      fetchAlbumData();
    }
  }, [albumId]);

  return { tiers, album, songsById, rankedSongsByTier, unrankedSongs, setRankedSongsByTier, setUnrankedSongs };
};

export default useAlbumData;