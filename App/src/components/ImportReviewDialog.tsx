import React from 'react';

interface ImportReviewDialogProps {
  candidate: any;
  onConfirm: () => void;
  onReject: () => void;
}

export const ImportReviewDialog: React.FC<ImportReviewDialogProps> = ({
  candidate,
  onConfirm,
  onReject
}) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-content import-review-dialog">
        <h3>Review Import</h3>
        
        <div className="candidate-info">
          <p><strong>Title:</strong> {candidate.title || candidate.importedData?.title}</p>
          <p><strong>Provider Match:</strong> {candidate.suggestedProviderMatch?.providerId}</p>
          <p><strong>Confidence:</strong> {candidate.suggestedProviderMatch?.confidence}</p>
        </div>

        <p>Do you want to import this format into your library?</p>

        <div className="dialog-actions">
          <button onClick={onReject}>Cancel / Skip</button>
          <button className="primary-button" onClick={onConfirm}>Confirm Import</button>
        </div>
      </div>
    </div>
  );
};
