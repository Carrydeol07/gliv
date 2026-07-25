import React from 'react';

interface ContributorCardProps {
  contributors: any[];
}

export const ContributorCard: React.FC<ContributorCardProps> = ({ contributors }) => {
  if (!contributors || contributors.length === 0) {
    return null;
  }

  // Group by role
  const grouped = contributors.reduce((acc: any, c: any) => {
    if (!acc[c.role]) acc[c.role] = [];
    acc[c.role].push(c);
    return acc;
  }, {});

  return (
    <div className="contributor-card panel">
      <h3>Contributors</h3>
      {Object.keys(grouped).map(role => (
        <div key={role} className="contributor-role-group">
          <h4>{role}</h4>
          <ul>
            {grouped[role].map((c: any) => (
              <li key={c.id}>
                {/* Links to a placeholder Contributor Page */}
                <a href={`/contributor/${c.id}`}>{c.name}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
