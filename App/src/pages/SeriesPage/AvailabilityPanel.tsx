import React from 'react';

interface AvailabilityPanelProps {
  publicationInfo: any;
  officialPlatforms: any[];
  scanlationGroups: any[];
}

export const AvailabilityPanel: React.FC<AvailabilityPanelProps> = ({
  publicationInfo,
  officialPlatforms,
  scanlationGroups
}) => {
  if (!publicationInfo && officialPlatforms.length === 0 && scanlationGroups.length === 0) {
    return null;
  }

  return (
    <div className="availability-panel panel">
      <h3>Availability & Publication</h3>
      
      {publicationInfo && (
        <div className="publication-info">
          <p><strong>Publisher:</strong> {publicationInfo.official_publisher || 'Unknown'}</p>
          <p><strong>Status:</strong> {publicationInfo.publication_status}</p>
          <p><strong>License:</strong> {publicationInfo.license_status}</p>
        </div>
      )}

      {officialPlatforms.length > 0 && (
        <div className="official-platforms">
          <h4>Official Platforms</h4>
          <ul>
            {officialPlatforms.map(op => (
              <li key={op.id}>{op.platform_name}</li>
            ))}
          </ul>
        </div>
      )}

      {scanlationGroups.length > 0 && (
        <div className="scanlation-groups">
          <h4>Scanlation Groups</h4>
          <ul>
            {scanlationGroups.map(sg => (
              <li key={sg.id}>
                {sg.group_name} - Latest: {sg.latest_release} 
                {sg.active_status && ` (${sg.active_status})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
