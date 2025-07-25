// frontend/src/tests/SongCard.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import SongCard from '../components/SongCard';

describe('SongCard', () => {
  test('renders song without feature', () => {
    const song = { title: 'Test Song' };
    render(<SongCard song={song} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.queryByText(/Feat./)).not.toBeInTheDocument();
  });

  test('renders song with feature', () => {
    const song = { title: 'Test Song', feature: 'Artist A' };
    render(<SongCard song={song} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Feat. Artist A')).toBeInTheDocument();
  });
});