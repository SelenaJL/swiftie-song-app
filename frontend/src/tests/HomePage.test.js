import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import HomePage from '../components/HomePage';
import useHomePageData from '../hooks/useHomePageData';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../hooks/useHomePageData');

const mockAlbums = [
  { id: 1, title: 'Taylor Swift' },
  { id: 2, title: 'Fearless' },
];

describe('HomePage', () => {
  const navigate = jest.fn();
  beforeEach(() => {
    useNavigate.mockReturnValue(navigate);
    localStorage.setItem('name', 'test');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders loading state initially', () => {
    useHomePageData.mockReturnValue({ albums: [], loading: true, error: null });
    render(<HomePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message on error', () => {
    useHomePageData.mockReturnValue({ albums: [], loading: false, error: 'Error fetching albums' });
    render(<HomePage />);
    expect(screen.getByText('Error: Error fetching albums')).toBeInTheDocument();
  });

  it('renders albums when data is fetched', () => {
    useHomePageData.mockReturnValue({ albums: mockAlbums, loading: false, error: null });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Taylor Swift')).toBeInTheDocument();
    expect(screen.getByText('Fearless')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('logs out the user when the logout button is clicked', () => {
    useHomePageData.mockReturnValue({ albums: mockAlbums, loading: false, error: null });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('name')).toBeNull();
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});