// frontend/src/components/HomePage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPaleColor } from '../utils/colorUtils';
import '../HomePage.css';
import useHomePageData from '../hooks/useHomePageData';

function HomePage() {
  const navigate = useNavigate();
  const { albumSummaries, awards, error } = useHomePageData();
  const name = localStorage.getItem('name');
  const possessive_name = name.endsWith('s') ? `${name}'` : `${name}'s`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/login');
  };

  if (error) {
    return <div className="home-error">{error}</div>;
  } else if (albumSummaries.length === 0) {
    return <div className="home-loading">Loading user data...</div>;
  }

  return (
    <div className="background-container">
      <div className="topbar">
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <h1 className="home-title">{possessive_name} Swiftie Analysis</h1>
      </div> 
      <div className="home-page-container">     
        <div className="info-container">
          <div className="info-section">
            <h2>Instructions 👀</h2>
            <p>Click on an album name to rank its songs. There are an even number of tiers to prevent neutrality. The score and weighted score are calculated based on the number and percentage of songs in each tier, respectively. Bonus and vault tracks are included. Rerecordeds are not counted separately from originals. Happy ranking!</p>
          </div>
          <div className="info-section">
            <h2>Awards 🏆</h2>
            {awards.length == 0 && (
              <p>Once you rank songs, your highest scoring album and honorary mentions will appear here!</p>
            )}
            <div className={awards.length > 3 ? 'awards-grid' : ''}>
              {awards.map(award => (
                <p key={award.title}><strong>{award.title}:</strong> {award.albums} ({award.metric})</p>
              ))}
            </div>
          </div>
        </div>
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
              <th>Weighted Score</th>
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
                <td>{summary.unranked_count + Object.values(summary.tier_breakdown).reduce((acc, {count}) => acc + count, 0)}</td>
                {Object.values(summary.tier_breakdown).map(({count}, index) => (
                  <td key={index}>{count}</td>
                ))}
                <td>{summary.unranked_count}</td>
                <td>{summary.score}%</td>
                <td>{summary.weighted_score}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomePage;