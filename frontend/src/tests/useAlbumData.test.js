// frontend/src/tests/useAlbumData.test.js
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import useAlbumData from '../hooks/useAlbumData';

jest.mock('axios');
process.env.REACT_APP_API_BASE_URL = 'http://localhost:3001/api/v1';

describe('useAlbumData', () => {
  beforeEach(() => {
    axios.get.mockReset();
    axios.get.mockImplementation((url) => {
      if (url.includes('/tiers')) {
        return Promise.resolve({ data: [{ id: 1, name: 'S-Tier' }, { id: 2, name: 'A-Tier' }] });
      } else if (url.includes('/albums/1/songs')) {
        return Promise.resolve({ data: [{ id: 101, title: 'Song A' }, { id: 102, title: 'Song B' }] });
      } else if (url.includes('/albums/1/rankings')) {
        return Promise.resolve({ data: [] });
      } else if (url.includes('/albums/1')) {
        return Promise.resolve({ data: { id: 1, title: 'Test Album', color: 'blue' } });
      }
      return Promise.reject(new Error('not found'));
    });
  });

  test('fetches and sets initial data correctly', async () => {
    const { result } = renderHook(() => useAlbumData(1));

    await waitFor(() => expect(result.current.album).not.toBeNull());

    expect(result.current.album).toEqual({ id: 1, title: 'Test Album', color: 'blue' });
    expect(result.current.tiers).toEqual([{ id: 1, name: 'S-Tier' }, { id: 2, name: 'A-Tier' }]);
    expect(Object.keys(result.current.songsById).length).toBe(2);
    expect(result.current.unrankedSongs.length).toBe(2);
    expect(Object.values(result.current.rankedSongsByTier).flat().length).toBe(0);
  });

  test('correctly categorizes ranked and unranked songs', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/albums/1/rankings')) {
        return Promise.resolve({ data: [{ id: 1001, song_id: 101, tier_id: 1 }] });
      }
      // Use default mocks for other endpoints
      return jest.requireActual('axios').get(url);
    });

    const { result } = renderHook(() => useAlbumData(1));

    await waitFor(() => expect(result.current.album).not.toBeNull());

    expect(result.current.unrankedSongs.length).toBe(1);
    expect(result.current.unrankedSongs[0].id).toBe(102);
    expect(result.current.rankedSongsByTier[1].length).toBe(1);
    expect(result.current.rankedSongsByTier[1][0].id).toBe(101);
    expect(result.current.rankedSongsByTier[1][0].rankingId).toBe(1001);
  });
});