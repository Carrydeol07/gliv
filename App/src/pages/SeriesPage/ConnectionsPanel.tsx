import React from 'react';

interface ConnectionsPanelProps {
  connections: any[];
}

export const ConnectionsPanel: React.FC<ConnectionsPanelProps> = ({ connections }) => {
  if (!connections || connections.length === 0) {
    return null;
  }

  return (
    <div className="connections-panel panel">
      <h3>Connections</h3>
      <ul>
        {connections.map(conn => (
          <li key={conn.id}>
            <span className="relationship-type">{conn.relationship}:</span>{' '}
            <a href={`/series/${conn.to_title_id}`}>
              {conn.display_title || `Title #${conn.to_title_id}`}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
