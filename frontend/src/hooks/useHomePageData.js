import { useState, useEffect } from 'react';
import axios from 'axios';
import { getMetadata } from '../utils/apiUtils';

const useHomePageData = () => {
  const metadata = getMetadata();
  const [albumSummaries, setAlbumSummaries] = useState([]);
  const [awards, setAwards] = useState({});
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAlbumSummaries = async () => {
      try {
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
    let highestWeightedScoreAlbum = null;
    let highestMinTierCountAlbum = null;
    let highestMinTierPercentAlbum = null;
    let lowestMaxTierCountAlbum = null;
    let lowestMaxTierPercentAlbum = null;
    let highestScore = -1;
    let highestWeightedScore = -1;
    let highestMinTierCount = -1;
    let highestMinTierPercent = -1;
    let lowestMaxTierCount = 101;
    let lowestMaxTierPercent = 101;

    const tiers = Object.keys(albumSummariesData[0].tier_breakdown);
    const minTierId = Math.min(...tiers);
    const maxTierId = Math.max(...tiers);

    albumSummariesData.forEach(album => {
      const score = album.score;
      const weightedScore = album.weighted_score;
      const minTierCount = album.tier_breakdown[minTierId].count;
      const maxTierCount = album.tier_breakdown[maxTierId].count;
      const minTierPercent = album.tier_breakdown[minTierId].percent;
      const maxTierPercent = album.tier_breakdown[maxTierId].percent;

      if (score > highestScore) {
        highestScore = score;
        highestScoreAlbum = album;
      }
      if (weightedScore > highestWeightedScore) {
        highestWeightedScore = weightedScore;
        highestWeightedScoreAlbum = album;
      }
      if (minTierCount > highestMinTierCount) {
        highestMinTierCount = minTierCount;
        highestMinTierCountAlbum = album;
      }
      if (maxTierCount < lowestMaxTierCount) {
        lowestMaxTierCount = maxTierCount;
        lowestMaxTierCountAlbum = album;
      }
      if (minTierPercent > highestMinTierPercent) {
        highestMinTierPercent = minTierPercent;
        highestMinTierPercentAlbum = album;
      }
      if (maxTierPercent < lowestMaxTierPercent) {
        lowestMaxTierPercent = maxTierPercent;
        lowestMaxTierPercentAlbum = album;
      }
    });

    let awards = [];

    if (highestScoreAlbum) {
      awards.push({
        title: 'Highest Score',
        album: highestScoreAlbum.album_title,
        metric: `${highestScore}%`,
      });
    }
    if (highestWeightedScoreAlbum) {
      awards.push({
        title: 'Highest Weighted Score',
        album: highestWeightedScoreAlbum.album_title,
        metric: `${highestWeightedScore}%`,
      });
    }
    if (highestMinTierCountAlbum) {
      awards.push({
        title: 'Most Tier ' + minTierId + ' Songs',
        album: highestMinTierCountAlbum.album_title,
        metric: highestMinTierCount,
      });
    }
    if (highestMinTierPercentAlbum) {
      awards.push({
        title: 'Highest % of Tier ' + minTierId + ' Songs',
        album: highestMinTierPercentAlbum.album_title,
        metric: `${highestMinTierPercent}%`,
      });
    }
    if (lowestMaxTierCountAlbum) {
      awards.push({
        title: 'Least Tier ' + maxTierId + ' Songs',
        album: lowestMaxTierCountAlbum.album_title,
        metric: lowestMaxTierCount,
      });
    }
    if (lowestMaxTierPercentAlbum) {
      awards.push({
        title: 'Lowest % of Tier ' + maxTierId + ' Songs',
        album: lowestMaxTierPercentAlbum.album_title,
        metric: `${lowestMaxTierPercent}%`,
      });
    }

    setAwards(awards);
  };

  return { albumSummaries, awards, error };
};

export default useHomePageData;