// frontend/src/hooks/useDragAndDropRanking.js
import { useCallback } from 'react';
import { getMetadata } from '../utils/apiUtils';
import axios from 'axios';

const useDragAndDropRanking = (currentRankedSongsByTier, currentUnrankedSongs, setRankedSongsByTier, setUnrankedSongs) => {
  const metadata = getMetadata();

  const onDragEnd = useCallback(async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    // Create a deep copy of local state to avoid direct mutation
    const newUnrankedSongs = Array.from(currentUnrankedSongs);
    const newRankedSongsByTier = JSON.parse(JSON.stringify(currentRankedSongsByTier));

    // Remove song from source
    let removed;
    if (source.droppableId === "unranked") {
      [removed] = newUnrankedSongs.splice(source.index, 1);
    } else {
      [removed] = newRankedSongsByTier[source.droppableId].splice(source.index, 1);
    }

    // Add song to destination and update local state
    if (destination.droppableId === "unranked") {
      newUnrankedSongs.splice(destination.index, 0, removed);
      if (removed.rankingId) { // If moved from ranked to unranked, delete old ranking
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/rankings/${removed.rankingId}`, metadata);
          console.log('Ranking deleted successfully!');
          removed.rankingId = null;
        } catch (error) {
          console.error('Error deleting ranking:', error);
        }
      }
    } else {
      const targetTierId = parseInt(destination.droppableId);
      newRankedSongsByTier[targetTierId].splice(destination.index, 0, removed);
      if (!removed.rankingId) { // If moved from unranked to ranked, create new ranking
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/rankings`, {
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
          const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/v1/rankings/${removed.rankingId}`, {
            ranking: {
              tier_id: targetTierId,
            }
          }, metadata);
          console.log('Ranking updated successfully!');
          removed.rankingId = response.data.id;
        } catch (error) {
          console.error('Error updating ranking:', error);
        }
      }
    }

    setUnrankedSongs(newUnrankedSongs);
    setRankedSongsByTier(newRankedSongsByTier);
  }, [currentRankedSongsByTier, currentUnrankedSongs, setRankedSongsByTier, setUnrankedSongs]);

  return onDragEnd;
};

export default useDragAndDropRanking;