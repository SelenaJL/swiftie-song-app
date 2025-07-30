import { useState, useEffect } from 'react';
import axios from 'axios';
import { getMetadata } from '../utils/apiUtils';

const useHomePageData = () => {
  const metadata = getMetadata();
  const [albumSummaries, setAlbumSummaries] = useState([]);
  const [awards, setAwards] = useState({});
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAlbumSummaries = async () => {
      try {
        const albumSummariesResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/me/album_summaries`, metadata);
        setAlbumSummaries(albumSummariesResponse.data);
        calculateAwards(albumSummariesResponse.data);

        // Mpve to another function???
        const csrfResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/csrf-token`, metadata);
        setCsrfToken(csrfResponse.data.csrf_token);
      } catch (err) {
        console.error('Error fetching album summaries:', err.response || err);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchAlbumSummaries();
  }, []);

  const calculateAwards = (albumSummariesData) => {
    // Assume tier ID corresponds to hierarchy.
    const tiers = Object.keys(albumSummariesData[0].tier_breakdown);
    const minTierId = Math.min(...tiers);
    const maxTierId = Math.max(...tiers);

    let awards = [
      {title: "Highest Score", current: null, record: null, winners: [], max: true, percent: true},
      {title: "Highest Weighted Score", current: null, record: null, winners: [], max: true, percent: true},
      {title: "Most Tier " + minTierId + " Songs", current: null, record: null, winners: [], max: true, percent: false},
      {title: "Highest % of Tier " + minTierId + " Songs", current: null, record: null, winners: [], max: true, percent: true},
      {title: "Least Tier " + maxTierId + " Songs", current: null, record: null, winners: [], max: false, percent: false},
      {title: "Lowest % of Tier " + maxTierId + " Songs", current: null, record: null, winners: [], max: false, percent: true},
    ];

    albumSummariesData.forEach(album => {
      awards[0].current = album.score;
      awards[1].current = album.weighted_score;
      awards[2].current = album.tier_breakdown[minTierId].count;
      awards[3].current = album.tier_breakdown[minTierId].percent;
      awards[4].current = album.tier_breakdown[maxTierId].count;
      awards[5].current = album.tier_breakdown[maxTierId].percent;

      awards.forEach(award => {
        if (award.record == null || (award.max && award.current > award.record) || (!award.max && award.current < award.record)) {
          award.record = award.current;
          award.winners = [album.album_title];
        } else if (award.current === award.record) {
          award.winners.push(album.album_title);
        }
      });
    });

    awards = awards.map(award => {
      if (award.winners.length > 0) {
        return {
          title: award.title,
          albums: award.winners.join(' '),
          metric: award.percent ? `${award.record}%` : award.record,
        };
      }
      return null;
    }).filter(award => award !== null);
    setAwards(awards);
  };

  return { albumSummaries, awards, csrfToken, error };
};

export default useHomePageData;