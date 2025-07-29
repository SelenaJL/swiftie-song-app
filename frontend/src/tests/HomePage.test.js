'''// frontend/src/tests/HomePage.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from '../components/HomePage';
import useHomePageData from '../hooks/useHomePageData';

jest.mock('../hooks/useHomePageData');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockAlbumSummaries = [
  {
    album_id: 1,
    album_title: 'Album A',
    album_color: '#ff0000',
    score: 80,
    weighted_score: 85,
    unranked_count: 5,
    tier_breakdown: {
      1: { count: 10, percent: 50 },
      2: { count: 5, percent: 25 },
    },
  },
];

const mockAwards = [
  { title: 'Highest Score', albums: 'Album A', metric: '80%' },
  { title: 'Highest Weighted Score', albums: 'Album A', metric: '85%' },
];

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    useHomePageData.mockReturnValue({ albumSummaries: [], awards: [], error: null });
    localStorage.setItem('name', 'Tester');
    render(<Router><HomePage /></Router>);
    expect(screen.getByText('Loading user data...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    useHomePageData.mockReturnValue({ albumSummaries: [], awards: [], error: 'Failed to fetch' });
    localStorage.setItem('name', 'Tester');
    render(<Router><HomePage /></Router>);
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  it('handles logout functionality', () => {
    useHomePageData.mockReturnValue({ albumSummaries: mockAlbumSummaries, awards: [], error: null });
    localStorage.setItem('name', 'Tester');
    localStorage.setItem('token', 'fake-token');
    render(<Router><HomePage /></Router>);

    fireEvent.click(screen.getByText('Logout'));

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('name')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders possessive name correctly for names ending in s', () => {
    useHomePageData.mockReturnValue({ albumSummaries: mockAlbumSummaries, awards: [], error: null });
    localStorage.setItem('name', 'Chris');
    render(<Router><HomePage /></Router>);
    expect(screen.getByText("Chris' Swiftie Analysis")).toBeInTheDocument();
  });

  it('renders possessive name correctly for names not ending in s', () => {
    useHomePageData.mockReturnValue({ albumSummaries: mockAlbumSummaries, awards: [], error: null });
    localStorage.setItem('name', 'Selena');
    render(<Router><HomePage /></Router>);
    expect(screen.getByText("Selena's Swiftie Analysis")).toBeInTheDocument();
  });

  it('renders message when there are no awards', () => {
    useHomePageData.mockReturnValue({ albumSummaries: mockAlbumSummaries, awards: [], error: null });
    localStorage.setItem('name', 'Tester');
    render(<Router><HomePage /></Router>);
    expect(screen.getByText('Once you rank songs, your highest scoring album and honorary mentions will appear here!')).toBeInTheDocument();
  });

  it('renders awards when available', () => {
    useHomePageData.mockReturnValue({ albumSummaries: mockAlbumSummaries, awards: mockAwards, error: null });
    localStorage.setItem('name', 'Tester');
    render(<Router><HomePage /></Router>);
    expect(screen.getByText('Highest Score:')).toBeInTheDocument();
    expect(screen.getByText('Album A (80%)')).toBeInTheDocument();
  });

  it('renders the album summary table correctly', () => {
    useHomePageData.mockReturnValue({ albumSummaries: mockAlbumSummaries, awards: [], error: null });
    localStorage.setItem('name', 'Tester');
    render(<Router><HomePage /></Router>);

    expect(screen.getByText('Album')).toBeInTheDocument();
    expect(screen.getByText('Total Songs')).toBeInTheDocument();
    expect(screen.getByText('Songs in Tier 1')).toBeInTheDocument();
    expect(screen.getByText('Unranked Songs')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Weighted Score')).toBeInTheDocument();

    expect(screen.getByText('Album A')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument(); // total songs
    expect(screen.getByText('10')).toBeInTheDocument(); // tier 1 songs
    expect(screen.getByText('5')).toBeInTheDocument(); // unranked songs and tier 2 songs
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });
});
''