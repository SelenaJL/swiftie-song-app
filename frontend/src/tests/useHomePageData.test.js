// frontend/src/tests/useHomePageData.test.js
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import useHomePageData from '../hooks/useHomePageData';

jest.mock('axios');

const mockAlbumSummaries = [
  {
    album_id: 1,
    album_title: 'Album A',
    album_color: '#ff0000',
    score: 80,
    weighted_score: 85,
    unranked_count: 0,
    tier_breakdown: {
      1: { count: 10, percent: 50 },
      2: { count: 5, percent: 25 },
      3: { count: 5, percent: 25 },
    },
  },
  {
    album_id: 2,
    album_title: 'Album B',
    album_color: '#00ff00',
    score: 90,
    weighted_score: 95,
    unranked_count: 0,
    tier_breakdown: {
      1: { count: 15, percent: 75 },
      2: { count: 5, percent: 25 },
      3: { count: 0, percent: 0 },
    },
  },
];

const mockSingleWinnerData = [
  {
    album_id: 1,
    album_title: 'Album A',
    album_color: '#ff0000',
    score: 80,
    weighted_score: 85,
    unranked_count: 0,
    tier_breakdown: {
      1: { count: 10, percent: 50 },
      2: { count: 5, percent: 25 },
      3: { count: 5, percent: 25 },
    },
  },
];

const mockMultipleWinnersData = [
  {
    album_id: 1,
    album_title: 'Album A',
    album_color: '#ff0000',
    score: 90,
    weighted_score: 95,
    unranked_count: 0,
    tier_breakdown: {
      1: { count: 15, percent: 75 },
      2: { count: 5, percent: 25 },
      3: { count: 0, percent: 0 },
    },
  },
  {
    album_id: 2,
    album_title: 'Album B',
    album_color: '#00ff00',
    score: 90,
    weighted_score: 95,
    unranked_count: 0,
    tier_breakdown: {
      1: { count: 15, percent: 75 },
      2: { count: 5, percent: 25 },
      3: { count: 0, percent: 0 },
    },
  },
];

describe('useHomePageData', () => {
  beforeEach(() => {
    axios.get.mockClear();
  });

  it('fetches album summaries and calculates awards successfully', async () => {
    axios.get.mockResolvedValue({ data: mockAlbumSummaries });
    const { result } = renderHook(() => useHomePageData());

    await waitFor(() => {
      expect(result.current.albumSummaries).toEqual(mockAlbumSummaries);
      expect(result.current.awards.length).toBeGreaterThan(0);
      expect(result.current.error).toBeNull();
    });
  });

  it('handles errors when fetching album summaries', async () => {
    const errorMessage = 'Failed to fetch data. Please try again later.';
    axios.get.mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useHomePageData());

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.albumSummaries).toEqual([]);
      expect(result.current.awards).toEqual({});
    });
  });

  it('calculates awards with a single winner', async () => {
    axios.get.mockResolvedValue({ data: mockSingleWinnerData });
    const { result } = renderHook(() => useHomePageData());

    await waitFor(() => {
      expect(result.current.awards.length).toBe(6);
      result.current.awards.forEach(award => {
        expect(award.albums).toBe('Album A');
      });
    });
  });

  it('calculates awards with multiple winners', async () => {
    axios.get.mockResolvedValue({ data: mockMultipleWinnersData });
    const { result } = renderHook(() => useHomePageData());

    await waitFor(() => {
      expect(result.current.awards.length).toBe(6);
      result.current.awards.forEach(award => {
        expect(award.albums).toBe('Album A Album B');
      });
    });
  });

  it('handles no album data and produces no awards', async () => {
    axios.get.mockResolvedValue({ data: [] });
    const { result } = renderHook(() => useHomePageData());

    await waitFor(() => {
      expect(result.current.albumSummaries).toEqual([]);
      expect(result.current.awards).toEqual({});
    });
  });
});
