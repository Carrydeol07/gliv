import React from 'react';
import { RatingComponent } from '../../components/RatingComponent';
import { FavoriteToggle } from '../../components/FavoriteToggle';

interface SeriesHeaderProps {
  titleData: any;
  alternativeTitles: any[];
  onEditRating: (rating: number | null) => void;
  onToggleFavorite: () => void;
}

export const SeriesHeader: React.FC<SeriesHeaderProps> = ({ titleData, alternativeTitles, onEditRating, onToggleFavorite }) => {
  return (
    <div className="series-header">
      <div className="series-poster">
        <div className="poster-placeholder">
          {titleData.title?.charAt(0) || '?'}
        </div>
      </div>
      
      <div className="series-info">
        <h1 className="series-title">{titleData.title || 'Unknown Title'}</h1>
        
        {alternativeTitles && alternativeTitles.length > 0 && (
          <div className="alternative-titles">
            {alternativeTitles.map(at => at.alt_title).join(', ')}
          </div>
        )}
        
        <div className="series-actions">
          <RatingComponent rating={titleData.rating} onEditRating={onEditRating} />
          <FavoriteToggle favorite={titleData.favorite} onToggleFavorite={onToggleFavorite} />
        </div>
      </div>
    </div>
  );
};
