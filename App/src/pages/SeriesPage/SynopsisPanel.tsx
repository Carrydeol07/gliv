import React from 'react';

interface SynopsisPanelProps {
  metadata: any;
}

export const SynopsisPanel: React.FC<SynopsisPanelProps> = ({ metadata }) => {
  if (!metadata || !metadata.synopsis) {
    return null;
  }

  return (
    <div className="synopsis-panel panel">
      <h3>Synopsis</h3>
      <p>{metadata.synopsis}</p>
    </div>
  );
};
