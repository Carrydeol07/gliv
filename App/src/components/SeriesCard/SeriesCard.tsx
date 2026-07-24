import React, { useState, MouseEvent } from 'react';
import { LibraryTitleData, LibraryFormatData } from '../../services/library/types';
import './SeriesCard.css';

interface SeriesCardProps {
  title: LibraryTitleData;
  onEditProgress?: (formatId: number, progress: number) => void;
  onChangeStatus?: (formatId: number, status: string) => void;
  onEditRating?: (titleId: number, rating: number | null) => void;
  onToggleFavorite?: (titleId: number) => void;
  onEditNotes?: (titleId: number, notes: string) => void;
  onToggleCollection?: (titleId: number, collectionId: number) => void;
  onClick?: (titleId: number) => void;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({
  title,
  onEditProgress,
  onChangeStatus,
  onEditRating,
  onToggleFavorite,
  onEditNotes,
  onToggleCollection,
  onClick
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleQuickAction = (e: MouseEvent, action: string, payload?: any) => {
    e.stopPropagation();
    if (action === 'favorite' && onToggleFavorite) {
      onToggleFavorite(title.id);
    }
  };

  const renderFormatSummary = (format: LibraryFormatData) => {
    const isCompleted = format.status === 'Completed';
    const hasTotal = format.effectiveLatest !== undefined;
    const progressText = hasTotal ? `${format.personalProgress} / ${format.effectiveLatest}` : `${format.personalProgress}`;
    
    return (
      <div key={format.id} className="format-summary-row">
        <span className="format-type">{format.mediaType}</span>
        <span className="format-progress">{progressText} {format.progressUnit}</span>
      </div>
    );
  };

  return (
    <>
      <div 
        className="series-card" 
        onClick={() => onClick && onClick(title.id)}
        onContextMenu={handleContextMenu}
      >
        <div className="series-card-poster">
          {/* Placeholder for Poster - Lazy load logic usually goes here */}
          <div className="poster-placeholder">
            <span>{title.displayTitle.charAt(0)}</span>
          </div>
          
          <div className="series-card-indicators">
            {/* Stub for Update Indicator (Module 10) */}
            <span className="indicator update-indicator" title="Update Indicator (Stub)" style={{ color: '#007bff' }}>●</span>
            {title.favorite && <span className="indicator favorite">★</span>}
            {title.rating !== null && <span className="indicator rating">{title.rating}</span>}
          </div>

          <div className="series-card-hover-actions">
            <button onClick={(e) => handleQuickAction(e, 'favorite')}>
              {title.favorite ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        </div>
        
        <div className="series-card-content">
          <h3 className="series-card-title">{title.displayTitle}</h3>
          {title.primaryContributor && (
            <div className="series-card-contributor">{title.primaryContributor}</div>
          )}
          
          <div className="series-card-formats">
            {title.formats.map(renderFormatSummary)}
          </div>
        </div>
      </div>

      {contextMenu && (
        <div 
          className="context-menu-overlay" 
          onClick={closeContextMenu}
          onContextMenu={(e) => { e.preventDefault(); closeContextMenu(); }}
        >
          <div 
            className="context-menu" 
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="context-menu-item" onClick={() => { onToggleFavorite?.(title.id); closeContextMenu(); }}>
              Toggle Favorite
            </div>
            <div className="context-menu-item" onClick={() => {
              const newNotes = prompt('Edit Notes', title.notes || '');
              if (newNotes !== null) onEditNotes?.(title.id, newNotes);
              closeContextMenu();
            }}>
              Edit Notes
            </div>
            <div className="context-menu-item" onClick={() => {
              const ratingStr = prompt('Edit Rating (1.0 - 10.0)', title.rating?.toString() || '');
              if (ratingStr !== null) {
                const r = parseFloat(ratingStr);
                if (!isNaN(r)) onEditRating?.(title.id, r);
              }
              closeContextMenu();
            }}>
              Edit Rating
            </div>
            {/* Iterating formats for Progress / Status edits */}
            {title.formats.map(f => (
              <React.Fragment key={f.id}>
                <div className="context-menu-divider" />
                <div className="context-menu-header">{f.mediaType}</div>
                <div className="context-menu-item" onClick={() => {
                  const pStr = prompt(`Edit Progress (${f.progressUnit})`, f.personalProgress.toString());
                  if (pStr !== null) {
                    const p = parseInt(pStr, 10);
                    if (!isNaN(p)) onEditProgress?.(f.id, p);
                  }
                  closeContextMenu();
                }}>
                  Edit Progress
                </div>
                <div className="context-menu-item" onClick={() => {
                  const s = prompt(`Change Status (Reading, Watching, Completed, Paused, Dropped)`, f.status);
                  if (s) onChangeStatus?.(f.id, s);
                  closeContextMenu();
                }}>
                  Change Status
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
