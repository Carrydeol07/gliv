import React from 'react';
import { ProgressWidget } from '../../components/ProgressWidget';
import { AvailabilityPanel } from './AvailabilityPanel';

interface FormatCardProps {
  format: any;
  effectiveLatest?: number;
  onIncrementProgress: () => void;
  onOpenEditProgress: () => void;
  onOpenOverrideDialog: () => void;
}

export const FormatCard: React.FC<FormatCardProps> = ({
  format,
  effectiveLatest,
  onIncrementProgress,
  onOpenEditProgress,
  onOpenOverrideDialog
}) => {
  const isManual = format.verification_state !== 'AUTO' && format.verification_state !== 'USER_CONFIRMED';

  const renderManualInfoPanel = () => (
    <div className="manual-info-panel">
      <h4>Manual Format</h4>
      <p>This format is managed manually and does not sync with providers.</p>
    </div>
  );

  return (
    <div className="format-card">
      <div className="format-card-header">
        <h3>{format.media_type}</h3>
        <span className="format-status">{format.status}</span>
      </div>

      <div className="format-card-dates">
        {format.start_date && <span className="start-date">Started: {format.start_date}</span>}
        {format.finish_date && <span className="finish-date"> | Finished: {format.finish_date}</span>}
      </div>

      <ProgressWidget 
        personalProgress={format.personal_progress}
        effectiveLatest={effectiveLatest}
        progressOverride={format.progress_override}
        progressUnit={format.progress_unit}
        isManual={isManual}
        onIncrementProgress={onIncrementProgress}
        onOpenEditProgress={onOpenEditProgress}
        onOpenOverrideDialog={onOpenOverrideDialog}
      />

      {isManual ? renderManualInfoPanel() : (
        <AvailabilityPanel 
          publicationInfo={format.publicationInfo}
          officialPlatforms={format.officialPlatforms}
          scanlationGroups={format.scanlationGroups}
        />
      )}
    </div>
  );
};
