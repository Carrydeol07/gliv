import React, { useState } from 'react';

interface ProgressOverrideDialogProps {
  currentOverride: number | null;
  personalProgress: number;
  effectiveLatest?: number;
  progressUnit: string;
  onSave: (override: number) => void;
  onRemove: () => void;
  onCancel: () => void;
}

export const ProgressOverrideDialog: React.FC<ProgressOverrideDialogProps> = ({
  currentOverride,
  personalProgress,
  effectiveLatest,
  progressUnit,
  onSave,
  onRemove,
  onCancel
}) => {
  const [override, setOverride] = useState<number>(currentOverride !== null ? currentOverride : (effectiveLatest || personalProgress + 1));
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (override <= personalProgress) {
      setError(`Override must be strictly greater than your personal progress (${personalProgress}).`);
      return;
    }
    onSave(override);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content progress-override-dialog">
        <h3>{currentOverride !== null ? 'Edit Progress Override' : 'Set Progress Override'}</h3>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Override Value ({progressUnit})</label>
          <input 
            type="number" 
            value={override} 
            onChange={e => {
              setError(null);
              setOverride(parseInt(e.target.value) || 0);
            }} 
          />
        </div>

        <div className="dialog-actions">
          {currentOverride !== null && (
            <button className="danger-button" onClick={onRemove}>Remove Override</button>
          )}
          <button onClick={onCancel}>Cancel</button>
          <button onClick={handleSave}>Save Override</button>
        </div>
      </div>
    </div>
  );
};
