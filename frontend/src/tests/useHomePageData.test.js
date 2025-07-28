import { renderHook, act } from '@testing-library/react-hooks';
import useHomePageData from '../hooks/useHomePageData';
import { fetchAlbums } from '../utils/apiUtils';

jest.mock('../utils/apiUtils');

const mockAlbums = [
  { 
    id: 1, 
    title: 'Taylor Swift', 
    score: 80, 
    tier_breakdown: { 
      1: { percentage: 10 }, 
      2: { percentage: 90 } 
    } 
  },
  { 
    id: 2, 
    title: 'Fearless', 
    score: 90, 
    tier_breakdown: { 
      1: { percentage: 20 }, 
      2: { percentage: 80 } 
    } 
  },
];

describe('useHomePageData', () => {
  it('fetches albums successfully', async () => {
    fetchAlbums.mockResolvedValue(mockAlbums);

    const { result, waitForNextUpdate } = renderHook(() => useHomePageData());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(result.current.albums).toEqual(mockAlbums);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    const errorMessage = 'Error fetching albums';
    fetchAlbums.mockRejectedValue(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() => useHomePageData());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(result.current.albums).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('calculates awards correctly', async () => {
    fetchAlbums.mockResolvedValue(mockAlbums);

    const { result, waitForNextUpdate } = renderHook(() => useHomePageData());

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(result.current.awards.highestScoreAlbum.title).toBe('Fearless');
    expect(result.current.awards.mostMinTierAlbum.title).toBe('Fearless');
    expect(result.current.awards.leastMaxTierAlbum.title).toBe('Fearless');
  });
});