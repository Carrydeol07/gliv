import React from 'react';

export default function EmptyLibrary() {
  return (
    <div className="empty-library">
      <h2>Your Library is empty.</h2>
      <div className="empty-library-actions">
        {/* These would normally use React Router's Link or a navigation hook */}
        <button onClick={() => window.location.hash = '#/discover'}>Discover Titles</button>
        <button onClick={() => window.location.hash = '#/settings/import'}>Import Library</button>
        <button onClick={() => alert('Create Manual Title UI pending')}>Create Manual Title</button>
      </div>
    </div>
  );
}
