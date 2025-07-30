// frontend/src/tests/useDragAndDropRanking.test.js
import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import useDragAndDropRanking from '../hooks/useDragAndDropRanking';

jest.mock('axios');
process.env.REACT_APP_API_URL = 'http://localhost:3001/api/v1';

describe('useDragAndDropRanking', () => {
  let songsById;
  let rankedSongsByTier;
  let unrankedSongs;
  let setRankedSongsByTier;
  let setUnrankedSongs;
  let metadata;

  beforeEach(() => {
    axios.post.mockReset();
    axios.patch.mockReset();
    axios.delete.mockReset();

    songsById = {
      101: { id: 101, title: 'Song A' },
      102: { id: 102, title: 'Song B' },
    };
    rankedSongsByTier = { 1: [], 2: [] };
    unrankedSongs = [{ id: 101, title: 'Song A' }, { id: 102, title: 'Song B' }];
    setRankedSongsByTier = jest.fn();
    setUnrankedSongs = jest.fn();
    metadata = { headers: { Authorization: 'Bearer test_token' } };
  });

  test('moves song within unranked list', () => {
    const { result } = renderHook(() =>
      useDragAndDropRanking(
        songsById,
        rankedSongsByTier,
        unrankedSongs,
        setRankedSongsByTier,
        setUnrankedSongs,
        metadata
      )
    );

    const onDragEnd = result.current;

    const dndResult = {
      source: { droppableId: 'unranked', index: 0 },
      destination: { droppableId: 'unranked', index: 1 },
      draggableId: '101',
    };

    act(() => {
      onDragEnd(dndResult);
    });

    expect(setUnrankedSongs).toHaveBeenCalledWith([
      { id: 102, title: 'Song B' },
      { id: 101, title: 'Song A' },
    ]);
    expect(setRankedSongsByTier).not.toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
    expect(axios.patch).not.toHaveBeenCalled();
    expect(axios.delete).not.toHaveBeenCalled();
  });

  test('moves song from unranked to ranked tier (creates ranking)', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 2001, song_id: 101, tier_id: 1 } });

    const { result } = renderHook(() =>
      useDragAndDropRanking(
        songsById,
        rankedSongsByTier,
        unrankedSongs,
        setRankedSongsByTier,
        setUnrankedSongs,
        metadata
      )
    );

    const onDragEnd = result.current;

    const dndResult = {
      source: { droppableId: 'unranked', index: 0 },
      destination: { droppableId: '1', index: 0 },
      draggableId: '101',
    };

    await act(async () => {
      await onDragEnd(dndResult);
    });

    expect(setUnrankedSongs).toHaveBeenCalledWith([{ id: 102, title: 'Song B' }]);
    expect(setRankedSongsByTier).toHaveBeenCalledWith({
      1: [{ id: 101, title: 'Song A', rankingId: 2001 }],
      2: [],
    });
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/rankings`,
      { ranking: { song_id: 101, tier_id: 1, user_id: 1 } },
      metadata
    );
    expect(axios.patch).not.toHaveBeenCalled();
    expect(axios.delete).not.toHaveBeenCalled();
  });

  test('moves song between ranked tiers (updates ranking)', async () => {
    rankedSongsByTier = { 1: [{ id: 101, title: 'Song A', rankingId: 2001 }], 2: [] };
    unrankedSongs = [{ id: 102, title: 'Song B' }];

    const { result } = renderHook(() =>
      useDragAndDropRanking(
        songsById,
        rankedSongsByTier,
        unrankedSongs,
        setRankedSongsByTier,
        setUnrankedSongs,
        metadata
      )
    );

    const onDragEnd = result.current;

    const dndResult = {
      source: { droppableId: '1', index: 0 },
      destination: { droppableId: '2', index: 0 },
      draggableId: '101',
    };

    await act(async () => {
      await onDragEnd(dndResult);
    });

    expect(setUnrankedSongs).not.toHaveBeenCalled();
    expect(setRankedSongsByTier).toHaveBeenCalledWith({
      1: [],
      2: [{ id: 101, title: 'Song A', rankingId: 2001 }],
    });
    expect(axios.patch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/rankings/2001`,
      { ranking: { tier_id: 2, user_id: 1 } },
      metadata
    );
    expect(axios.post).not.toHaveBeenCalled();
    expect(axios.delete).not.toHaveBeenCalled();
  });

  test('moves song from ranked to unranked (deletes ranking)', async () => {
    rankedSongsByTier = { 1: [{ id: 101, title: 'Song A', rankingId: 2001 }], 2: [] };
    unrankedSongs = [{ id: 102, title: 'Song B' }];

    const { result } = renderHook(() =>
      useDragAndDropRanking(
        songsById,
        rankedSongsByTier,
        unrankedSongs,
        setRankedSongsByTier,
        setUnrankedSongs,
        metadata
      )
    );

    const onDragEnd = result.current;

    const dndResult = {
      source: { droppableId: '1', index: 0 },
      destination: { droppableId: 'unranked', index: 0 },
      draggableId: '101',
    };

    await act(async () => {
      await onDragEnd(dndResult);
    });

    expect(setUnrankedSongs).toHaveBeenCalledWith([
      { id: 101, title: 'Song A', rankingId: 2001 },
      { id: 102, title: 'Song B' },
    ]);
    expect(setRankedSongsByTier).toHaveBeenCalledWith({ 1: [], 2: [] });
    expect(axios.delete).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/rankings/2001`,
      metadata
    );
    expect(axios.post).not.toHaveBeenCalled();
    expect(axios.patch).not.toHaveBeenCalled();
  });
});