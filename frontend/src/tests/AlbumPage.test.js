// frontend/src/tests/AlbumPage.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import AlbumPage from '../components/AlbumPage';

jest.mock('axios');

process.env.REACT_APP_API_BASE_URL = 'http://localhost:3001/api/v1';

describe('AlbumPage', () => {
  beforeEach(() => {
    axios.get.mockReset();
    axios.post.mockReset();
    axios.delete.mockReset();
    axios.patch.mockReset();

    axios.get.mockImplementation((url) => {
      if (url.includes('/tiers')) {
        return Promise.resolve({ data: [{ id: 1, name: 'S-Tier' }, { id: 2, name: 'A-Tier' }] });
      } else if (url.includes('/albums/1/songs')) {
        return Promise.resolve({ data: [{ id: 101, title: 'Song A' }, { id: 102, title: 'Song B' }] });
      } else if (url.includes('/albums/1/rankings')) {
        return Promise.resolve({ data: [] }); // No initial rankings
      } else if (url.includes('/albums/1')) {
        return Promise.resolve({ data: { id: 1, title: 'Test Album', color: 'blue' } });
      }
      return Promise.reject(new Error('not found'));
    });
  });

  test('renders album title and unranked songs', async () => {
    render(
      <Router>
        <AlbumPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Album')).toBeInTheDocument();
    });

    expect(screen.getByText('Unranked Songs')).toBeInTheDocument();
    expect(screen.getByText('Song A')).toBeInTheDocument();
    expect(screen.getByText('Song B')).toBeInTheDocument();
  });
});