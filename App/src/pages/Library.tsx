import React, { useState, useEffect, useMemo } from 'react';
import { DatabaseService } from '../database/DatabaseService';
import { LibraryRepository } from '../services/library/LibraryRepository';
import { LibraryMutationService } from '../services/library/LibraryMutationService';
import { LibraryTitleData, LibraryFilterParams, SortMode } from '../services/library/types';
import { SeriesCard } from '../components/SeriesCard/SeriesCard';
import EmptyLibrary from './EmptyLibrary';
import './Library.css';

const dbService = new DatabaseService();
// Normally we'd use a dependency injection container or context, but for simplicity here:
if (!dbService.isReady()) {
  try {
    dbService.initialize();
  } catch (e) {
    console.error('Failed to init DB in Library', e);
  }
}

const libraryRepo = new LibraryRepository(dbService);
const mutationService = new LibraryMutationService(dbService);

export default function Library() {
  const [titles, setTitles] = useState<LibraryTitleData[]>([]);
  const [loading, setLoading] = useState(true);

  // View state
  const [viewMode, setViewMode] = useState<'Grid' | 'Shelf' | 'List'>('Grid');
  
  // Filter/Sort state
  const [searchString, setSearchString] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('Original Order');
  const [filters, setFilters] = useState<LibraryFilterParams>({});

  const loadLibrary = () => {
    setLoading(true);
    try {
      const data = libraryRepo.getLibrary(sortMode, filters, searchString);
      setTitles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, [sortMode, filters, searchString]);

  // Mutations
  const handleEditProgress = (formatId: number, progress: number) => {
    mutationService.editProgress(formatId, progress);
    loadLibrary();
  };

  const handleChangeStatus = (formatId: number, status: string) => {
    mutationService.changeStatus(formatId, status);
    loadLibrary();
  };

  const handleEditRating = (titleId: number, rating: number | null) => {
    mutationService.editRating(titleId, rating);
    loadLibrary();
  };

  const handleToggleFavorite = (titleId: number) => {
    mutationService.toggleFavorite(titleId);
    loadLibrary();
  };

  const handleEditNotes = (titleId: number, notes: string) => {
    mutationService.editNotes(titleId, notes);
    loadLibrary();
  };

  const renderContent = () => {
    if (loading) return <div>Loading library...</div>;
    if (titles.length === 0) {
      if (searchString || Object.keys(filters).length > 0) {
        return (
          <div className="empty-state">
            <h2>No matching Titles were found.</h2>
            <button onClick={() => { setSearchString(''); setFilters({}); }}>Clear Filters</button>
          </div>
        );
      }
      return <EmptyLibrary />;
    }

    return (
      <div className={`library-content view-${viewMode.toLowerCase()}`}>
        {titles.map(title => (
          <SeriesCard
            key={title.id}
            title={title}
            onEditProgress={handleEditProgress}
            onChangeStatus={handleChangeStatus}
            onEditRating={handleEditRating}
            onToggleFavorite={handleToggleFavorite}
            onEditNotes={handleEditNotes}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>Library</h1>
        
        <div className="library-controls">
          <input 
            type="text" 
            placeholder="Search library locally..." 
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            className="library-search"
          />

          <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}>
            <option value="Original Order">Original Order</option>
            <option value="Alphabetical">Alphabetical</option>
            <option value="Recently Added">Recently Added</option>
            <option value="Recently Updated">Recently Updated</option>
            <option value="Personal Rating">Personal Rating</option>
          </select>

          <select value={viewMode} onChange={(e) => setViewMode(e.target.value as any)}>
            <option value="Grid">Grid</option>
            <option value="Shelf">Shelf</option>
            <option value="List">List</option>
          </select>

          {/* Simple filter toggles for demonstration */}
          <button 
            className={filters.favoritesOnly ? 'active' : ''} 
            onClick={() => setFilters(f => ({ ...f, favoritesOnly: !f.favoritesOnly }))}
          >
            Favorites Only
          </button>
          
          <select 
            value={filters.status || ''} 
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value || undefined }))}
          >
            <option value="">Any Status</option>
            <option value="Reading">Reading</option>
            <option value="Watching">Watching</option>
            <option value="Completed">Completed</option>
            <option value="Paused">Paused</option>
            <option value="Dropped">Dropped</option>
          </select>

          <select 
            value={filters.mediaType || ''} 
            onChange={(e) => setFilters(f => ({ ...f, mediaType: e.target.value || undefined }))}
          >
            <option value="">Any Media</option>
            <option value="Anime">Anime</option>
            <option value="Manga">Manga</option>
            <option value="Novel">Novel</option>
          </select>

          {/* Stubs for arbitrary string/number filters for demonstration */}
          <input 
            type="text" 
            placeholder="Genre..." 
            className="library-search" 
            style={{ minWidth: '100px' }}
            value={filters.genre || ''} 
            onChange={(e) => setFilters(f => ({ ...f, genre: e.target.value || undefined }))} 
          />
          <input 
            type="text" 
            placeholder="Contributor..." 
            className="library-search" 
            style={{ minWidth: '120px' }}
            value={filters.contributor || ''} 
            onChange={(e) => setFilters(f => ({ ...f, contributor: e.target.value || undefined }))} 
          />
          <input 
            type="number" 
            placeholder="Min Rating..." 
            className="library-search" 
            style={{ width: '100px' }}
            min="1" max="10" step="0.5"
            value={filters.minRating || ''} 

            onChange={(e) => setFilters(f => ({ ...f, minRating: e.target.value ? parseFloat(e.target.value) : undefined }))} 
          />
          <input 
            type="number" 
            placeholder="Collection ID..." 
            className="library-search" 
            style={{ width: '120px' }}
            value={filters.collectionId || ''} 
            onChange={(e) => setFilters(f => ({ ...f, collectionId: e.target.value ? parseInt(e.target.value, 10) : undefined }))} 
          />
          <input 
            type="number" 
            placeholder="Personal Tag ID..." 
            className="library-search" 
            style={{ width: '130px' }}
            value={filters.personalTagId || ''} 
            onChange={(e) => setFilters(f => ({ ...f, personalTagId: e.target.value ? parseInt(e.target.value, 10) : undefined }))} 
          />
        </div>
      </div>

      <div className="library-scroll-area">
        {renderContent()}
      </div>
    </div>
  );
}
