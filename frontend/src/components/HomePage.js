// frontend/src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getMetadata } from '../utils/apiUtils';
import { getPaleColor } from '../utils/colorUtils';
import '../HomePage.css';

function HomePage() {
  const metadata = getMetadata();
  const [albumSummaries, setAlbumSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumSummaries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view album summaries.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/me/album_summaries`, metadata);
        setAlbumSummaries(response.data);
      } catch (err) {
        console.error('Error fetching album summaries:', err.response || err);
        setError('Failed to fetch album summaries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumSummaries();
  }, []);

  if (loading) {
    return <div className="home-loading">Loading album data...</div>;
  }

  if (error) {
    return <div className="home-error">{error}</div>;
  }

  const name = localStorage.getItem('name');
  const possessive_name = name.endsWith('s') ? `${name}'` : `${name}'s`;

  return (
    <div className="home-page-container">
      <h1 className="home-title">{possessive_name} Swiftie Analysis</h1>
      <table className="album-summary-table">
        <thead>
          <tr>
            <th>Album</th>
            <th>Total Songs</th>
            {albumSummaries[0] && Object.keys(albumSummaries[0].tier_breakdown).map(tierId => (
              <th key={tierId}>Songs in Tier {tierId}</th>
            ))}
            <th>Unranked Songs</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {albumSummaries.map(summary => (
            <tr key={summary.album_id} style={{ backgroundColor: getPaleColor(summary.album_color) }}>
              <td>
                <Link to={`/albums/${summary.album_id}`}>
                  {summary.album_title}
                </Link>
              </td>
              <td>{summary.unranked_count + Object.values(summary.tier_breakdown).reduce((acc, count) => acc + count, 0)}</td>
              {Object.values(summary.tier_breakdown).map((count, index) => (
                <td key={index}>{count}</td>
              ))}
              <td>{summary.unranked_count}</td>
              <td>{summary.score}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomePage;