import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AlbumPage from './components/AlbumPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/" element={<div>Welcome to the Swiftie Song App!</div>} /> { /* TODO: Make HomePage */ }
        </Routes>
      </div>
    </Router>
  );
}

export default App;