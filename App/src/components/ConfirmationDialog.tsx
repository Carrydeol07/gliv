import React from 'react';

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-content confirmation-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        
        <div className="dialog-actions">
          <button onClick={onCancel}>{cancelText}</button>
          <button className="danger-button" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};
