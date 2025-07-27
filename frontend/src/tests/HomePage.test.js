// frontend/src/tests/HomePage.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomePage from '../components/HomePage';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const localStorageMock = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

process.env.REACT_APP_API_BASE_URL = 'http://localhost:3001/api/v1';

describe('HomePage', () => {
  beforeEach(() => {
    axios.get.mockReset();
    localStorageMock.getItem.mockReset();
  });

  test('renders loading state initially', () => {
    localStorageMock.getItem.mockReturnValue('mock_token');
    axios.get.mockImplementation(() => new Promise(() => {})); // Pending promise to keep it loading
    render(
      <Router>
        <HomePage />
      </Router>
    );
    expect(screen.getByText(/Loading album summaries.../i)).toBeInTheDocument();
  });

  test('renders album summaries table on successful fetch', async () => {
    localStorageMock.getItem.mockReturnValue('mock_token');
    axios.get.mockResolvedValueOnce({
      data: [
        {
          album_id: 1,
          album_title: 'Test Album 1',
          album_color: 'blue',
          score: 10,
          tier_breakdown: { 'Mastermind': 2, 'Gorgeous': 1 },
          unranked_count: 5,
        },
        {
          album_id: 2,
          album_title: 'Test Album 2',
          album_color: 'red',
          score: 5,
          tier_breakdown: { 'Nothing New': 1 },
          unranked_count: 10,
        },
      ],
    });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('My Swiftie Song Analysis')).toBeInTheDocument();
    });

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Test Album 1')).toBeInTheDocument();
    expect(screen.getByText('Test Album 2')).toBeInTheDocument();
    expect(screen.getByText('Mastermind')).toBeInTheDocument();
    expect(screen.getByText('Gorgeous')).toBeInTheDocument();
    expect(screen.getByText('Nothing New')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Score for Album 1
    expect(screen.getByText('5')).toBeInTheDocument();  // Score for Album 2
    expect(screen.getByText('5')).toBeInTheDocument();  // Unranked for Album 1
    expect(screen.getByText('10')).toBeInTheDocument(); // Unranked for Album 2
  });

  test('renders no rankings message if no summaries', async () => {
    localStorageMock.getItem.mockReturnValue('mock_token');
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/No rankings yet. Start ranking songs on an album page!/i)).toBeInTheDocument();
    });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('renders error message on fetch failure', async () => {
    localStorageMock.getItem.mockReturnValue('mock_token');
    axios.get.mockRejectedValueOnce({ response: { data: { error: 'Network error' } } });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch album summaries. Please try again later./i)).toBeInTheDocument();
    });
  });

  test('renders login message if no token', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <Router>
        <HomePage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Please log in to view album summaries./i)).toBeInTheDocument();
    });
  });

  test('logs out user when logout button is clicked', async () => {
    localStorageMock.getItem.mockReturnValue('mock_token');
    localStorageMock.getItem.mockReturnValueOnce('Test User');
    axios.get.mockResolvedValueOnce({ data: [] });

    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);

    render(
      <Router>
        <HomePage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/No rankings yet. Start ranking songs on an album page!/i)).toBeInTheDocument();
    });

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('name');
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});