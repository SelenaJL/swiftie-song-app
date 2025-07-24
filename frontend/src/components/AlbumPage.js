// src/components/AlbumPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SongCard from './SongCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useParams } from 'react-router-dom';
import { getPaleColor } from '../utils/colorUtils';
import '../AlbumPage.css';

function AlbumPage() {
  const { albumId } = useParams();
  const [tiers, setTiers] = useState([]);
  const [album, setAlbum] = useState(null);
  const [rankedSongsByTier, setRankedSongsByTier] = useState({});
  const [unrankedSongs, setUnrankedSongs] = useState([]);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const tiersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tiers`);
        const albumResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/albums/${albumId}`);
        const songsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/albums/${albumId}/songs`);
        const rankingsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/albums/${albumId}/rankings`, {
          headers: {
            Authorization: `PLACEHOLDER` // TODO: Replace with logged in user's JWT.
          }
        });

        setTiers(tiersResponse.data);
        setAlbum(albumResponse.data);

        const songs = songsResponse.data;
        const songsById = songs.reduce((acc, song) => {
          acc[song.id] = song;
          return acc;
        }, {})
        const tempRankedSongIds = new Set();
        const tempRankedSongsByTier = tiers.reduce((acc, tier) => {
          acc[tier] = new Set();
          return acc;
        }, {});

        rankingsResponse.data.forEach(ranking => {
          tempRankedSongIds.add(ranking.song_id);
          tempRankedSongsByTier[ranking.tier_id].add(songsById[ranking.song_id]);
        });

        const tempUnrankedSongs = songs.filter(song => !tempRankedSongIds.has(song.id));

        setRankedSongsByTier(tempRankedSongsByTier);
        setUnrankedSongs(tempUnrankedSongs);
      } catch (error) {
        console.error('Error fetching album data:', error);
      }
    };

    if (albumId) {
      fetchAlbumData();
    }
  }, [albumId]);

  if (!album) {
    return <div>Loading album data...</div>; // TODO: Add loading spinner or skeleton.
  }

  const paleAlbumColor = getPaleColor(album.color);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    // const draggedSong = songsById[parseInt(draggableId)]
    // TODO: Add logic for moving songs between unranked and ranked lists.
  };

  return (
    <div className="album-page-container" style={{ backgroundColor: paleAlbumColor }}>
      <h1 className="album-title">{album.title}</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container">
          <div className="tiers-column">
            <h2>Ranked Songs</h2>
            {tiers.map(tier => (
              <div key={tier.id} className="tier-container">
                <h3 className="tier-header">{tier.name}</h3>
                <Droppable droppableId={tier.id.toString()}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="tier-songs-container"
                    >
                      {rankedSongsByTier[tier.id] && rankedSongsByTier[tier.id].map((song, index) => (
                        <Draggable key={song.id} draggableId={song.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="song-card"
                            >
                              <SongCard song={song} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
          <div className="unranked-column">
            <h2>Unranked Songs</h2>
            <Droppable droppableId="unranked">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="unranked-songs-container"
                >
                  {unrankedSongs.map((song, index) => (
                    <Draggable key={song.id} draggableId={song.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="song-card"
                        >
                          <SongCard song={song} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

export default AlbumPage;