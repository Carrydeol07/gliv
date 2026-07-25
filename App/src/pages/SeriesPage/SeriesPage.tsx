import React, { useState, useEffect } from 'react';
import { SeriesService, SeriesData } from '../../services/series/SeriesService';
import { ProgressService } from '../../services/progress/ProgressService';
import { DatabaseService } from '../../database/DatabaseService';

import { SeriesHeader } from './SeriesHeader';
import { FormatCard } from './FormatCard';
import { ConnectionsPanel } from './ConnectionsPanel';
import { ContributorCard } from './ContributorCard';
import { PersonalNotesPanel } from './PersonalNotesPanel';
import { CollectionToggle } from './CollectionToggle';
import { SynopsisPanel } from './SynopsisPanel';

import { EditProgressDialog } from '../../components/EditProgressDialog';
import { ProgressOverrideDialog } from '../../components/ProgressOverrideDialog';
import { FormatSearchDialog } from '../../components/FormatSearchDialog';
import { ImportReviewDialog } from '../../components/ImportReviewDialog';

// Mock DB instantiation for demonstration. In a real app this is likely provided by context or dependency injection.
const dbService = new DatabaseService();
const seriesService = new SeriesService(dbService);
const progressService = new ProgressService(dbService);

interface SeriesPageProps {
  titleId: number;
}

export const SeriesPage: React.FC<SeriesPageProps> = ({ titleId }) => {
  const [data, setData] = useState<SeriesData | null>(null);
  const [selectedFormatId, setSelectedFormatId] = useState<number | null>(null);

  const [isEditProgressOpen, setIsEditProgressOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  
  const [searchCandidate, setSearchCandidate] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [titleId]);

  const loadData = () => {
    try {
      const seriesData = seriesService.getSeriesData(titleId);
      setData(seriesData);
      if (seriesData.formats.length > 0 && selectedFormatId === null) {
        setSelectedFormatId(seriesData.formats[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <div>Loading...</div>;

  const selectedFormat = data.formats.find(f => f.id === selectedFormatId);

  const handleEditRating = (rating: number | null) => {
    seriesService.updateRating(titleId, rating);
    loadData();
  };

  const handleToggleFavorite = () => {
    seriesService.toggleFavorite(titleId);
    loadData();
  };

  const handleSaveNotes = (notes: string) => {
    seriesService.updateNotes(titleId, notes);
    loadData();
  };

  const handleToggleCollection = (collectionId: number) => {
    seriesService.toggleCollectionMembership(titleId, collectionId);
    loadData();
  };

  const handleSaveProgress = (progress: number, status: string) => {
    if (selectedFormatId) {
      seriesService.updateProgress(selectedFormatId, progress, status);
      setIsEditProgressOpen(false);
      loadData();
    }
  };

  const handleSaveOverride = (override: number) => {
    if (selectedFormatId) {
      if (selectedFormat?.progress_override === null || selectedFormat?.progress_override === undefined) {
        progressService.createOverride(selectedFormatId, override);
      } else {
        progressService.editOverride(selectedFormatId, override);
      }
      setIsOverrideOpen(false);
      loadData();
    }
  };

  const handleRemoveOverride = () => {
    if (selectedFormatId) {
      progressService.removeOverride(selectedFormatId, 'MANUAL');
      setIsOverrideOpen(false);
      loadData();
    }
  };

  let effectiveLatest: number | undefined = undefined;
  if (selectedFormat) {
    const latestOfficial = selectedFormat.publicationInfo?.latest_official_release ?? null;
    const latestScanlation = selectedFormat.publicationInfo?.latest_scanlation_release ?? null;
    effectiveLatest = progressService.calculateEffectiveLatest(
      selectedFormat.progress_override,
      latestOfficial,
      latestScanlation
    );
  }

  return (
    <div className="series-page">
      <SeriesHeader 
        titleData={data.title} 
        alternativeTitles={data.alternativeTitles}
        onEditRating={handleEditRating} 
        onToggleFavorite={handleToggleFavorite} 
      />

      <div className="format-tabs">
        {data.formats.map(f => (
          <button 
            key={f.id} 
            className={`tab ${f.id === selectedFormatId ? 'active' : ''}`}
            onClick={() => setSelectedFormatId(f.id)}
          >
            {f.media_type}
          </button>
        ))}
        <button className="tab add-format-btn" onClick={() => setIsSearchOpen(true)}>
          + Add Another Format
        </button>
      </div>

      <div className="series-content">
        <div className="main-column">
          {selectedFormat && (
            <FormatCard 
              format={selectedFormat}
              effectiveLatest={effectiveLatest}
              onIncrementProgress={() => {
                seriesService.updateProgress(selectedFormat.id, selectedFormat.personal_progress + 1, selectedFormat.status);
                loadData();
              }}
              onOpenEditProgress={() => setIsEditProgressOpen(true)}
              onOpenOverrideDialog={() => setIsOverrideOpen(true)}
            />
          )}

          <SynopsisPanel metadata={data.metadata} />

          <PersonalNotesPanel 
            notesContent={data.notes?.content || ''} 
            onSaveNotes={handleSaveNotes} 
          />
        </div>

        <div className="sidebar-column">
          <ConnectionsPanel connections={data.connections} />
          <ContributorCard contributors={data.contributors} />
          <CollectionToggle 
            allCollections={data.collections} 
            titleMemberships={data.collectionItems} 
            onToggleMembership={handleToggleCollection} 
          />
        </div>
      </div>

      {isEditProgressOpen && selectedFormat && (
        <EditProgressDialog 
          currentProgress={selectedFormat.personal_progress} 
          currentStatus={selectedFormat.status} 
          progressUnit={selectedFormat.progress_unit} 
          onSave={handleSaveProgress} 
          onCancel={() => setIsEditProgressOpen(false)} 
        />
      )}

      {isOverrideOpen && selectedFormat && (
        <ProgressOverrideDialog 
          currentOverride={selectedFormat.progress_override} 
          personalProgress={selectedFormat.personal_progress} 
          effectiveLatest={effectiveLatest} 
          progressUnit={selectedFormat.progress_unit} 
          onSave={handleSaveOverride} 
          onRemove={handleRemoveOverride}
          onCancel={() => setIsOverrideOpen(false)} 
        />
      )}

      {isSearchOpen && (
        <FormatSearchDialog 
          isSearching={false}
          searchResults={[]} // Stub for search logic
          onSearch={(q) => console.log('Searching for:', q)}
          onSelectResult={(res) => {
            setSearchCandidate(res);
            setIsSearchOpen(false);
            setIsReviewOpen(true);
          }}
          onCreateManual={() => {
            // Trigger manual format creation via Committer
            setIsSearchOpen(false);
          }}
          onCancel={() => setIsSearchOpen(false)}
        />
      )}

      {isReviewOpen && searchCandidate && (
        <ImportReviewDialog 
          candidate={searchCandidate}
          onConfirm={() => {
            // Call Committer.commit
            setIsReviewOpen(false);
          }}
          onReject={() => setIsReviewOpen(false)}
        />
      )}
    </div>
  );
};
