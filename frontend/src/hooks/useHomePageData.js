import { useState, useEffect } from 'react';
import axios from 'axios';
import { getMetadata } from '../utils/apiUtils';

const useHomePageData = () => {
  const metadata = getMetadata();
  const [albumSummaries, setAlbumSummaries] = useState([]);
  const [minTierId, setMinTierId] = useState(null);
  const [maxTierId, setMaxTierId] = useState(null);
  const [awards, setAwards] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumSummaries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your Swiftie analysis.');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/me/album_summaries`, metadata);
        setAlbumSummaries(response.data);
        calculateAwards(response.data);
      } catch (err) {
        console.error('Error fetching album summaries:', err.response || err);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchAlbumSummaries();
  }, []);

  const calculateAwards = (albumSummariesData) => {
    let highestScoreAlbum = null;
    let mostMinTierAlbum = null;
    let leastMaxTierAlbum = null;
    let highestScore = -1;
    let highestMinTierPercentage = -1;
    let lowestMaxTierPercentage = 101;  

    const tiers = Object.keys(albumSummariesData[0].tier_breakdown);
    const minTierId = Math.min(...tiers);
    const maxTierId = Math.max(...tiers);
    setMinTierId(minTierId);
    setMaxTierId(maxTierId);

    albumSummariesData.forEach(album => {
      const score = album.score;
      const minTierPercentage = album.tier_breakdown[minTierId].percentage;
      const maxTierPercentage = album.tier_breakdown[maxTierId].percentage;

      if (score > highestScore) {
        highestScore = score;
        highestScoreAlbum = album;
      }
      if (minTierPercentage > highestMinTierPercentage) {
        highestMinTierPercentage = minTierPercentage;
        mostMinTierAlbum = album;
      }
      if (maxTierPercentage < lowestMaxTierPercentage) {
        lowestMaxTierPercentage = maxTierPercentage;
        leastMaxTierAlbum = album;
      }
    });

    setAwards({
      highestScoreAlbum,
      mostMinTierAlbum,
      leastMaxTierAlbum,
    });
  };

  return { albumSummaries, minTierId, maxTierId, awards, error };
};

export default useHomePageData;