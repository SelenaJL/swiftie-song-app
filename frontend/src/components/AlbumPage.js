// src/components/AlbumPage.js
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useParams } from 'react-router-dom';
import SongCard from './SongCard';
import { getPaleColor } from '../utils/colorUtils';
import '../AlbumPage.css';
import useAlbumData from '../hooks/useAlbumData';
import useDragAndDropRanking from '../hooks/useDragAndDropRanking';

function AlbumPage() {
  const { albumId } = useParams();
  const { tiers, album, songsById, rankedSongsByTier, unrankedSongs, setRankedSongsByTier, setUnrankedSongs } = useAlbumData(albumId);
  const onDragEnd = useDragAndDropRanking(
    songsById,
    rankedSongsByTier,
    unrankedSongs,
    setRankedSongsByTier,
    setUnrankedSongs,
  );
  
  if (!album) {
    return <div>Loading album data...</div>;
  }
  
  const paleAlbumColor = getPaleColor(album.color);

  return (
    <div className="album-page-container" style={{ backgroundColor: paleAlbumColor }}>
      <div className="topbar">
        <h1 className="album-title">{album.title}</h1>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container">
          {tiers.map(tier => (
            <div key={tier.id} className="tier-column">
              <h2 className="column-header">{tier.name}</h2>
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

          <div className="unranked-column">
            <h2 className="column-header">Unranked Songs</h2>
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