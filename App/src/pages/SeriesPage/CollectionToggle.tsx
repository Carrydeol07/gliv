import React from 'react';

interface CollectionToggleProps {
  allCollections: any[];
  titleMemberships: any[]; // collection_items rows for this title
  onToggleMembership: (collectionId: number) => void;
}

export const CollectionToggle: React.FC<CollectionToggleProps> = ({ 
  allCollections, 
  titleMemberships, 
  onToggleMembership 
}) => {
  if (!allCollections || allCollections.length === 0) return null;

  return (
    <div className="collection-toggle-panel panel">
      <h3>Collections</h3>
      <ul className="collection-list">
        {allCollections.map(collection => {
          const isMember = titleMemberships.some(m => m.collection_id === collection.id);
          return (
            <li key={collection.id}>
              <label>
                <input 
                  type="checkbox" 
                  checked={isMember} 
                  onChange={() => onToggleMembership(collection.id)} 
                />
                {collection.name}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
