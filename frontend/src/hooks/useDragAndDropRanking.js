// frontend/src/hooks/useDragAndDropRanking.js
import { useCallback } from 'react';
import axios from 'axios';

const useDragAndDropRanking = (songsById, currentRankedSongsByTier, currentUnrankedSongs, setRankedSongsByTier, setUnrankedSongs) => {
  const metadata = {
    headers: {
      Authorization: `PLACEHOLDER` // TODO: Replace with logged in user's JWT.
    }
  };
  
  const onDragEnd = useCallback(async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    const draggedSong = songsById[parseInt(draggableId)];
    if (!draggedSong) return; // Should not happen if songsById is correct

    // Deep copy of state to avoid direct mutation
    const newUnrankedSongs = Array.from(currentUnrankedSongs);
    const newRankedSongsByTier = JSON.parse(JSON.stringify(currentRankedSongsByTier));

    // Remove song from source
    let removed;
    if (source.droppableId === "unranked") {
      [removed] = newUnrankedSongs.splice(source.index, 1);
    } else {
      [removed] = newRankedSongsByTier[source.droppableId].splice(source.index, 1);
    }

    // Add song to destination
    if (destination.droppableId === "unranked") {
      newUnrankedSongs.splice(destination.index, 0, removed);
      // If moved from ranked to unranked, delete old ranking
      if (removed.rankingId) {
        try {
          await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/rankings/${removed.rankingId}`, metadata);
          console.log('Ranking deleted successfully!');
        } catch (error) {
          console.error('Error deleting ranking:', error);
        }
      }
    } else {
      const targetTierId = parseInt(destination.droppableId);
      newRankedSongsByTier[targetTierId].splice(destination.index, 0, removed);
      // If moved from unranked to ranked, create new ranking
      if (!removed.rankingId) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/rankings`, {
            ranking: {
              song_id: parseInt(draggableId),
              tier_id: targetTierId,
            }
          }, metadata);
          console.log('Ranking created successfully!', response.data);
          removed.rankingId = response.data.id;
        } catch (error) {
          console.error('Error creating ranking:', error);
        }
      } else { // If moved between ranked tiers, update existing ranking
        try {
          await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/rankings/${removed.rankingId}`, {
            ranking: {
              tier_id: targetTierId,
            }
          }, metadata);
          console.log('Ranking updated successfully!');
        } catch (error) {
          console.error('Error updating ranking:', error);
        }
      }
    }

    setUnrankedSongs(newUnrankedSongs);
    setRankedSongsByTier(newRankedSongsByTier);
  }, [songsById, currentRankedSongsByTier, currentUnrankedSongs, setRankedSongsByTier, setUnrankedSongs]);

  return onDragEnd;
};

export default useDragAndDropRanking;