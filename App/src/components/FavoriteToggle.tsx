import React from 'react';

interface FavoriteToggleProps {
  favorite: boolean;
  onToggleFavorite: () => void;
}

export const FavoriteToggle: React.FC<FavoriteToggleProps> = ({ favorite, onToggleFavorite }) => {
  return (
    <button 
      className={`favorite-toggle ${favorite ? 'active' : ''}`} 
      onClick={onToggleFavorite}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {favorite ? '★' : '☆'}
    </button>
  );
};
