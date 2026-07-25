import React, { useState } from 'react';

interface EditProgressDialogProps {
  currentProgress: number;
  currentStatus: string;
  progressUnit: string;
  onSave: (progress: number, status: string) => void;
  onCancel: () => void;
}

export const EditProgressDialog: React.FC<EditProgressDialogProps> = ({
  currentProgress,
  currentStatus,
  progressUnit,
  onSave,
  onCancel
}) => {
  const [progress, setProgress] = useState(currentProgress);
  const [status, setStatus] = useState(currentStatus);

  const handleSave = () => {
    onSave(progress, status);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content edit-progress-dialog">
        <h3>Edit Progress</h3>
        
        <div className="form-group">
          <label>Progress ({progressUnit})</label>
          <input 
            type="number" 
            value={progress} 
            onChange={e => setProgress(parseInt(e.target.value) || 0)} 
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="Reading">Reading</option>
            <option value="Watching">Watching</option>
            <option value="Completed">Completed</option>
            <option value="Paused">Paused</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>

        <div className="dialog-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};
