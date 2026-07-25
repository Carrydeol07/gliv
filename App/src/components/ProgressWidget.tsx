import React from 'react';

interface ProgressWidgetProps {
  personalProgress: number;
  effectiveLatest?: number;
  progressOverride: number | null;
  progressUnit: string;
  isManual: boolean;
  onIncrementProgress: () => void;
  onOpenEditProgress: () => void;
  onOpenOverrideDialog: () => void;
}

export const ProgressWidget: React.FC<ProgressWidgetProps> = ({
  personalProgress,
  effectiveLatest,
  progressOverride,
  progressUnit,
  isManual,
  onIncrementProgress,
  onOpenEditProgress,
  onOpenOverrideDialog
}) => {
  return (
    <div className="progress-widget">
      <div className="progress-display">
        <span className="personal-progress">{personalProgress}</span>
        {!isManual && effectiveLatest !== undefined && (
          <>
            <span className="progress-separator"> / </span>
            <span className={`effective-latest ${progressOverride !== null ? 'has-override' : ''}`}>
              {effectiveLatest}
            </span>
          </>
        )}
        <span className="progress-unit"> {progressUnit}</span>
      </div>
      
      <div className="progress-actions">
        <button onClick={onIncrementProgress}>+1</button>
        <button onClick={onOpenEditProgress}>Edit</button>
        {!isManual && (
          <button onClick={onOpenOverrideDialog}>
            {progressOverride !== null ? 'Edit Override' : 'Set Override'}
          </button>
        )}
      </div>
    </div>
  );
};
